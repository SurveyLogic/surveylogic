export class ProgressTimeout {
  public aliveTimer: any;
  public isDone = false;
  public timeout = 30000;
  public timeoutHandler: (() => void) | null = null;

  progress() {
    // Some browsers fire another progress event when the upload is
    // cancelled, so we have to ignore progress after the timer was
    // told to stop.
    if (this.isDone || !this.timeoutHandler) return;

    if (this.timeout > 0) {
      clearTimeout(this.aliveTimer);
      this.aliveTimer = setTimeout(this.timeoutHandler, this.timeout);
    }
  }

  done() {
    if (!this.isDone) {
      clearTimeout(this.aliveTimer);
      this.aliveTimer = null;
      this.isDone = true;
    }
  }
}
