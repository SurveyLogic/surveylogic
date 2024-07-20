export class ScreenOrientation {
  protected currentLock: OrientationLockType | undefined;

  async lock(lockType: OrientationLockType = 'landscape') {
    if (!this.canOrientScreen() || this.currentLock) return;
    try {
      await screen.orientation.lock(lockType);
      this.currentLock = lockType;
    } catch (e) {}
  }

  async unlock() {
    if (!this.canOrientScreen() || !this.currentLock) return;
    await screen.orientation.unlock();
  }

  canOrientScreen(): boolean {
    return (
      screen.orientation != null &&
      !!screen.orientation.lock &&
      !!screen.orientation.unlock
    );
  }
}
