import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Link, 
  CreditCard, 
  CheckCircle, 
  Upload,
  DollarSign,
  Star
} from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: any;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: "Profile Setup",
    description: "Create your creator profile",
    icon: User
  },
  {
    id: 2,
    title: "Vanity URL",
    description: "Claim your custom link",
    icon: Link
  },
  {
    id: 3,
    title: "Payment Setup",
    description: "Connect Stripe for payouts",
    icon: CreditCard
  },
  {
    id: 4,
    title: "Ready to Go!",
    description: "Start monetizing your fanbase",
    icon: CheckCircle
  }
];

export function CreatorOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    bio: "",
    avatar: "",
    tipGoal: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStripeConnect = () => {
    console.log("Connecting to Stripe...");
    // Here you would integrate with Stripe Connect
    handleNext();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback className="text-lg">
                  {formData.displayName ? formData.displayName.charAt(0) : "?"}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange("displayName", e.target.value)}
                  placeholder="Your creator name"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell your fans about yourself..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tipGoal">Monthly Tip Goal (Optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="tipGoal"
                    type="number"
                    value={formData.tipGoal}
                    onChange={(e) => handleInputChange("tipGoal", e.target.value)}
                    placeholder="1000"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-gradient-primary text-white p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-2">Your Vanity URL</h3>
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-sm opacity-80">tip2talk.com/</span>
                  <span className="font-bold">{formData.username || "username"}</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="username">Choose Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value.toLowerCase())}
                placeholder="yourcreatorname"
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be your unique link to share with fans
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-2">Perfect for:</h4>
              <ul className="text-sm space-y-1">
                <li>• Instagram & TikTok bio links</li>
                <li>• Twitter profile</li>
                <li>• YouTube channel description</li>
                <li>• Business cards & merchandise</li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-gradient-success text-white p-6 rounded-lg mb-6">
                <CreditCard className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Connect Stripe</h3>
                <p className="text-sm opacity-90">
                  Secure payouts directly to your bank account
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">Why Stripe?</h4>
                <ul className="text-sm space-y-1">
                  <li>• Instant payouts (available in 24 hours)</li>
                  <li>• Industry-leading security</li>
                  <li>• Support for 135+ currencies</li>
                  <li>• Detailed payment analytics</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-1">Revenue Split</h4>
                <p className="text-sm text-blue-700">
                  You keep 80% of all tips and payments. Tip2Talk takes 20% to maintain the platform.
                </p>
              </div>
            </div>

            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={handleStripeConnect}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Connect Stripe Account
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="bg-gradient-creator text-white p-8 rounded-lg">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">You're All Set! 🎉</h3>
              <p className="opacity-90">
                Your creator profile is ready to start earning
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-3">Your Creator Dashboard</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Profile URL:</span>
                    <Badge variant="secondary">tip2talk.com/{formData.username}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Payment Status:</span>
                    <Badge className="bg-success text-success-foreground">Connected</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Verification:</span>
                    <Badge variant="outline">
                      <Star className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>1. Share your link on social media</li>
                  <li>2. Create exclusive content for fans</li>
                  <li>3. Engage with supporters through chat</li>
                  <li>4. Schedule video calls with top supporters</li>
                </ul>
              </div>
            </div>

            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={() => window.location.href = `/dashboard/${formData.username}`}
            >
              Go to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Welcome to Tip2Talk
          </h1>
          <p className="text-muted-foreground">
            Professional creator monetization platform
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                currentStep >= step.id 
                  ? 'bg-primary text-primary-foreground shadow-glow' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-center max-w-16">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              {steps[currentStep - 1]?.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              {steps[currentStep - 1]?.description}
            </p>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentStep > 1 && currentStep < 4 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {currentStep < 3 && (
            <Button 
              variant="default" 
              onClick={handleNext} 
              className="flex-1"
              disabled={
                (currentStep === 1 && !formData.displayName) ||
                (currentStep === 2 && !formData.username)
              }
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}