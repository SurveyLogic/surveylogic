export function createRafLoop(callback: () => void) {
  let id: number | undefined;

  function start() {
    // Time updates are already in progress.
    if (!isUndefined(id)) return;
    loop();
  }

  function loop() {
    id = window.requestAnimationFrame(function rafLoop() {
      if (isUndefined(id)) return;
      callback();
      loop();
    });
  }

  function stop() {
    if (isNumber(id)) window.cancelAnimationFrame(id);
    id = undefined;
  }

  return {
    start,
    stop,
  };
}

function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

function isNumber(value: any): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}
