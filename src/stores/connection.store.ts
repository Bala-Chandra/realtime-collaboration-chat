import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { ConnectionState } from '@/types/chat';

export const useConnectionStore = defineStore(
  'connection',
  () => {
    const state = ref<ConnectionState>('connected');

    function setState(
      newState: ConnectionState,
    ) {
      state.value = newState;
    }

    return {
      state,
      setState,
    };
  },
);
