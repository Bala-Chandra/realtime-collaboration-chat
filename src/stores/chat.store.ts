import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { chatService } from '@/services/chat.service';
import type { Conversation, Message, User } from '@/types/chat';

export const useChatStore = defineStore('chat', () => {
  const usersById = ref<Record<string, User>>({});

  const conversationsById = ref<Record<string, Conversation>>({});

  const messagesById = ref<Record<string, Message>>({});

  const conversationMessageIds = ref<Record<string, string[]>>({});

  const activeConversationId = ref<string | null>(null);

  const loadingConversations = ref(false);

  const loadingMessages = ref(false);

  const conversations = computed<Conversation[]>(() => Object.values(conversationsById.value));

  const activeMessages = computed<Message[]>(() => {
    const conversationId = activeConversationId.value;

    if (!conversationId) {
      return [];
    }

    const ids = conversationMessageIds.value[conversationId] ?? [];

    return ids.reduce<Message[]>((result, id) => {
      const message = messagesById.value[id];

      if (message) {
        result.push(message);
      }

      return result;
    }, []);
  });

  async function initialize(): Promise<void> {
    loadingConversations.value = true;

    try {
      const [loadedUsers, conversationList] = await Promise.all([
        chatService.getUsers(),
        chatService.getConversations(),
      ]);

      loadedUsers.forEach((user) => {
        usersById.value[user.id] = user;
      });

      conversationList.forEach((conversation) => {
        conversationsById.value[conversation.id] = conversation;
      });

      const firstConversation = conversationList.at(0);

      if (firstConversation && !activeConversationId.value) {
        await selectConversation(firstConversation.id);
      }
    } finally {
      loadingConversations.value = false;
    }
  }

  async function selectConversation(conversationId: string): Promise<void> {
    activeConversationId.value = conversationId;

    loadingMessages.value = true;

    try {
      const loadedMessages = await chatService.getMessages(conversationId);

      conversationMessageIds.value[conversationId] = [];

      loadedMessages.forEach((message) => {
        addMessage(message);
      });

      const conversation = conversationsById.value[conversationId];

      if (conversation) {
        conversation.unreadCount = 0;
      }
    } finally {
      loadingMessages.value = false;
    }
  }

  function addMessage(message: Message): void {
    if (messagesById.value[message.id]) {
      return;
    }

    messagesById.value[message.id] = message;

    const ids = conversationMessageIds.value[message.conversationId] ?? [];

    if (!ids.includes(message.id)) {
      ids.push(message.id);
    }

    conversationMessageIds.value[message.conversationId] = ids;

    const conversation = conversationsById.value[message.conversationId];

    if (conversation) {
      conversation.lastMessageId = message.id;
    }
  }

  async function sendMessage(content: string): Promise<void> {
    const conversationId = activeConversationId.value;

    const trimmedContent = content.trim();

    if (!conversationId || !trimmedContent) {
      return;
    }

    const clientId = `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const optimisticMessage: Message = {
      id: clientId,
      clientId,
      conversationId,
      senderId: 'u1',
      content: trimmedContent,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    addMessage(optimisticMessage);

    try {
      const serverMessage = await chatService.sendMessage(conversationId, trimmedContent, clientId);

      reconcileMessage(optimisticMessage.id, serverMessage);
    } catch {
      const message = messagesById.value[optimisticMessage.id];

      if (message) {
        message.status = 'failed';
      }
    }
  }

  function reconcileMessage(optimisticId: string, serverMessage: Message): void {
    const optimisticMessage = messagesById.value[optimisticId];

    if (!optimisticMessage) {
      addMessage(serverMessage);
      return;
    }

    const ids = conversationMessageIds.value[serverMessage.conversationId] ?? [];

    const optimisticIndex = ids.indexOf(optimisticId);

    if (optimisticIndex !== -1) {
      ids[optimisticIndex] = serverMessage.id;
    }

    delete messagesById.value[optimisticId];

    messagesById.value[serverMessage.id] = serverMessage;
  }

  async function retryMessage(messageId: string): Promise<void> {
    const message = messagesById.value[messageId];

    if (!message || message.status !== 'failed') {
      return;
    }

    const conversationId = message.conversationId;

    delete messagesById.value[messageId];

    const ids = conversationMessageIds.value[conversationId] ?? [];

    conversationMessageIds.value[conversationId] = ids.filter((id) => id !== messageId);

    activeConversationId.value = conversationId;

    await sendMessage(message.content);
  }

  return {
    usersById,
    conversationsById,
    messagesById,
    conversationMessageIds,

    activeConversationId,

    conversations,
    activeMessages,

    loadingConversations,
    loadingMessages,

    initialize,
    selectConversation,
    addMessage,
    sendMessage,
    reconcileMessage,
    retryMessage,
  };
});
