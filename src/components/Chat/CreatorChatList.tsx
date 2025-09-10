import { useState, useEffect } from 'react';
import { supabase, type Conversation, type Profile } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  MessageCircle, 
  DollarSign, 
  Star,
  Clock,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreatorChatListProps {
  creatorId: string;
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

export default function CreatorChatList({ 
  creatorId, 
  onSelectConversation, 
  selectedConversationId 
}: CreatorChatListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'recent'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
    subscribeToConversations();
  }, [creatorId]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          fan:profiles!conversations_fan_id_fkey(*)
        `)
        .eq('creator_id', creatorId)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToConversations = () => {
    const channel = supabase
      .channel(`creator-conversations:${creatorId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `creator_id=eq.${creatorId}`,
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredConversations = conversations
    .filter(conv => {
      const fanName = conv.fan?.display_name || conv.fan?.username || conv.fan?.email || '';
      const matchesSearch = fanName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      switch (filter) {
        case 'paid':
          // This would need a separate query to check for tip messages
          return true; // Simplified for now
        case 'recent':
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return new Date(conv.last_message_at) > dayAgo;
        default:
          return true;
      }
    });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    // In a real app, this would fetch the latest message
    return 'Click to view messages';
  };

  const getTotalTips = (conversation: Conversation) => {
    // This would come from a separate query in a real app
    return Math.floor(Math.random() * 500); // Mock data
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Fan Messages
          <Badge variant="secondary">{conversations.length}</Badge>
        </CardTitle>
        
        {/* Search & Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search fans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-1">
            {['all', 'paid', 'recent'].map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(filterType as any)}
                className="capitalize"
              >
                {filterType === 'paid' && <DollarSign className="w-3 h-3 mr-1" />}
                {filterType === 'recent' && <Clock className="w-3 h-3 mr-1" />}
                {filterType}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="space-y-1">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversationId === conversation.id ? 'bg-primary/10' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={conversation.fan?.avatar_url} />
                  <AvatarFallback>
                    {conversation.fan?.display_name?.charAt(0) || 
                     conversation.fan?.email?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {conversation.fan?.display_name || conversation.fan?.email}
                      </span>
                      {conversation.fan?.verified && (
                        <Star className="w-3 h-3 text-success" fill="currentColor" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(conversation.last_message_at)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate">
                    {getLastMessagePreview(conversation)}
                  </p>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      @{conversation.fan?.username}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-success">
                      <DollarSign className="w-3 h-3" />
                      {getTotalTips(conversation)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredConversations.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No conversations found</p>
              <p className="text-xs">Fans will appear here when they message you</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}