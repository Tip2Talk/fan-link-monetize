import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Users, 
  MessageCircle, 
  Video,
  TrendingUp,
  Copy,
  Share2,
  Settings,
  BarChart3,
  Calendar,
  Bell
} from "lucide-react";
import CreatorChatManager from "@/components/Chat/CreatorChatManager";

const mockData = {
  creator: {
    username: "hello",
    displayName: "Alex Rivera",
    avatar: "/placeholder.svg",
    verified: true,
    followerCount: 24500
  },
  stats: {
    totalEarnings: 2850,
    monthlyEarnings: 1250,
    totalFans: 156,
    activeFans: 42,
    messagesReceived: 89,
    scheduledCalls: 5
  },
  recentTips: [
    { id: 1, amount: 25, from: "Sarah M.", message: "Love your content!", time: "2 hours ago" },
    { id: 2, amount: 10, from: "Mike D.", message: "Keep it up!", time: "5 hours ago" },
    { id: 3, amount: 50, from: "Emma L.", message: "Amazing work!", time: "1 day ago" }
  ],
  upcomingCalls: [
    { id: 1, with: "Jennifer K.", duration: "30 min", time: "Today 3:00 PM", amount: 90 },
    { id: 2, with: "David R.", duration: "15 min", time: "Tomorrow 10:00 AM", amount: 50 }
  ]
};

export default function CreatorDashboard() {
  const [copied, setCopied] = useState(false);
  
  const profileUrl = `tip2talk.com/${mockData.creator.username}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${profileUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = "primary" }: any) => (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color} bg-opacity-10`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 border-2 border-white">
                <AvatarImage src={mockData.creator.avatar} />
                <AvatarFallback>{mockData.creator.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">{mockData.creator.displayName}</h1>
                <p className="text-sm opacity-80">@{mockData.creator.username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">
                <Settings className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Profile Link */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80 mb-1">Your Creator Link</p>
                <p className="font-mono text-sm">{profileUrl}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button size="sm" variant="secondary">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="This Month"
            value={`$${mockData.stats.monthlyEarnings}`}
            icon={DollarSign}
            trend="+15%"
            color="success"
          />
          <StatCard
            title="Total Fans"
            value={mockData.stats.totalFans}
            icon={Users}
            trend="+8"
            color="fan"
          />
          <StatCard
            title="Messages"
            value={mockData.stats.messagesReceived}
            icon={MessageCircle}
            trend="+12"
            color="primary"
          />
          <StatCard
            title="Calls Booked"
            value={mockData.stats.scheduledCalls}
            icon={Video}
            color="creator"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="fans">Fans</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Tips */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-success" />
                    Recent Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockData.recentTips.map((tip) => (
                    <div key={tip.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">${tip.amount} from {tip.from}</p>
                        <p className="text-sm text-muted-foreground">"{tip.message}"</p>
                        <p className="text-xs text-muted-foreground">{tip.time}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Tips
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Calls */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-creator" />
                    Upcoming Calls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockData.upcomingCalls.map((call) => (
                    <div key={call.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{call.with}</p>
                        <Badge className="bg-creator text-creator-foreground">
                          ${call.amount}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{call.duration} • {call.time}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm" variant="creator">
                          Join Call
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Manage Calendar
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Earnings Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                  Chart placeholder - integrate with analytics library
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <CreatorChatManager 
              creatorId="1" 
              creatorProfile={mockData.creator}
            />
          </TabsContent>

          <TabsContent value="earnings">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Earnings Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Detailed earnings breakdown coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fans">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Fan Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Fan analytics and engagement tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Upload and manage exclusive content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}