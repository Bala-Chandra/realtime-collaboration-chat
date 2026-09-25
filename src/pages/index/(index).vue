<template>
  <q-page class="row">
    <div class="col-3" style="border-right: 1px solid #ddd">
      <div class="q-pa-md">
        <div class="text-h6">Conversations</div>
      </div>

      <ConversationList />
    </div>

    <div class="col column">
      <div class="q-pa-md" style="border-bottom: 1px solid #ddd">
        <div class="text-h6">
          {{ activeConversation?.title ?? 'Select a conversation' }}
        </div>
      </div>

      <div class="col scroll">
        <MessageList />
      </div>

      <MessageComposer />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';

import ConversationList from '@/components/chat/ConversationList.vue';

import MessageList from '@/components/chat/MessageList.vue';

import MessageComposer from '@/components/chat/MessageComposer.vue';

import { useChatStore } from '@/stores/chat.store';

const chat = useChatStore();

const activeConversation = computed(() =>
  chat.activeConversationId ? chat.conversationsById[chat.activeConversationId] : undefined,
);

onMounted(() => {
  void chat.initialize();
});
</script>
