<template>
  <div class="q-pa-md">
    <q-virtual-scroll
      ref="virtualScrollRef"
      style="max-height: 80vh;"
      :items="chat.activeMessages"
      v-slot="{ item: message, index }"
    >
      <div :key="message.id" class="q-mb-md">
        <q-chat-message
          :name="chat.usersById[message.senderId]?.name"
          :text="[message.content]"
          :stamp="message.timestamp"
        >
          <template v-if="message.status !== 'sent'" #default>
            <q-chat-message
              :name="chat.usersById[message.senderId]?.name"
              :text="[message.content]"
              :stamp="message.timestamp"
            />
            <div class="text-caption q-mt-xs">
              <span v-if="message.status === 'sending'">Sending...</span>

              <span v-else-if="message.status === 'failed'">
                Failed
                <q-btn
                  flat
                  dense
                  size="sm"
                  label="Retry"
                  @click="chat.retryMessage(message.id)"
                />
              </span>
            </div>
          </template>
        </q-chat-message>
      </div>
    </q-virtual-scroll>

    <div v-if="!chat.activeMessages.length" class="text-grey text-center q-pa-lg">
      No messages
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from '@/stores/chat.store';

const chat = useChatStore();
const virtualScrollRef = ref();
</script>
