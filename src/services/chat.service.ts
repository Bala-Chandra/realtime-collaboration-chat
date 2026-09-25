import { conversations, messages, users } from '@/mocks/data';

import type { Conversation, Message, User } from '@/types/chat';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const chatService = {
  async getUsers(): Promise<User[]> {
    await delay(300);

    return [...users];
  },

  async getConversations(): Promise<Conversation[]> {
    await delay(400);

    return conversations.map((conversation) => ({
      ...conversation,
    }));
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    await delay(500);

    return messages
      .filter((message) => message.conversationId === conversationId)
      .map((message) => ({ ...message }));
  },

  async sendMessage(conversationId: string, content: string, clientId: string): Promise<Message> {
    await delay(700);

    if (content.toLowerCase().includes('fail')) {
      throw new Error('Message failed');
    }

    return {
      id: `server-${Date.now()}`,
      conversationId,
      senderId: 'u1',
      content,
      createdAt: new Date().toISOString(),
      status: 'sent',
      clientId,
    };
  },

  async resync(conversationId: string): Promise<Message[]> {
    await delay(500);

    return messages
      .filter((message) => message.conversationId === conversationId)
      .map((message) => ({ ...message }));
  },
};
