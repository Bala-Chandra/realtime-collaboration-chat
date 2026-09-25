export type MessageStatus = 'sending' | 'sent' | 'failed';

export type ConnectionState = 'connected' | 'disconnected' | 'reconnecting';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  online: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  title: string;
  unreadCount: number;
  lastMessageId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  status: MessageStatus;
  clientId?: string;
}

export type ChatEvent =
  | {
      type: 'MESSAGE_RECEIVED';
      message: Message;
    }
  | {
      type: 'MESSAGE_UPDATED';
      message: Message;
    }
  | {
      type: 'MESSAGE_DELETED';
      messageId: string;
      conversationId: string;
    }
  | {
      type: 'MESSAGE_READ';
      messageId: string;
      conversationId: string;
      userId: string;
    }
  | {
      type: 'USER_TYPING';
      conversationId: string;
      userId: string;
    }
  | {
      type: 'USER_ONLINE';
      userId: string;
    }
  | {
      type: 'USER_OFFLINE';
      userId: string;
    };
