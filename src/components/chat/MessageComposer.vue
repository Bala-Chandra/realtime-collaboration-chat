<template>
  <div class="q-pa-md">
    <q-input
      v-model="text"
      outlined
      placeholder="Type a message..."
      @keyup.enter="send"
    >
      <template #append>
        <q-btn
          round
          flat
          icon="send"
          @click="send"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useChatStore } from '@/stores/chat.store';

const chat = useChatStore();

const text = ref('');

function send() {
  const value = text.value.trim();

  if (!value) {
    return;
  }

  text.value = '';

  void chat.sendMessage(value);
}
</script>
