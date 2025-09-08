import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreatorProfile } from "@/components/CreatorProfile";
import { CreatorOnboarding } from "@/components/CreatorOnboarding";
import heroImage from "@/assets/hero-banner.jpg";
import { 
  DollarSign, 
  MessageCircle, 
  Video, 
  Lock,
  Star,
  Users,
  TrendingUp,
  Smartphone
} from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'profile' | 'onboarding'>('landing');

  // Mock creator data
  const mockCreator = {
    id: "1",
    username: "hello",
    displayName: "Alex Rivera",
    bio: "Content creator & lifestyle influencer. Sharing behind-the-scenes moments and connecting with amazing fans! 💫",
    avatar: "/placeholder.svg",
    followerCount: 24500,
    verified: true,
    tipGoal: 5000,
    tipReceived: 3200
  };

  if (currentView === 'profile') {
    return <CreatorProfile creator={mockCreator} />;
  }

  if (currentView === 'onboarding') {
    return <CreatorOnboarding />;
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Creator Economy Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <Badge className="bg-white/20 text-white mb-6 animate-float">
            <Star className="w-4 h-4 mr-1" />
            Professional Creator Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Monetize Your
            <span className="block bg-gradient-creator bg-clip-text text-transparent">
              Million Fans
            </span>
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Professional branded engagement tools for creators. Get tips, chat with fans, book video calls, and unlock exclusive content - all without adult platform stigma.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8"
              onClick={() => setCurrentView('onboarding')}
            >
              <Users className="w-5 h-5 mr-2" />
              Start as Creator
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              className="text-lg px-8"
              onClick={() => setCurrentView('profile')}
            >
              <Smartphone className="w-5 h-5 mr-2" />
              View Demo Profile
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold">80%</div>
              <div className="text-sm opacity-80">Creator Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm opacity-80">Fan Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">$1M+</div>
              <div className="text-sm opacity-80">Creator Earnings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything Creators Need</h2>
          <p className="text-muted-foreground text-lg">
            Professional tools to monetize your fanbase instantly
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: DollarSign,
              title: "Instant Tips",
              description: "Fans send tips instantly via Stripe. You get paid in 24 hours.",
              color: "success"
            },
            {
              icon: MessageCircle,
              title: "1-on-1 Chat",
              description: "Private messaging with fans via Supabase real-time chat.",
              color: "primary"
            },
            {
              icon: Video,
              title: "Video Calls",
              description: "Book and monetize video calls with your biggest supporters.",
              color: "creator"
            },
            {
              icon: Lock,
              title: "Exclusive Content",
              description: "Unlock behind-the-scenes content, photos, and videos.",
              color: "fan"
            }
          ].map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-glow transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-${feature.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partnership Section */}
        <Card className="shadow-card bg-gradient-creator text-white mb-16">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Partnership with Arsenic Talent</h3>
            <p className="text-lg opacity-90 mb-6">
              Launching with premium talent representation for verified creators
            </p>
            <Badge className="bg-white/20 text-white">
              <TrendingUp className="w-4 h-4 mr-1" />
              12-Day MVP Launch
            </Badge>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Monetize?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join creators already earning with professional engagement tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => setCurrentView('onboarding')}
            >
              Get Your Vanity Link
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open('https://tip2talk.com/hello/dashboard', '_blank')}
            >
              View Live Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-muted py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Tip2Talk - Professional Creator Monetization Platform
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Unlike OnlyFans, focused on professional branded engagement without adult stigma
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
