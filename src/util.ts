export function syncSetInterval(callback: any, interval: number, delay: number) {
  let clearRequested: boolean;

  const update = async () => {
    if (clearRequested) return;
    await callback();
    setTimeout(update, interval);
  };

  setTimeout(update, delay || 0);

  return {
    clear: () => (clearRequested = true)
  };
}
