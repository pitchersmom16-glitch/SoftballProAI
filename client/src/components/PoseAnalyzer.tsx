import { useEffect, useRef, useState, useCallback } from "react";
import { Pose, Results, POSE_CONNECTIONS, NormalizedLandmark } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { AlertCircle, ChevronLeft, ChevronRight, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BiomechanicsMetrics {
  armSlotAngle: number | null;
  kneeFlexion: number | null;
  torqueSeparation: number | null;
}

interface PoseAnalyzerProps {
  videoUrl: string;
  onMetricsUpdate?: (metrics: BiomechanicsMetrics) => void;
  assessmentId?: number; // Optional: If provided, will save metrics to database
  autoSave?: boolean; // If true, automatically saves metrics every 5 seconds
}

const LANDMARK_INDICES = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

const MIN_VISIBILITY = 0.5;

function getLandmarkVisibility(landmark: NormalizedLandmark): number {
  return landmark.visibility ?? 0;
}

function calculateAngle(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): number {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return Math.round(angle);
}

function chooseDominantSide(landmarks: NormalizedLandmark[]): 'left' | 'right' {
  const rightScore = 
    getLandmarkVisibility(landmarks[LANDMARK_INDICES.RIGHT_SHOULDER]) +
    getLandmarkVisibility(landmarks[LANDMARK_INDICES.RIGHT_ELBOW]) +
    getLandmarkVisibility(landmarks[LANDMARK_INDICES.RIGHT_HIP]);
    
  const leftScore = 
    getLandmarkVisibility(landmarks[LANDMARK_INDICES.LEFT_SHOULDER]) +
    getLandmarkVisibility(landmarks[LANDMARK_INDICES.LEFT_ELBOW]) +
    getLandmarkVisibility(landmarks[LANDMARK_INDICES.LEFT_HIP]);
    
  return rightScore >= leftScore ? 'right' : 'left';
}

export default function PoseAnalyzer({ videoUrl, onMetricsUpdate, assessmentId, autoSave = false }: PoseAnalyzerProps) {
  console.log('POSE MODEL INITIALIZING');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastMetricsUpdate = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);
  const lastSaveTime = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackingLost, setTrackingLost] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [metrics, setMetrics] = useState<BiomechanicsMetrics>({
    armSlotAngle: null,
    kneeFlexion: null,
    torqueSeparation: null,
  });

  const SPEED_OPTIONS = [0.25, 0.5, 1] as const;

  const calculateMetrics = useCallback((landmarks: NormalizedLandmark[]): BiomechanicsMetrics | null => {
    if (!landmarks || landmarks.length < 33) {
      return null;
    }

    const side = chooseDominantSide(landmarks);
    
    const hip = side === 'right' 
      ? landmarks[LANDMARK_INDICES.RIGHT_HIP] 
      : landmarks[LANDMARK_INDICES.LEFT_HIP];
    const shoulder = side === 'right'
      ? landmarks[LANDMARK_INDICES.RIGHT_SHOULDER]
      : landmarks[LANDMARK_INDICES.LEFT_SHOULDER];
    const elbow = side === 'right'
      ? landmarks[LANDMARK_INDICES.RIGHT_ELBOW]
      : landmarks[LANDMARK_INDICES.LEFT_ELBOW];
    const knee = side === 'right'
      ? landmarks[LANDMARK_INDICES.RIGHT_KNEE]
      : landmarks[LANDMARK_INDICES.LEFT_KNEE];
    const ankle = side === 'right'
      ? landmarks[LANDMARK_INDICES.RIGHT_ANKLE]
      : landmarks[LANDMARK_INDICES.LEFT_ANKLE];

    if (
      getLandmarkVisibility(hip) < MIN_VISIBILITY ||
      getLandmarkVisibility(shoulder) < MIN_VISIBILITY ||
      getLandmarkVisibility(elbow) < MIN_VISIBILITY
    ) {
      return null;
    }

    const armSlotAngle = calculateAngle(hip, shoulder, elbow);

    let kneeFlexion: number | null = null;
    if (
      getLandmarkVisibility(hip) >= MIN_VISIBILITY &&
      getLandmarkVisibility(knee) >= MIN_VISIBILITY &&
      getLandmarkVisibility(ankle) >= MIN_VISIBILITY
    ) {
      kneeFlexion = calculateAngle(hip, knee, ankle);
    }

    const rightShoulder = landmarks[LANDMARK_INDICES.RIGHT_SHOULDER];
    const leftShoulder = landmarks[LANDMARK_INDICES.LEFT_SHOULDER];
    const rightHip = landmarks[LANDMARK_INDICES.RIGHT_HIP];
    const leftHip = landmarks[LANDMARK_INDICES.LEFT_HIP];
    
    let torqueSeparation: number | null = null;
    if (
      getLandmarkVisibility(rightShoulder) >= MIN_VISIBILITY &&
      getLandmarkVisibility(leftShoulder) >= MIN_VISIBILITY &&
      getLandmarkVisibility(rightHip) >= MIN_VISIBILITY &&
      getLandmarkVisibility(leftHip) >= MIN_VISIBILITY
    ) {
      const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
      if (shoulderWidth > 0.01) {
        const shoulderMidX = (rightShoulder.x + leftShoulder.x) / 2;
        const hipMidX = (rightHip.x + leftHip.x) / 2;
        const rawSeparation = Math.abs(shoulderMidX - hipMidX);
        torqueSeparation = Math.round((rawSeparation / shoulderWidth) * 100);
      }
    }

    return {
      armSlotAngle,
      kneeFlexion,
      torqueSeparation,
    };
  }, []);

  const onResults = useCallback((results: Results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks && results.poseLandmarks.length > 0) {
      setTrackingLost(false);
      
      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#39FF14",
        lineWidth: 3,
      });

      drawLandmarks(ctx, results.poseLandmarks, {
        color: "#FF10F0",
        fillColor: "#FF10F0",
        lineWidth: 1,
        radius: 4,
      });

      const now = Date.now();
      if (now - lastMetricsUpdate.current > 500) {
        const newMetrics = calculateMetrics(results.poseLandmarks);
        if (newMetrics) {
          setMetrics(newMetrics);
          onMetricsUpdate?.(newMetrics);
          
          // Auto-save to database if enabled and assessment ID provided
          if (autoSave && assessmentId && now - lastSaveTime.current > 5000) {
            saveBiomechanicsToDatabase(assessmentId, newMetrics);
            lastSaveTime.current = now;
          }
        }
        lastMetricsUpdate.current = now;
      }
    } else {
      setTrackingLost(true);
      setMetrics({ armSlotAngle: null, kneeFlexion: null, torqueSeparation: null });
      onMetricsUpdate?.({ armSlotAngle: null, kneeFlexion: null, torqueSeparation: null });
    }
  }, [calculateMetrics, onMetricsUpdate]);

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);

    poseRef.current = pose;

    pose.initialize()
      .then(() => {
        setIsLoading(false);
        setLoadError(null);
      })
      .catch((err) => {
        console.error("MediaPipe initialization failed:", err);
        setIsLoading(false);
        setLoadError("Failed to load pose detection model");
      });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      isProcessingRef.current = false;
      pose.close();
    };
  }, [onResults]);

  const processFrame = useCallback(async () => {
    const video = videoRef.current;
    const pose = poseRef.current;

    if (!video || !pose || video.paused || video.ended || !isProcessingRef.current) {
      isProcessingRef.current = false;
      return;
    }

    try {
      await pose.send({ image: video });
    } catch (err) {
      console.error("Pose detection error:", err);
    }

    if (isProcessingRef.current) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
    }
  }, []);

  const startProcessing = useCallback(() => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    processFrame();
  }, [processFrame]);

  const stopProcessing = useCallback(() => {
    isProcessingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Save biomechanics to database
  const saveBiomechanicsToDatabase = async (assessmentId: number, metrics: BiomechanicsMetrics) => {
    try {
      await fetch('/api/analysis/biomechanics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          assessmentId,
          armSlotAngle: metrics.armSlotAngle,
          kneeFlexion: metrics.kneeFlexion,
          torqueSeparation: metrics.torqueSeparation,
        }),
      });
    } catch (error) {
      console.error('Failed to save biomechanics:', error);
    }
  };

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    startProcessing();
  }, [startProcessing]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    stopProcessing();
  }, [stopProcessing]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    stopProcessing();
  }, [stopProcessing]);

  const handleSeeked = useCallback(async () => {
    if (!videoRef.current?.paused && isProcessingRef.current === false) {
      startProcessing();
    }
    // Process single frame when paused and seeked
    if (videoRef.current?.paused && poseRef.current) {
      try {
        await poseRef.current.send({ image: videoRef.current });
      } catch (err) {
        console.error("Frame processing error:", err);
      }
    }
  }, [startProcessing]);

  const changeSpeed = useCallback((speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  }, []);

  const stepFrame = useCallback(async (direction: 'forward' | 'backward') => {
    const video = videoRef.current;
    if (!video) return;
    
    // Each frame at ~30fps is about 0.033s, we'll use 0.04s for safety
    const frameTime = 0.04;
    const newTime = direction === 'forward' 
      ? Math.min(video.currentTime + frameTime, video.duration)
      : Math.max(video.currentTime - frameTime, 0);
    
    video.currentTime = newTime;
    
    // Process frame immediately for pose overlay sync
    if (poseRef.current) {
      try {
        await poseRef.current.send({ image: video });
      } catch (err) {
        console.error("Frame processing error:", err);
      }
    }
  }, []);

  // Keyboard event handler for frame-by-frame control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepFrame('backward');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepFrame('forward');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepFrame]);

  if (loadError) {
    return (
      <div className="relative w-full">
        <div className="aspect-video relative bg-black rounded-xl overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-white text-lg font-medium mb-2">Pose Detection Unavailable</p>
            <p className="text-slate-400 text-sm">{loadError}</p>
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain mt-4"
              data-testid="video-player-fallback"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="aspect-video relative bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full h-full object-contain"
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onSeeked={handleSeeked}
          crossOrigin="anonymous"
          data-testid="video-player"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          data-testid="pose-canvas"
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-[#39FF14] border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-white text-sm">Loading Pose Detection...</p>
            </div>
          </div>
        )}

        {trackingLost && isPlaying && (
          <div className="absolute top-4 right-4 bg-red-500/80 px-3 py-1 rounded-full flex items-center gap-2">
            <AlertCircle className="h-3 w-3 text-white" />
            <span className="text-white text-xs font-medium">TRACKING LOST</span>
          </div>
        )}
      </div>

      {isPlaying && !trackingLost && (
        <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#39FF14] animate-pulse" />
          <span className="text-white text-xs font-medium">ANALYZING</span>
        </div>
      )}

      {/* Playback Controls */}
      <div className="mt-4 flex items-center justify-between gap-4 bg-slate-900/80 p-3 rounded-lg" data-testid="playback-controls">
        {/* Frame-by-Frame Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => stepFrame('backward')}
            className="h-8 px-2 border-slate-700 hover:border-purple-500 hover:bg-purple-900/30"
            data-testid="button-frame-backward"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Frame
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => stepFrame('forward')}
            className="h-8 px-2 border-slate-700 hover:border-purple-500 hover:bg-purple-900/30"
            data-testid="button-frame-forward"
          >
            Frame
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <span className="text-xs text-slate-500 ml-2 hidden sm:inline">
            (← → keys)
          </span>
        </div>

        {/* Slow Motion Controls */}
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 hidden sm:inline">Speed:</span>
          <div className="flex gap-1">
            {SPEED_OPTIONS.map((speed) => (
              <Button
                key={speed}
                size="sm"
                variant={playbackSpeed === speed ? "default" : "outline"}
                onClick={() => changeSpeed(speed)}
                className={`h-7 px-2 text-xs ${
                  playbackSpeed === speed 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 border-0" 
                    : "border-slate-700 hover:border-pink-500"
                }`}
                data-testid={`button-speed-${speed}x`}
              >
                {speed}x
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3" data-testid="live-metrics">
        <div className="bg-slate-900 p-3 rounded-lg text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Arm Slot</p>
          <p className="text-2xl font-bold text-[#39FF14]" data-testid="metric-arm-slot">
            {metrics.armSlotAngle !== null ? `${metrics.armSlotAngle}°` : "--"}
          </p>
        </div>
        <div className="bg-slate-900 p-3 rounded-lg text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Knee Flexion</p>
          <p className="text-2xl font-bold text-[#39FF14]" data-testid="metric-knee-flexion">
            {metrics.kneeFlexion !== null ? `${metrics.kneeFlexion}°` : "--"}
          </p>
        </div>
        <div className="bg-slate-900 p-3 rounded-lg text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Torque Sep</p>
          <p className="text-2xl font-bold text-[#39FF14]" data-testid="metric-torque-sep">
            {metrics.torqueSeparation !== null ? `${metrics.torqueSeparation}%` : "--"}
          </p>
        </div>
      </div>
    </div>
  );
}
