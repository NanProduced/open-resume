/**
 * cx is a simple util to join classNames together. Think of it as a simplified version of the open source classnames util
 * Reference: https://dev.to/gugaguichard/replace-clsx-classnames-or-classcat-with-your-own-little-helper-3bf
 *
 * @example
 * cx('px-1', 'mt-2'); // => 'px-1 mt-2'
 * cx('px-1', true && 'mt-2'); // => 'px-1 mt-2'
 * cx('px-1', false && 'mt-2'); // => 'px-1'
 * cx('px-1', { 'bg-red-500': isError, 'bg-green-500': isSuccess }); // => conditional object support
 */
export const cx = (
  ...classes: Array<string | boolean | undefined | null | Record<string, boolean>>
) => {
  const newClasses: string[] = [];
  for (const c of classes) {
    if (typeof c === "string") {
      newClasses.push(c.trim());
    } else if (c && typeof c === "object") {
      for (const [key, value] of Object.entries(c)) {
        if (value) {
          newClasses.push(key);
        }
      }
    }
  }
  return newClasses.join(" ");
};
