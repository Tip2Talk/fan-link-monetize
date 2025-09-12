import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import SocialLinks from "./SocialLinks";
import { 
  DollarSign, 
  MessageCircle, 
  Video, 
  Lock, 
  Star,
  Heart,
  Users,
  Calendar
} from "lucide-react";

interface CreatorProfileProps {
  creator: {
    id: string;
    username: string;
    displayName: string;
    bio: string;
    avatar: string;
    followerCount: number;
    verified: boolean;
    tipGoal?: number;
    tipReceived?: number;
    instagram?: string;
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
  };
}

export function CreatorProfile({ creator }: CreatorProfileProps) {
  const [activeTab, setActiveTab] = useState<'tip' | 'chat' | 'call' | 'content'>('tip');
  
  const tipPercentage = creator.tipGoal && creator.tipReceived 
    ? Math.min((creator.tipReceived / creator.tipGoal) * 100, 100)
    : 0;

  const handleAction = (action: string) => {
    console.log(`${action} action triggered for ${creator.username}`);
    // Here you would integrate with Supabase functions
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 pb-0">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
              <AvatarImage src={creator.avatar} alt={creator.displayName} />
              <AvatarFallback>{creator.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold">{creator.displayName}</h1>
                {creator.verified && (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm opacity-90">@{creator.username}</p>
              <div className="flex items-center gap-1 text-sm opacity-80">
                <Users className="w-4 h-4" />
                {creator.followerCount.toLocaleString()} followers
              </div>
            </div>
          </div>
          
          <p className="text-sm opacity-90 mb-4 leading-relaxed">{creator.bio}</p>
          
          {/* Social Links */}
          <SocialLinks 
            instagram={creator.instagram}
            socialLinks={creator.socialLinks}
            className="mb-6"
          />
          
          {/* Tip Progress */}
          {creator.tipGoal && (
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Monthly Goal</span>
                <span className="text-sm">${creator.tipReceived || 0} / ${creator.tipGoal}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-500"
                  style={{ width: `${tipPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Tabs */}
      <div className="max-w-md mx-auto px-6 -mt-2">
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { id: 'tip', icon: DollarSign, label: 'Send Tip', color: 'success' },
            { id: 'chat', icon: MessageCircle, label: 'Chat', color: 'primary' },
            { id: 'call', icon: Video, label: 'Video Call', color: 'creator' },
            { id: 'content', icon: Lock, label: 'Content', color: 'fan' }
          ].map((tab) => (
            <Card 
              key={tab.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                activeTab === tab.id ? 'ring-2 ring-primary shadow-card' : ''
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <CardContent className="p-4 text-center">
                <tab.icon className={`w-6 h-6 mx-auto mb-2 ${
                  activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <p className="text-xs font-medium">{tab.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Content */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            {activeTab === 'tip' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Send a Tip 💝</h3>
                <p className="text-sm text-muted-foreground">
                  Show your support with a tip! Choose an amount below or enter a custom amount.
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[5, 10, 25].map((amount) => (
                    <Button 
                      key={amount}
                      variant="outline" 
                      className="h-12"
                      onClick={() => handleAction(`tip-${amount}`)}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <Button 
                  variant="tip" 
                  size="lg" 
                  className="w-full"
                  onClick={() => handleAction('custom-tip')}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Send Custom Tip
                </Button>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Start a Chat 💬</h3>
                <p className="text-sm text-muted-foreground">
                  Get direct access to {creator.displayName}. Chat about anything!
                </p>
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full"
                  onClick={() => handleAction('start-chat')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat ($2/message)
                </Button>
              </div>
            )}

            {activeTab === 'call' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Book Video Call 📹</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule a 1-on-1 video call with {creator.displayName}.
                </p>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">15 min call</span>
                    <span className="text-sm font-medium">$50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">30 min call</span>
                    <span className="text-sm font-medium">$90</span>
                  </div>
                </div>
                <Button 
                  variant="creator" 
                  size="lg" 
                  className="w-full"
                  onClick={() => handleAction('book-call')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Call
                </Button>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Exclusive Content 🔒</h3>
                <p className="text-sm text-muted-foreground">
                  Unlock behind-the-scenes content, photos, and videos.
                </p>
                <div className="space-y-3">
                  {[
                    { title: 'Behind the Scenes Pack', price: 15, locked: true },
                    { title: 'Vacation Photo Set', price: 25, locked: true },
                    { title: 'Workout Routine Video', price: 20, locked: true }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{item.title}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="fan"
                        onClick={() => handleAction(`unlock-${index}`)}
                      >
                        ${item.price}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 text-xs text-muted-foreground">
          <p>Powered by Tip2Talk</p>
          <p className="mt-1">Professional creator monetization platform</p>
        </div>
      </div>
    </div>
  );
}