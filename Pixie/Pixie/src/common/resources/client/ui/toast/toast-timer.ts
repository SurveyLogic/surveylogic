export class ToastTimer {
  private timerId?: ReturnType<typeof setTimeout>;
  private createdAt: number = 0;

  constructor(private callback: () => void, private remaining: number) {
    this.resume();
  }

  pause() {
    clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.createdAt;
  }

  resume() {
    this.createdAt = Date.now();
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.timerId = setTimeout(this.callback, this.remaining);
  }

  clear() {
    clearTimeout(this.timerId);
  }
}
