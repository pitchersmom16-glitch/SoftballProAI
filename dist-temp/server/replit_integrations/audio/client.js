"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = void 0;
exports.detectAudioFormat = detectAudioFormat;
exports.convertToWav = convertToWav;
exports.ensureCompatibleFormat = ensureCompatibleFormat;
exports.voiceChat = voiceChat;
exports.voiceChatStream = voiceChatStream;
exports.textToSpeech = textToSpeech;
exports.textToSpeechStream = textToSpeechStream;
exports.speechToText = speechToText;
exports.speechToTextStream = speechToTextStream;
var openai_1 = __importStar(require("openai"));
var node_buffer_1 = require("node:buffer");
var child_process_1 = require("child_process");
var promises_1 = require("fs/promises");
var crypto_1 = require("crypto");
var os_1 = require("os");
var path_1 = require("path");
exports.openai = new openai_1.default({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "sk-placeholder",
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});
/**
 * Detect audio format from buffer magic bytes.
 * Supports: WAV, MP3, WebM (Chrome/Firefox), MP4/M4A/MOV (Safari/iOS), OGG
 */
function detectAudioFormat(buffer) {
    if (buffer.length < 12)
        return "unknown";
    // WAV: RIFF....WAVE
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
        return "wav";
    }
    // WebM: EBML header
    if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
        return "webm";
    }
    // MP3: ID3 tag or frame sync
    if ((buffer[0] === 0xff && (buffer[1] === 0xfb || buffer[1] === 0xfa || buffer[1] === 0xf3)) ||
        (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33)) {
        return "mp3";
    }
    // MP4/M4A/MOV: ....ftyp (Safari/iOS records in these containers)
    if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
        return "mp4";
    }
    // OGG: OggS
    if (buffer[0] === 0x4f && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53) {
        return "ogg";
    }
    return "unknown";
}
/**
 * Convert any audio/video format to WAV using ffmpeg.
 * Uses temp files instead of pipes because video containers (MP4/MOV)
 * require seeking to find the audio track.
 */
function convertToWav(audioBuffer) {
    return __awaiter(this, void 0, Promise, function () {
        var inputPath, outputPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputPath = (0, path_1.join)((0, os_1.tmpdir)(), "input-".concat((0, crypto_1.randomUUID)()));
                    outputPath = (0, path_1.join)((0, os_1.tmpdir)(), "output-".concat((0, crypto_1.randomUUID)(), ".wav"));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 5, 8]);
                    // Write input to temp file (required for video containers that need seeking)
                    return [4 /*yield*/, (0, promises_1.writeFile)(inputPath, audioBuffer)];
                case 2:
                    // Write input to temp file (required for video containers that need seeking)
                    _a.sent();
                    // Run ffmpeg with file paths
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var ffmpeg = (0, child_process_1.spawn)("ffmpeg", [
                                "-i", inputPath,
                                "-vn", // Extract audio only (ignore video track)
                                "-f", "wav",
                                "-ar", "16000", // 16kHz sample rate (good for speech)
                                "-ac", "1", // Mono
                                "-acodec", "pcm_s16le",
                                "-y", // Overwrite output
                                outputPath,
                            ]);
                            ffmpeg.stderr.on("data", function () { }); // Suppress logs
                            ffmpeg.on("close", function (code) {
                                if (code === 0)
                                    resolve();
                                else
                                    reject(new Error("ffmpeg exited with code ".concat(code)));
                            });
                            ffmpeg.on("error", reject);
                        })];
                case 3:
                    // Run ffmpeg with file paths
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.readFile)(outputPath)];
                case 4: 
                // Read converted audio
                return [2 /*return*/, _a.sent()];
                case 5: 
                // Clean up temp files
                return [4 /*yield*/, (0, promises_1.unlink)(inputPath).catch(function () { })];
                case 6:
                    // Clean up temp files
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.unlink)(outputPath).catch(function () { })];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Auto-detect and convert audio to OpenAI-compatible format.
 * - WAV/MP3: Pass through (already compatible)
 * - WebM/MP4/OGG: Convert to WAV via ffmpeg
 */
function ensureCompatibleFormat(audioBuffer) {
    return __awaiter(this, void 0, Promise, function () {
        var detected, wavBuffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    detected = detectAudioFormat(audioBuffer);
                    if (detected === "wav")
                        return [2 /*return*/, { buffer: audioBuffer, format: "wav" }];
                    if (detected === "mp3")
                        return [2 /*return*/, { buffer: audioBuffer, format: "mp3" }];
                    return [4 /*yield*/, convertToWav(audioBuffer)];
                case 1:
                    wavBuffer = _a.sent();
                    return [2 /*return*/, { buffer: wavBuffer, format: "wav" }];
            }
        });
    });
}
/**
 * Voice Chat: User speaks, LLM responds with audio (audio-in, audio-out).
 * Uses gpt-audio model via Replit AI Integrations.
 * Note: Browser records WebM/opus - convert to WAV using ffmpeg before calling this.
 */
function voiceChat(audioBuffer_1) {
    return __awaiter(this, arguments, Promise, function (audioBuffer, voice, inputFormat, outputFormat) {
        var audioBase64, response, message, transcript, audioData;
        var _a, _b, _c, _d;
        if (voice === void 0) { voice = "alloy"; }
        if (inputFormat === void 0) { inputFormat = "wav"; }
        if (outputFormat === void 0) { outputFormat = "mp3"; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    audioBase64 = audioBuffer.toString("base64");
                    return [4 /*yield*/, exports.openai.chat.completions.create({
                            model: "gpt-audio",
                            modalities: ["text", "audio"],
                            audio: { voice: voice, format: outputFormat },
                            messages: [{
                                    role: "user",
                                    content: [
                                        { type: "input_audio", input_audio: { data: audioBase64, format: inputFormat } },
                                    ],
                                }],
                        })];
                case 1:
                    response = _e.sent();
                    message = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message;
                    transcript = ((_b = message === null || message === void 0 ? void 0 : message.audio) === null || _b === void 0 ? void 0 : _b.transcript) || (message === null || message === void 0 ? void 0 : message.content) || "";
                    audioData = (_d = (_c = message === null || message === void 0 ? void 0 : message.audio) === null || _c === void 0 ? void 0 : _c.data) !== null && _d !== void 0 ? _d : "";
                    return [2 /*return*/, {
                            transcript: transcript,
                            audioResponse: node_buffer_1.Buffer.from(audioData, "base64"),
                        }];
            }
        });
    });
}
/**
 * Streaming Voice Chat: For real-time audio responses.
 * Note: Streaming only supports pcm16 output format.
 *
 * @example
 * // Converting browser WebM to WAV before calling:
 * const webmBuffer = Buffer.from(req.body.audio, "base64");
 * const wavBuffer = await convertWebmToWav(webmBuffer);
 * for await (const chunk of voiceChatStream(wavBuffer)) { ... }
 */
function voiceChatStream(audioBuffer_1) {
    return __awaiter(this, arguments, Promise, function (audioBuffer, voice, inputFormat) {
        var audioBase64, stream;
        if (voice === void 0) { voice = "alloy"; }
        if (inputFormat === void 0) { inputFormat = "wav"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    audioBase64 = audioBuffer.toString("base64");
                    return [4 /*yield*/, exports.openai.chat.completions.create({
                            model: "gpt-audio",
                            modalities: ["text", "audio"],
                            audio: { voice: voice, format: "pcm16" },
                            messages: [{
                                    role: "user",
                                    content: [
                                        { type: "input_audio", input_audio: { data: audioBase64, format: inputFormat } },
                                    ],
                                }],
                            stream: true,
                        })];
                case 1:
                    stream = _a.sent();
                    return [2 /*return*/, (function () {
                            return __asyncGenerator(this, arguments, function () {
                                var _a, stream_1, stream_1_1, chunk, delta, e_1_1;
                                var _b, e_1, _c, _d;
                                var _e, _f, _g, _h;
                                return __generator(this, function (_j) {
                                    switch (_j.label) {
                                        case 0:
                                            _j.trys.push([0, 10, 11, 16]);
                                            _a = true, stream_1 = __asyncValues(stream);
                                            _j.label = 1;
                                        case 1: return [4 /*yield*/, __await(stream_1.next())];
                                        case 2:
                                            if (!(stream_1_1 = _j.sent(), _b = stream_1_1.done, !_b)) return [3 /*break*/, 9];
                                            _d = stream_1_1.value;
                                            _a = false;
                                            chunk = _d;
                                            delta = (_f = (_e = chunk.choices) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.delta;
                                            if (!delta)
                                                return [3 /*break*/, 8];
                                            if (!((_g = delta === null || delta === void 0 ? void 0 : delta.audio) === null || _g === void 0 ? void 0 : _g.transcript)) return [3 /*break*/, 5];
                                            return [4 /*yield*/, __await({ type: "transcript", data: delta.audio.transcript })];
                                        case 3: return [4 /*yield*/, _j.sent()];
                                        case 4:
                                            _j.sent();
                                            _j.label = 5;
                                        case 5:
                                            if (!((_h = delta === null || delta === void 0 ? void 0 : delta.audio) === null || _h === void 0 ? void 0 : _h.data)) return [3 /*break*/, 8];
                                            return [4 /*yield*/, __await({ type: "audio", data: delta.audio.data })];
                                        case 6: return [4 /*yield*/, _j.sent()];
                                        case 7:
                                            _j.sent();
                                            _j.label = 8;
                                        case 8:
                                            _a = true;
                                            return [3 /*break*/, 1];
                                        case 9: return [3 /*break*/, 16];
                                        case 10:
                                            e_1_1 = _j.sent();
                                            e_1 = { error: e_1_1 };
                                            return [3 /*break*/, 16];
                                        case 11:
                                            _j.trys.push([11, , 14, 15]);
                                            if (!(!_a && !_b && (_c = stream_1.return))) return [3 /*break*/, 13];
                                            return [4 /*yield*/, __await(_c.call(stream_1))];
                                        case 12:
                                            _j.sent();
                                            _j.label = 13;
                                        case 13: return [3 /*break*/, 15];
                                        case 14:
                                            if (e_1) throw e_1.error;
                                            return [7 /*endfinally*/];
                                        case 15: return [7 /*endfinally*/];
                                        case 16: return [2 /*return*/];
                                    }
                                });
                            });
                        })()];
            }
        });
    });
}
/**
 * Text-to-Speech: Converts text to speech verbatim.
 * Uses gpt-audio model via Replit AI Integrations.
 */
function textToSpeech(text_1) {
    return __awaiter(this, arguments, Promise, function (text, voice, format) {
        var response, audioData;
        var _a, _b, _c, _d;
        if (voice === void 0) { voice = "alloy"; }
        if (format === void 0) { format = "wav"; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, exports.openai.chat.completions.create({
                        model: "gpt-audio",
                        modalities: ["text", "audio"],
                        audio: { voice: voice, format: format },
                        messages: [
                            { role: "system", content: "You are an assistant that performs text-to-speech." },
                            { role: "user", content: "Repeat the following text verbatim: ".concat(text) },
                        ],
                    })];
                case 1:
                    response = _e.sent();
                    audioData = (_d = (_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.audio) === null || _c === void 0 ? void 0 : _c.data) !== null && _d !== void 0 ? _d : "";
                    return [2 /*return*/, node_buffer_1.Buffer.from(audioData, "base64")];
            }
        });
    });
}
/**
 * Streaming Text-to-Speech: Converts text to speech with real-time streaming.
 * Uses gpt-audio model via Replit AI Integrations.
 * Note: Streaming only supports pcm16 output format.
 */
function textToSpeechStream(text_1) {
    return __awaiter(this, arguments, Promise, function (text, voice) {
        var stream;
        if (voice === void 0) { voice = "alloy"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.openai.chat.completions.create({
                        model: "gpt-audio",
                        modalities: ["text", "audio"],
                        audio: { voice: voice, format: "pcm16" },
                        messages: [
                            { role: "system", content: "You are an assistant that performs text-to-speech." },
                            { role: "user", content: "Repeat the following text verbatim: ".concat(text) },
                        ],
                        stream: true,
                    })];
                case 1:
                    stream = _a.sent();
                    return [2 /*return*/, (function () {
                            return __asyncGenerator(this, arguments, function () {
                                var _a, stream_2, stream_2_1, chunk, delta, e_2_1;
                                var _b, e_2, _c, _d;
                                var _e, _f, _g;
                                return __generator(this, function (_h) {
                                    switch (_h.label) {
                                        case 0:
                                            _h.trys.push([0, 7, 8, 13]);
                                            _a = true, stream_2 = __asyncValues(stream);
                                            _h.label = 1;
                                        case 1: return [4 /*yield*/, __await(stream_2.next())];
                                        case 2:
                                            if (!(stream_2_1 = _h.sent(), _b = stream_2_1.done, !_b)) return [3 /*break*/, 6];
                                            _d = stream_2_1.value;
                                            _a = false;
                                            chunk = _d;
                                            delta = (_f = (_e = chunk.choices) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.delta;
                                            if (!delta)
                                                return [3 /*break*/, 5];
                                            if (!((_g = delta === null || delta === void 0 ? void 0 : delta.audio) === null || _g === void 0 ? void 0 : _g.data)) return [3 /*break*/, 5];
                                            return [4 /*yield*/, __await(delta.audio.data)];
                                        case 3: return [4 /*yield*/, _h.sent()];
                                        case 4:
                                            _h.sent();
                                            _h.label = 5;
                                        case 5:
                                            _a = true;
                                            return [3 /*break*/, 1];
                                        case 6: return [3 /*break*/, 13];
                                        case 7:
                                            e_2_1 = _h.sent();
                                            e_2 = { error: e_2_1 };
                                            return [3 /*break*/, 13];
                                        case 8:
                                            _h.trys.push([8, , 11, 12]);
                                            if (!(!_a && !_b && (_c = stream_2.return))) return [3 /*break*/, 10];
                                            return [4 /*yield*/, __await(_c.call(stream_2))];
                                        case 9:
                                            _h.sent();
                                            _h.label = 10;
                                        case 10: return [3 /*break*/, 12];
                                        case 11:
                                            if (e_2) throw e_2.error;
                                            return [7 /*endfinally*/];
                                        case 12: return [7 /*endfinally*/];
                                        case 13: return [2 /*return*/];
                                    }
                                });
                            });
                        })()];
            }
        });
    });
}
/**
 * Speech-to-Text: Transcribes audio using dedicated transcription model.
 * Uses gpt-4o-mini-transcribe for accurate transcription.
 */
function speechToText(audioBuffer_1) {
    return __awaiter(this, arguments, Promise, function (audioBuffer, format) {
        var file, response;
        if (format === void 0) { format = "wav"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, openai_1.toFile)(audioBuffer, "audio.".concat(format))];
                case 1:
                    file = _a.sent();
                    return [4 /*yield*/, exports.openai.audio.transcriptions.create({
                            file: file,
                            model: "gpt-4o-mini-transcribe",
                        })];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.text];
            }
        });
    });
}
/**
 * Streaming Speech-to-Text: Transcribes audio with real-time streaming.
 * Uses gpt-4o-mini-transcribe for accurate transcription.
 */
function speechToTextStream(audioBuffer_1) {
    return __awaiter(this, arguments, Promise, function (audioBuffer, format) {
        var file, stream;
        if (format === void 0) { format = "wav"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, openai_1.toFile)(audioBuffer, "audio.".concat(format))];
                case 1:
                    file = _a.sent();
                    return [4 /*yield*/, exports.openai.audio.transcriptions.create({
                            file: file,
                            model: "gpt-4o-mini-transcribe",
                            stream: true,
                        })];
                case 2:
                    stream = _a.sent();
                    return [2 /*return*/, (function () {
                            return __asyncGenerator(this, arguments, function () {
                                var _a, stream_3, stream_3_1, event, e_3_1;
                                var _b, e_3, _c, _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            _e.trys.push([0, 7, 8, 13]);
                                            _a = true, stream_3 = __asyncValues(stream);
                                            _e.label = 1;
                                        case 1: return [4 /*yield*/, __await(stream_3.next())];
                                        case 2:
                                            if (!(stream_3_1 = _e.sent(), _b = stream_3_1.done, !_b)) return [3 /*break*/, 6];
                                            _d = stream_3_1.value;
                                            _a = false;
                                            event = _d;
                                            if (!(event.type === "transcript.text.delta")) return [3 /*break*/, 5];
                                            return [4 /*yield*/, __await(event.delta)];
                                        case 3: return [4 /*yield*/, _e.sent()];
                                        case 4:
                                            _e.sent();
                                            _e.label = 5;
                                        case 5:
                                            _a = true;
                                            return [3 /*break*/, 1];
                                        case 6: return [3 /*break*/, 13];
                                        case 7:
                                            e_3_1 = _e.sent();
                                            e_3 = { error: e_3_1 };
                                            return [3 /*break*/, 13];
                                        case 8:
                                            _e.trys.push([8, , 11, 12]);
                                            if (!(!_a && !_b && (_c = stream_3.return))) return [3 /*break*/, 10];
                                            return [4 /*yield*/, __await(_c.call(stream_3))];
                                        case 9:
                                            _e.sent();
                                            _e.label = 10;
                                        case 10: return [3 /*break*/, 12];
                                        case 11:
                                            if (e_3) throw e_3.error;
                                            return [7 /*endfinally*/];
                                        case 12: return [7 /*endfinally*/];
                                        case 13: return [2 /*return*/];
                                    }
                                });
                            });
                        })()];
            }
        });
    });
}
