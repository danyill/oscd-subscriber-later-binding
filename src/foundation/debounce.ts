export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay = 100
): (...args: Args) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
