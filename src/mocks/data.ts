import type { Conversation, Message, User } from '@/types/chat';

export const currentUser: User = {
  id: 'u1',
  name: 'You',
  online: true,
};

export const users: User[] = [
  currentUser,
  {
    id: 'u2',
    name: 'Rahul',
    online: true,
  },
  {
    id: 'u3',
    name: 'Priya',
    online: false,
  },
  {
    id: 'u4',
    name: 'Arjun',
    online: true,
  },
];

export const conversations: Conversation[] = [
  {
    id: 'c1',
    title: 'Rahul',
    participantIds: ['u1', 'u2'],
    unreadCount: 2,
    lastMessageId: 'm2',
  },
  {
    id: 'c2',
    title: 'Priya',
    participantIds: ['u1', 'u3'],
    unreadCount: 0,
    lastMessageId: 'm3',
  },
  {
    id: 'c3',
    title: 'Arjun',
    participantIds: ['u1', 'u4'],
    unreadCount: 1,
    lastMessageId: 'm4',
  },
];

export const messages: Message[] = [
  {
    id: 'm1',
    conversationId: 'c1',
    senderId: 'u2',
    content: 'Hey! Are we still meeting today?',
    createdAt: '2026-09-25T08:00:00Z',
    status: 'sent',
  },
  {
    id: 'm2',
    conversationId: 'c1',
    senderId: 'u1',
    content: 'Yes, absolutely.',
    createdAt: '2026-09-25T08:01:00Z',
    status: 'sent',
  },
  {
    id: 'm3',
    conversationId: 'c2',
    senderId: 'u3',
    content: 'Can you review the design?',
    createdAt: '2026-09-25T08:05:00Z',
    status: 'sent',
  },
  {
    id: 'm4',
    conversationId: 'c3',
    senderId: 'u4',
    content: 'The deployment is ready.',
    createdAt: '2026-09-25T08:10:00Z',
    status: 'sent',
  },
];
