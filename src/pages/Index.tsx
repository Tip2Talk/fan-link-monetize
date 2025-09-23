import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreatorProfile } from "@/components/CreatorProfile";
import { CreatorOnboarding } from "@/components/CreatorOnboarding";
import genZHeroBg from "@/assets/gen-z-hero-bg.jpg";
import patreonLogo from "@/assets/logos/patreon-logo.png";
import cameoLogo from "@/assets/logos/cameo-logo.png";
import crunchbaseLogo from "@/assets/logos/crunchbase-logo.png";
import vimeoLogo from "@/assets/logos/vimeo-logo.png";
import { 
  DollarSign, 
  MessageCircle, 
  Video, 
  Lock,
  Star,
  Users,
  TrendingUp,
  Smartphone,
  ArrowRight,
  Globe,
  Zap,
  Heart,
  Shield,
  Sparkles
} from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'profile' | 'onboarding'>('landing');
  const [usernameInput, setUsernameInput] = useState('');

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
      {/* Hero Section - Gen Z Style */}
      <div className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <img 
            src={genZHeroBg} 
            alt="Gen Z Hero Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-cyber rounded-full blur-lg animate-pulse opacity-60"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-creator rounded-full blur-lg animate-pulse opacity-40"></div>
        <div className="absolute top-1/3 right-20 w-8 h-8 bg-gradient-success rounded-full blur-md animate-bounce opacity-50"></div>

        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center text-white z-10">
          <Badge className="bg-white/10 backdrop-blur-md text-white border border-white/20 mb-8 animate-fade-in shadow-neon">
            <Sparkles className="w-4 h-4 mr-2" />
            Next-Gen Creator Economy Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-black mb-8 animate-fade-in leading-tight">
            <span className="block bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              MONETIZE
            </span>
            <span className="block bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
              YOUR FANBASE
            </span>
            <span className="block text-3xl md:text-4xl font-medium mt-4 text-white/90">
              instantly & professionally
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Skip the adult platform stigma. Professional engagement tools for creators who want to 
            <span className="text-cyan-300 font-semibold"> monetize authentically</span> 🚀
          </p>
          
          {/* Enhanced Vanity URL Creator */}
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_50px_rgba(147,51,234,0.3)]">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-300" />
                    Create Your Tip2Talk Link
                  </h3>
                  
                  {/* Enhanced URL Preview */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-center gap-2 text-lg font-mono text-white">
                      <span className="text-white/70">tip2talk.com/</span>
                      <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent font-bold text-xl">
                        {usernameInput || 'your-username'}
                      </span>
                    </div>
                  </div>

                  {/* Username Input with Enhanced Styling */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Input
                        placeholder="your-username"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                        className="flex-1 text-center text-lg font-mono bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:border-cyan-300 focus:ring-cyan-300/50"
                        maxLength={20}
                      />
                      <Button 
                        onClick={() => setCurrentView('onboarding')}
                        disabled={!usernameInput || usernameInput.length < 3}
                        className="px-8 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white border-0 shadow-[0_0_20px_rgba(147,51,234,0.5)]"
                        size="lg"
                      >
                        Create Your Tip2Talk
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                    <p className="text-white/60 text-sm">
                      Once your account is created you can access your messages via apps on Apple and Android
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logos Section */}
          <div className="mb-12">
            <p className="text-white/70 mb-6 text-lg">Our chat & encryption privacy technology powers:</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <img src={patreonLogo} alt="Patreon" className="h-8 md:h-12 opacity-80 hover:opacity-100 transition-opacity" />
              <img src={cameoLogo} alt="Cameo" className="h-8 md:h-12 opacity-80 hover:opacity-100 transition-opacity" />
              <img src={crunchbaseLogo} alt="Crunchbase" className="h-8 md:h-12 opacity-80 hover:opacity-100 transition-opacity" />
              <img src={vimeoLogo} alt="Vimeo" className="h-8 md:h-12 opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              variant="default" 
              size="lg" 
              className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-[0_0_20px_rgba(147,51,234,0.5)]"
              onClick={() => setCurrentView('onboarding')}
            >
              <Users className="w-5 h-5 mr-2" />
              Start as Creator
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              onClick={() => setCurrentView('profile')}
            >
              <Smartphone className="w-5 h-5 mr-2" />
              View Demo Profile
            </Button>
          </div>

          {/* Gen Z Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">80%</div>
              <div className="text-sm text-white/70 font-medium">Creator Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-white/70 font-medium">Fan Access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-pink-300 to-cyan-300 bg-clip-text text-transparent">$1M+</div>
              <div className="text-sm text-white/70 font-medium">Creator Earnings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Gen Z Enhanced */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Everything You Need
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Creator Superpowers
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Professional tools designed for the next generation of content creators
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            {
              icon: DollarSign,
              title: "Instant Tips",
              description: "Fans send tips instantly via Stripe. You get paid in 24 hours with 80% revenue share.",
              gradient: "from-green-400 to-emerald-500"
            },
            {
              icon: MessageCircle,
              title: "1-on-1 Chat",
              description: "Private messaging with fans via encrypted real-time chat technology.",
              gradient: "from-purple-400 to-purple-600"
            },
            {
              icon: Video,
              title: "Video Calls",
              description: "Book and monetize video calls with your biggest supporters professionally.",
              gradient: "from-blue-400 to-cyan-500"
            },
            {
              icon: Shield,
              title: "Privacy First",
              description: "Bank-level encryption and security. Your data stays protected always.",
              gradient: "from-pink-400 to-rose-500"
            }
          ].map((feature, index) => (
            <Card key={index} className="group bg-white/50 backdrop-blur-sm border border-white/20 shadow-card hover:shadow-[0_0_30px_rgba(147,51,234,0.2)] transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partnership Section - Gen Z Enhanced */}
        <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white mb-20 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <CardContent className="p-12 text-center relative z-10">
            <Badge className="bg-white/20 text-white mb-6 border border-white/30">
              <Star className="w-4 h-4 mr-2" />
              Partnership Announcement
            </Badge>
            <h3 className="text-3xl md:text-4xl font-black mb-4">Arsenic Talent Integration</h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Launching with premium talent representation for verified creators. Get discovered by top brands and agencies.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge className="bg-white/20 text-white border border-white/30">
                <TrendingUp className="w-4 h-4 mr-2" />
                12-Day MVP Launch
              </Badge>
              <Badge className="bg-white/20 text-white border border-white/30">
                <Heart className="w-4 h-4 mr-2" />
                Premium Support
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section - Gen Z Enhanced */}
        <div className="text-center bg-gradient-to-r from-purple-50 to-cyan-50 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Ready to Level Up? 🚀
          </h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
            Join creators already earning with professional engagement tools. No adult content stigma, just pure monetization power.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="text-lg px-10 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white border-0 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
              onClick={() => setCurrentView('onboarding')}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Your Link Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-10 py-4 border-purple-300 text-purple-600 hover:bg-purple-50"
              onClick={() => window.location.href = '/dashboard'}
            >
              View User Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Footer - Gen Z Enhanced */}
      <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 py-12 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Tip2Talk
          </h3>
          <p className="text-white/70 mb-2">
            Professional Creator Monetization Platform
          </p>
          <p className="text-white/50 text-sm">
            Unlike OnlyFans, focused on professional branded engagement without adult stigma
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;