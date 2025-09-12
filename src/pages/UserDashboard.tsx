import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CreatorProfile } from "@/components/CreatorProfile";
import AuthComponent from "@/components/Auth/AuthComponent";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  MessageCircle, 
  Video, 
  Settings, 
  Clock,
  DollarSign,
  Star,
  Play,
  Lock,
  Users,
  Calendar,
  Gift,
  TrendingUp,
  Bookmark
} from "lucide-react";

// Mock data for user dashboard
const mockUserData = {
  user: {
    id: "user123",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "/placeholder.svg",
    joined: "2024-01-15",
    tier: "Premium Fan"
  },
  stats: {
    totalSpent: 450,
    creatorsFollowed: 8,
    messagesExchanged: 234,
    videoCalls: 3,
    contentUnlocked: 12
  },
  subscriptions: [
    {
      id: "sub1",
      creator: {
        id: "1",
        username: "hello",
        displayName: "Alex Rivera",
        avatar: "/placeholder.svg",
        verified: true
      },
      tier: "VIP",
      monthlyAmount: 25,
      nextBilling: "2024-12-15",
      since: "2024-06-01"
    }
  ],
  recentActivity: [
    { id: 1, type: "tip", creator: "Alex Rivera", amount: 15, time: "2 hours ago" },
    { id: 2, type: "message", creator: "Alex Rivera", content: "Thanks for the support!", time: "1 day ago" },
    { id: 3, type: "call", creator: "Alex Rivera", duration: "30 min", time: "3 days ago" },
    { id: 4, type: "unlock", creator: "Alex Rivera", content: "Exclusive photo set", time: "1 week ago" }
  ],
  upcomingCalls: [
    { id: 1, creator: "Alex Rivera", time: "Today 7:00 PM", duration: "15 min", amount: 45 }
  ],
  favoriteCreators: [
    {
      id: "1",
      username: "hello",
      displayName: "Alex Rivera",
      avatar: "/placeholder.svg",
      verified: true,
      bio: "Content creator & lifestyle influencer. Sharing behind-the-scenes moments!",
      followerCount: 24500,
      tipGoal: 5000,
      tipReceived: 3200,
      instagram: "@alexrivera",
      socialLinks: [
        { platform: "youtube", url: "alexrivera" },
        { platform: "twitter", url: "alexrivera" }
      ]
    }
  ]
};

export default function UserDashboard() {
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    toast({
      title: "Welcome!",
      description: "You're now logged in to your dashboard.",
    });
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedCreator(null);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  // Show auth component if not logged in
  if (!user) {
    return <AuthComponent onAuthSuccess={handleAuthSuccess} />;
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "tip": return <DollarSign className="w-4 h-4 text-green-500" />;
      case "message": return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "call": return <Video className="w-4 h-4 text-purple-500" />;
      case "unlock": return <Lock className="w-4 h-4 text-orange-500" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case "tip": return `Sent $${activity.amount} tip to ${activity.creator}`;
      case "message": return `${activity.creator}: ${activity.content}`;
      case "call": return `${activity.duration} video call with ${activity.creator}`;
      case "unlock": return `Unlocked: ${activity.content} from ${activity.creator}`;
      default: return "Activity";
    }
  };

  if (selectedCreator) {
    const creator = mockUserData.favoriteCreators.find(c => c.id === selectedCreator);
    if (creator) {
      return (
        <div>
          <div className="p-4 border-b bg-muted/50">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCreator(null)}
              className="mb-2"
            >
              ← Back to Dashboard
            </Button>
          </div>
          <CreatorProfile creator={creator} />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-white">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="opacity-90">{mockUserData.user.tier}</p>
                <p className="text-sm opacity-80">Member since {new Date(mockUserData.user.joined).toLocaleDateString()}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              <Settings className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="creators">My Creators</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="calls">Video Calls</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Total Spent", value: `$${mockUserData.stats.totalSpent}`, icon: DollarSign, color: "text-green-600" },
                { label: "Creators Followed", value: mockUserData.stats.creatorsFollowed, icon: Users, color: "text-blue-600" },
                { label: "Messages", value: mockUserData.stats.messagesExchanged, icon: MessageCircle, color: "text-purple-600" },
                { label: "Video Calls", value: mockUserData.stats.videoCalls, icon: Video, color: "text-orange-600" },
                { label: "Content Unlocked", value: mockUserData.stats.contentUnlocked, icon: Lock, color: "text-red-600" }
              ].map((stat, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="p-4 text-center">
                    <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{getActivityText(activity)}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Calls */}
            {mockUserData.upcomingCalls.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Video Calls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockUserData.upcomingCalls.map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="flex items-center gap-3">
                          <Video className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{call.creator}</p>
                            <p className="text-sm text-muted-foreground">{call.time} • {call.duration}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">${call.amount}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="creators" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockUserData.favoriteCreators.map((creator) => (
                <Card key={creator.id} className="shadow-card hover:shadow-glow transition-all cursor-pointer" onClick={() => setSelectedCreator(creator.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback>{creator.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{creator.displayName}</h3>
                          {creator.verified && <Star className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground">@{creator.username}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{creator.bio}</p>
                    
                    {creator.tipGoal && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Monthly Goal</span>
                          <span>${creator.tipReceived} / ${creator.tipGoal}</span>
                        </div>
                        <Progress value={(creator.tipReceived! / creator.tipGoal) * 100} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline">
                        <Gift className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <div className="space-y-4">
              {mockUserData.subscriptions.map((sub) => (
                <Card key={sub.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={sub.creator.avatar} />
                          <AvatarFallback>{sub.creator.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{sub.creator.displayName}</h3>
                            {sub.creator.verified && <Star className="w-4 h-4 text-yellow-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground">@{sub.creator.username}</p>
                          <p className="text-xs text-muted-foreground">Subscribed since {new Date(sub.since).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-2">{sub.tier}</Badge>
                        <p className="text-lg font-bold">${sub.monthlyAmount}/month</p>
                        <p className="text-xs text-muted-foreground">Next: {new Date(sub.nextBilling).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                      <Button size="sm" onClick={() => setSelectedCreator(sub.creator.id)} className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Visit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>All Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-4 rounded-lg border">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="font-medium">{getActivityText(activity)}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.amount && (
                        <Badge variant="secondary">${activity.amount}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="space-y-6">
            <div className="grid gap-4">
              {mockUserData.upcomingCalls.map((call) => (
                <Card key={call.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Video className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">{call.creator}</h3>
                          <p className="text-sm text-muted-foreground">{call.time}</p>
                          <p className="text-sm text-muted-foreground">{call.duration} session</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-2">${call.amount}</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4 mr-1" />
                            Reschedule
                          </Button>
                          <Button size="sm">
                            <Play className="w-4 h-4 mr-1" />
                            Join Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}