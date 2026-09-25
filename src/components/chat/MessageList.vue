<template>
  <div class="q-pa-md">
    <div v-for="message in chat.activeMessages" :key="message.id" class="q-mb-md">
      <div class="text-weight-medium">
        {{ chat.usersById[message.senderId]?.name }}
      </div>

      <div>
        {{ message.content }}
      </div>

      <div v-if="message.status !== 'sent'" class="text-caption">
        <span v-if="message.status === 'sending'"> Sending... </span>

        <span v-else-if="message.status === 'failed'">
          Failed

          <q-btn flat dense size="sm" label="Retry" @click="chat.retryMessage(message.id)" />
        </span>
      </div>
    </div>

    <div v-if="!chat.activeMessages.length" class="text-grey text-center q-pa-lg">No messages</div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat.store';

const chat = useChatStore();
</script>
