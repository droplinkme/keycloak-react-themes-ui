class EventBus extends EventTarget {
  emitEvent<T>(eventName: string, detail: T): void {
    const event = new CustomEvent(eventName, { detail });
    this.dispatchEvent(event);
  }
}

export const eventBus = new EventBus();
