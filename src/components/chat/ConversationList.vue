<template>
  <q-list separator>
    <q-item
      v-for="conversation in chat.conversations"
      :key="conversation.id"
      clickable
      :active="chat.activeConversationId === conversation.id"
      @click="chat.selectConversation(conversation.id)"
    >
      <q-item-section>
        <q-item-label>
          {{ conversation.title }}
        </q-item-label>

        <q-item-label caption>
          {{ lastMessage(conversation.id) }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-badge v-if="conversation.unreadCount">
          {{ conversation.unreadCount }}
        </q-badge>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat.store';

const chat = useChatStore();

function lastMessage(conversationId: string) {
  const conversation = chat.conversationsById[conversationId];

  if (!conversation?.lastMessageId) {
    return 'No messages';
  }

  return chat.messagesById[conversation.lastMessageId]?.content ?? 'No messages';
}
</script>
