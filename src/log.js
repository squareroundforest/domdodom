/* global console */

export function log(...args) {
  console.error(...args)
  if (args.length === 0) {
    return
  }

  return args[args.length - 1]
}
