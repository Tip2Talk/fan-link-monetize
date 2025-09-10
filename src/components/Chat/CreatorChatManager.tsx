import { useState } from 'react';
import { type Conversation } from '@/lib/supabase';
import CreatorChatList from './CreatorChatList';
import MessageThread from './MessageThread';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface CreatorChatManagerProps {
  creatorId: string;
  creatorProfile: any;
}

export default function CreatorChatManager({ creatorId, creatorProfile }: CreatorChatManagerProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <div className="h-[600px] grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Chat List */}
      <div className="md:col-span-1">
        <CreatorChatList
          creatorId={creatorId}
          onSelectConversation={setSelectedConversation}
          selectedConversationId={selectedConversation?.id}
        />
      </div>

      {/* Message Thread */}
      <div className="md:col-span-2">
        {selectedConversation ? (
          <MessageThread
            conversationId={selectedConversation.id}
            currentUserId={creatorId}
            otherUser={selectedConversation.fan!}
            isCreator={true}
          />
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center p-8">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a fan from the list to start chatting
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}