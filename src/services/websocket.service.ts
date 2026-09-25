import type { ChatEvent } from '@/types/chat';

type EventHandler = (event: ChatEvent) => void;

class MockWebSocketService {
  private handler: EventHandler | undefined;

  private connected = false;

  connect(handler: EventHandler): () => void {
    this.handler = handler;
    this.connected = true;

    return () => {
      this.connected = false;
      this.handler = undefined;
    };
  }

  disconnect(): void {
    this.connected = false;
    this.handler = undefined;
  }

  reconnect(): void {
    this.connected = true;
  }

  isConnected(): boolean {
    return this.connected;
  }

  emit(event: ChatEvent): void {
    if (!this.connected) {
      return;
    }

    this.handler?.(event);
  }
}

export const websocketService =
  new MockWebSocketService();
