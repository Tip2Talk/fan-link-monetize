import { useState, useEffect, useRef } from 'react';
import { supabase, type Message, type Profile } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Send, 
  DollarSign, 
  Paperclip, 
  Download, 
  Play, 
  Pause,
  Image as ImageIcon,
  Video,
  Mic,
  Lock,
  Unlock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MediaUpload from './MediaUpload';
import PaymentModal from './PaymentModal';

interface MessageThreadProps {
  conversationId: string;
  currentUserId: string;
  otherUser: Profile;
  isCreator?: boolean;
}

export default function MessageThread({ 
  conversationId, 
  currentUserId, 
  otherUser, 
  isCreator = false 
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [purchasedMedia, setPurchasedMedia] = useState<Set<string>>(new Set());
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    messageId: string;
    amount: number;
    description: string;
  }>({ isOpen: false, messageId: '', amount: 0, description: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(*)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: newMessage,
          message_type: 'text',
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = async (file: File, price?: number, caption?: string) => {
    setLoading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-media/${conversationId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat-media')
        .getPublicUrl(filePath);

      // Save message to database
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: caption || '',
          message_type: 'media',
          media_url: publicUrl,
          media_type: file.type.split('/')[0], // 'image', 'video', or 'audio'
          media_price: price,
        });

      if (messageError) throw messageError;

      setShowMediaUpload(false);
      toast({
        title: "Media sent",
        description: price ? `Media sent with $${price} price` : "Media sent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send media",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseMedia = (messageId: string, price: number) => {
    setPaymentModal({
      isOpen: true,
      messageId,
      amount: price,
      description: `Unlock exclusive ${messages.find(m => m.id === messageId)?.media_type} content`
    });
  };

  const handlePaymentSuccess = () => {
    setPurchasedMedia(prev => new Set([...prev, paymentModal.messageId]));
    setPaymentModal({ isOpen: false, messageId: '', amount: 0, description: '' });
  };

  const toggleAudio = (messageId: string, audioUrl: string) => {
    const audio = audioRefs.current[messageId];
    
    if (!audio) {
      const newAudio = new Audio(audioUrl);
      audioRefs.current[messageId] = newAudio;
      
      newAudio.onended = () => {
        setPlayingAudio(null);
      };
      
      newAudio.play();
      setPlayingAudio(messageId);
    } else {
      if (playingAudio === messageId) {
        audio.pause();
        setPlayingAudio(null);
      } else {
        audio.play();
        setPlayingAudio(messageId);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={otherUser.avatar_url} />
            <AvatarFallback>
              {otherUser.display_name?.charAt(0) || otherUser.email?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span>{otherUser.display_name || otherUser.email}</span>
              {otherUser.verified && <Badge variant="secondary">Verified</Badge>}
            </div>
            <div className="text-sm text-muted-foreground">@{otherUser.username}</div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender_id === currentUserId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.message_type === 'tip' && (
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold">${message.tip_amount}</span>
                  </div>
                )}

                {message.message_type === 'media' && (
                  <div className="space-y-2">
                    {message.media_price && !purchasedMedia.has(message.id) && message.sender_id !== currentUserId ? (
                      // Locked paid media for fans
                      <div className="bg-muted/50 border border-dashed border-muted-foreground/30 rounded-lg p-4 text-center">
                        <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium mb-2">Exclusive Media</p>
                        <Button
                          size="sm"
                          onClick={() => handlePurchaseMedia(message.id, message.media_price!)}
                          className="gap-1"
                        >
                          <DollarSign className="w-3 h-3" />
                          Unlock for ${message.media_price}
                        </Button>
                      </div>
                    ) : (
                      // Unlocked media or creator's own media
                      <div className="relative">
                        {message.media_type === 'image' && (
                          <img
                            src={message.media_url}
                            alt="Shared image"
                            className="max-w-full h-auto rounded-lg cursor-pointer"
                            onClick={() => setSelectedMedia(message.media_url)}
                          />
                        )}
                        
                        {message.media_type === 'video' && (
                          <video
                            src={message.media_url}
                            controls
                            className="max-w-full h-auto rounded-lg"
                          />
                        )}
                        
                        {message.media_type === 'audio' && (
                          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleAudio(message.id, message.media_url!)}
                            >
                              {playingAudio === message.id ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                            <div className="flex-1">
                              <div className="text-sm font-medium">Voice message</div>
                              <div className="text-xs text-muted-foreground">
                                {playingAudio === message.id ? 'Playing...' : 'Click to play'}
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                              <a href={message.media_url} download>
                                <Download className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        )}
                        
                        {message.media_price && message.sender_id === currentUserId && (
                          <Badge 
                            variant="secondary" 
                            className="absolute top-2 right-2 bg-success text-success-foreground"
                          >
                            ${message.media_price}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {message.content && (
                  <p className="text-sm">{message.content}</p>
                )}
                
                <p className="text-xs opacity-70 mt-1">
                  {formatTime(message.created_at)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {showMediaUpload ? (
          <MediaUpload
            onUpload={handleMediaUpload}
            onCancel={() => setShowMediaUpload(false)}
            isCreator={isCreator}
          />
        ) : (
          <form onSubmit={sendMessage} className="flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setShowMediaUpload(true)}
              disabled={loading}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading || !newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* Media Preview Dialog */}
        <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Media Preview</DialogTitle>
            </DialogHeader>
            {selectedMedia && (
              <img
                src={selectedMedia}
                alt="Full size preview"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={() => setPaymentModal({ isOpen: false, messageId: '', amount: 0, description: '' })}
          amount={paymentModal.amount}
          description={paymentModal.description}
          creatorId={otherUser.id}
          chatId={conversationId}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </CardContent>
    </Card>
  );
}