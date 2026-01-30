import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CreditCard, User, Calendar, GraduationCap } from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

// Form validation schema - Parent-focused
const parentProfileSchema = z.object({
  // Parent Information
  parentFirstName: z.string().min(2, "Parent first name must be at least 2 characters"),
  parentLastName: z.string().min(2, "Parent last name must be at least 2 characters"),
  parentEmail: z.string().email("Please enter a valid email address"),
  parentPhone: z.string().refine((phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  }, "Please enter a valid phone number with at least 10 digits"),
  
  // Athlete Information
  athleteFirstName: z.string().min(2, "Athlete first name must be at least 2 characters"),
  athleteLastName: z.string().min(2, "Athlete last name must be at least 2 characters"),
  athleteDateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    // Allow reasonable age range for youth sports
    return age >= 5 && age <= 25;
  }, "Please enter a valid date of birth"),
  athleteGrade: z.string().min(1, "Please select your athlete's grade"),
  athleteSchool: z.string().min(2, "School name must be at least 2 characters"),
  
  // Terms and payment
  acceptTerms: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  acceptTrial: z.boolean().refine(val => val === true, "You must accept the 14-day trial terms"),
});

type ParentProfileFormData = z.infer<typeof parentProfileSchema>;

// Stripe payment form component
function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        throw error;
      }

      // Create subscription with trial
      const response = await apiRequest("POST", "/api/stripe/create-subscription", {
        paymentMethodId: paymentMethod.id,
        priceId: "price_1Qabcdefghijklmnop", // TODO: Replace with actual Stripe price ID for $14.99/month player subscription
      });

      if (!response.ok) {
        throw new Error("Failed to create subscription");
      }

      toast({
        title: "Payment successful!",
        description: "Your 14-day free trial has started. Welcome to SoftballProAI!",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card-element" className="text-whiteGlow flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Credit Card Information
        </Label>
        <div className="p-3 border border-electricPink/30 rounded-md bg-blacklightBase">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#F2F2F2",
                  "::placeholder": {
                    color: "#666",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="text-sm text-cyberBlue space-y-1">
        <p>• 14-day free trial - No charges until trial ends</p>
        <p>• $14.99/month after trial</p>
        <p>• Cancel anytime during trial</p>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-brand hover:opacity-90 text-whiteGlow font-semibold py-3"
      >
        {isProcessing ? "Processing..." : "Start Free Trial"}
      </Button>
    </form>
  );
}

// Main ProfileSetup component
export default function ProfileSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ParentProfileFormData>({
    resolver: zodResolver(parentProfileSchema),
    mode: "onBlur", // Changed from "onChange" to "onBlur" for better UX
  });

  const athleteDateOfBirth = watch("athleteDateOfBirth");
  const isAthleteUnder18 = athleteDateOfBirth ? (() => {
    const birthDate = new Date(athleteDateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age < 18;
  })() : false;

  // Debug: Log form validity
  console.log("Form isValid:", isValid, "Errors:", errors);

  const onSubmitProfile = async (data: ParentProfileFormData) => {
    try {
      // Save parent and athlete profile data
      const response = await apiRequest("POST", "/api/user/profile", {
        // Parent info
        parentFirstName: data.parentFirstName,
        parentLastName: data.parentLastName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone,
        // Athlete info
        athleteFirstName: data.athleteFirstName,
        athleteLastName: data.athleteLastName,
        athleteDateOfBirth: data.athleteDateOfBirth,
        athleteGrade: data.athleteGrade,
        athleteSchool: data.athleteSchool,
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      // CRITICAL: Invalidate the athlete query so OnboardingGate knows athlete now exists
      await queryClient.invalidateQueries({ queryKey: ["/api/player/athlete"] });

      toast({
        title: "Profile saved!",
        description: "Now let's set up your payment.",
      });

      setCurrentStep(2);
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = () => {
    // Check user role and redirect appropriately
    if (user?.role === "player") {
      // Players continue to position selection
      setLocation("/position/select");
    } else {
      // Parents go to athlete management dashboard
      setLocation("/athletes");
    }
  };

  const steps = [
    { title: "Your Info", icon: User },
    { title: "Payment", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gradient-circuit flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-blacklightBase border-electricPink/30">
        <CardHeader className="text-center">
          <CardTitle className="text-heading-l bg-gradient-brand bg-clip-text text-transparent">
            Parent Account Setup
          </CardTitle>
          <CardDescription className="text-cyberBlue">
            Create your account and add your athlete to start their AI coaching journey
          </CardDescription>

          {/* Progress indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index + 1 === currentStep;
                const isCompleted = index + 1 < currentStep;

                return (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-electricPink"
                          : isActive
                          ? "bg-cyberBlue"
                          : "bg-charcoal2"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-whiteGlow" />
                    </div>
                    <span
                      className={`ml-2 text-sm ${
                        isActive ? "text-cyberBlue font-semibold" : "text-whiteGlow/70"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className="w-8 h-0.5 bg-charcoal2 mx-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
              {/* Parent Information */}
              <div className="space-y-4">
                <h3 className="text-subheading text-limePop flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Parent/Guardian Information
                </h3>
                <p className="text-body text-cyberBlue">
                  We'll use this information for account management and communications.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentFirstName" className="text-whiteGlow">
                      Your First Name *
                    </Label>
                    <Input
                      id="parentFirstName"
                      {...register("parentFirstName")}
                      className="bg-charcoal2 border-electricPink/30 text-whiteGlow"
                      placeholder="Enter your first name"
                    />
                    {errors.parentFirstName && (
                      <p className="text-solarOrange text-sm">{errors.parentFirstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentLastName" className="text-whiteGlow">
                      Your Last Name *
                    </Label>
                    <Input
                      id="parentLastName"
                      {...register("parentLastName")}
                      className="bg-charcoal2 border-electricPink/30 text-whiteGlow"
                      placeholder="Enter your last name"
                    />
                    {errors.parentLastName && (
                      <p className="text-solarOrange text-sm">{errors.parentLastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentEmail" className="text-whiteGlow">
                      Your Email *
                    </Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      {...register("parentEmail")}
                      className="bg-charcoal2 border-electricPink/30 text-whiteGlow"
                      placeholder="your@email.com"
                    />
                    {errors.parentEmail && (
                      <p className="text-solarOrange text-sm">{errors.parentEmail.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentPhone" className="text-whiteGlow">
                      Your Phone *
                    </Label>
                    <Input
                      id="parentPhone"
                      type="tel"
                      {...register("parentPhone")}
                      className="bg-charcoal2 border-electricPink/30 text-whiteGlow"
                      placeholder="(555) 123-4567"
                    />
                    {errors.parentPhone && (
                      <p className="text-solarOrange text-sm">{errors.parentPhone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Athlete Information */}
              <div className="space-y-4">
                <h3 className="text-subheading text-electricPink flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Athlete Information
                </h3>
                <p className="text-body text-cyberBlue">
                  Tell us about your athlete so we can personalize their training experience.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="athleteFirstName" className="text-whiteGlow">
                      Athlete's First Name *
                    </Label>
                    <Input
                      id="athleteFirstName"
                      {...register("athleteFirstName")}
                      className="bg-charcoal2 border-electricPink/30 text-whiteGlow"
                      placeholder="Athlete's first name"
                    />
                    {errors.athleteFirstName && (
                      <p className="text-solarOrange text-sm">{errors.athleteFirstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="athleteLastName" className="text-whiteGlow">
                      Athlete's Last Name *
                    </Label>
                    <Input
                      id="athleteLastName"
                      {...register("athleteLastName")}
                      className="bg-charcoal2 border-electricPink/30 text-whiteGlow"
                      placeholder="Athlete's last name"
                    />
                    {errors.athleteLastName && (
                      <p className="text-solarOrange text-sm">{errors.athleteLastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="athleteDateOfBirth" className="text-whiteGlow flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date of Birth *
                    </Label>
                    <Input
                      id="athleteDateOfBirth"
                      type="date"
                      {...register("athleteDateOfBirth")}
                      className="bg-charcoal2 border-electricPink/30 text-whiteGlow"
                    />
                    {errors.athleteDateOfBirth && (
                      <p className="text-solarOrange text-sm">{errors.athleteDateOfBirth.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="athleteGrade" className="text-whiteGlow flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Grade *
                    </Label>
                    <Select onValueChange={(value) => setValue("athleteGrade", value)}>
                      <SelectTrigger className="bg-charcoal2 border-electricPink/30 text-whiteGlow">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3rd Grade</SelectItem>
                        <SelectItem value="4">4th Grade</SelectItem>
                        <SelectItem value="5">5th Grade</SelectItem>
                        <SelectItem value="6">6th Grade</SelectItem>
                        <SelectItem value="7">7th Grade</SelectItem>
                        <SelectItem value="8">8th Grade</SelectItem>
                        <SelectItem value="9">9th Grade</SelectItem>
                        <SelectItem value="10">10th Grade</SelectItem>
                        <SelectItem value="11">11th Grade</SelectItem>
                        <SelectItem value="12">12th Grade</SelectItem>
                        <SelectItem value="college">College</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.athleteGrade && (
                      <p className="text-solarOrange text-sm">{errors.athleteGrade.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="athleteSchool" className="text-whiteGlow">
                      School *
                    </Label>
                    <Input
                      id="athleteSchool"
                      {...register("athleteSchool")}
                      className="bg-charcoal2 border-electricPink/30 text-whiteGlow"
                      placeholder="School name"
                    />
                    {errors.athleteSchool && (
                      <p className="text-solarOrange text-sm">{errors.athleteSchool.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    {...register("acceptTerms")}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <Label htmlFor="acceptTerms" className="text-whiteGlow cursor-pointer">
                      I accept the{" "}
                      <a href="/terms" className="text-electricPink hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-electricPink hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                    {errors.acceptTerms && (
                      <p className="text-solarOrange text-sm mt-1">{errors.acceptTerms.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTrial"
                    {...register("acceptTrial")}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <Label htmlFor="acceptTrial" className="text-whiteGlow cursor-pointer">
                      I understand the 14-day free trial and will be charged $14.99/month after the trial ends
                    </Label>
                    {errors.acceptTrial && (
                      <p className="text-solarOrange text-sm mt-1">{errors.acceptTrial.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!isValid}
                className="w-full bg-gradient-brand hover:opacity-90 text-whiteGlow font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Parent Account & Continue to Payment
              </Button>

              {/* Debug: Show form status */}
              <div className="text-sm text-center mt-2">
                <span className={isValid ? "text-limePop" : "text-solarOrange"}>
                  Form Status: {isValid ? "Valid ✓" : "Invalid - Check required fields"}
                </span>
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <Elements stripe={stripePromise}>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-subheading text-limePop mb-2">Payment Information</h3>
                  <p className="text-body text-cyberBlue">
                    Start your 14-day free trial. No charges until the trial ends.
                  </p>
                </div>

                <PaymentForm onSuccess={handlePaymentSuccess} />

                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="border-electricPink/30 text-electricPink hover:bg-electricPink/10"
                  >
                    ← Back to Profile
                  </Button>
                </div>
              </div>
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  );
}