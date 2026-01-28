import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Zap, Crown, Users, Star, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  priceId?: string;
  description: string;
  features: string[];
  icon: any;
  popular?: boolean;
  color: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "basic",
    name: "Basic",
    price: 14.99,
    description: "Essential AI biomechanics for individual players",
    features: [
      "AI Video Analysis",
      "Biomechanics Breakdown",
      "Goal Tracking",
      "Basic Drill Library",
      "Progress Dashboard"
    ],
    icon: Zap,
    color: "purple"
  },
  {
    id: "elite",
    name: "Elite",
    price: 29.99,
    description: "Advanced coaching with personalized roadmaps",
    features: [
      "Everything in Basic",
      "AI Training Roadmap",
      "GameChanger Integration",
      "Public Recruiting Profile",
      "Mental Edge Content",
      "Priority Support"
    ],
    icon: Crown,
    popular: true,
    color: "pink"
  },
  {
    id: "coach",
    name: "Coach",
    price: 99.00,
    description: "Full platform for team and private coaching",
    features: [
      "Everything in Elite",
      "Team Roster Management",
      "Practice Architect",
      "Student Lesson Roster",
      "Team Stats Import",
      "Unlimited Athletes",
      "White-Label Ready"
    ],
    icon: Users,
    color: "cyan"
  }
];

export default function Pricing() {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; badge?: string } | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: products } = useQuery<any[]>({
    queryKey: ["/api/stripe/products"],
  });

  const validateCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/stripe/validate-coupon", { code });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.valid) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discount: data.percentOff,
          badge: data.badge
        });
        toast({
          title: "Coupon Applied!",
          description: `${data.percentOff}% discount applied to your subscription.`,
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: "This coupon code is not valid or has expired.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not validate coupon. Please try again.",
        variant: "destructive",
      });
    }
  });

  const checkoutMutation = useMutation({
    mutationFn: async ({ tierId, coupon }: { tierId: string; coupon?: string }) => {
      const res = await apiRequest("POST", "/api/stripe/checkout", { 
        tier: tierId,
        couponCode: coupon 
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({
        title: "Checkout Error",
        description: "Could not start checkout. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    validateCouponMutation.mutate(couponCode.toUpperCase());
  };

  const handleSubscribe = (tierId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setSelectedTier(tierId);
    checkoutMutation.mutate({ 
      tierId, 
      coupon: appliedCoupon?.code 
    });
  };

  const calculatePrice = (price: number) => {
    if (appliedCoupon) {
      return price * (1 - appliedCoupon.discount / 100);
    }
    return price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-4"
            data-testid="text-pricing-title"
          >
            Choose Your Training Path
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock AI-powered biomechanics analysis and take your softball skills to the next level.
          </p>
        </div>

        {appliedCoupon?.badge === "founding_member" && (
          <div className="mb-8 text-center">
            <Badge 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 text-lg"
              data-testid="badge-founding-member"
            >
              <Star className="w-5 h-5 mr-2" />
              Founding Member - Thank You for Your Support!
            </Badge>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <Card className="border-purple-500/30 bg-card/50 backdrop-blur p-4 inline-flex items-center gap-3">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="w-48"
              data-testid="input-coupon-code"
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={validateCouponMutation.isPending}
              variant="outline"
              className="border-purple-500/50"
              data-testid="button-apply-coupon"
            >
              {validateCouponMutation.isPending ? "Checking..." : "Apply"}
            </Button>
            {appliedCoupon && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {appliedCoupon.discount}% OFF
              </Badge>
            )}
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier) => (
            <Card
              key={tier.id}
              className={`relative overflow-hidden transition-all hover:scale-105 ${
                tier.popular 
                  ? "border-pink-500 shadow-lg shadow-pink-500/20" 
                  : "border-border/50"
              }`}
              data-testid={`card-tier-${tier.id}`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg bg-pink-500 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  tier.color === "purple" ? "bg-purple-500/20" :
                  tier.color === "pink" ? "bg-pink-500/20" : "bg-cyan-500/20"
                }`}>
                  <tier.icon className={`w-8 h-8 ${
                    tier.color === "purple" ? "text-purple-400" :
                    tier.color === "pink" ? "text-pink-400" : "text-cyan-400"
                  }`} />
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="mb-6">
                  {appliedCoupon && (
                    <p className="text-sm text-muted-foreground line-through">
                      ${tier.price.toFixed(2)}/mo
                    </p>
                  )}
                  <p className="text-4xl font-bold">
                    ${calculatePrice(tier.price).toFixed(2)}
                    <span className="text-base font-normal text-muted-foreground">/mo</span>
                  </p>
                  {appliedCoupon?.discount === 100 && (
                    <Badge className="mt-2 bg-green-500/20 text-green-400">FREE FOREVER</Badge>
                  )}
                </div>

                <ul className="space-y-3 text-left mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        tier.color === "purple" ? "text-purple-400" :
                        tier.color === "pink" ? "text-pink-400" : "text-cyan-400"
                      }`} />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={checkoutMutation.isPending && selectedTier === tier.id}
                  className={`w-full ${
                    tier.popular 
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600" 
                      : ""
                  }`}
                  variant={tier.popular ? "default" : "outline"}
                  data-testid={`button-subscribe-${tier.id}`}
                >
                  {checkoutMutation.isPending && selectedTier === tier.id 
                    ? "Processing..." 
                    : user ? "Subscribe Now" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 7-day free trial. Cancel anytime.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Secure payments powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
