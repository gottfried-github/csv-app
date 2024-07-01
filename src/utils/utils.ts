export const throttle = (cb: any, interval: number) => {
  let isRunning = false

  return (...args: any[]) => {
    if (!isRunning) {
      isRunning = true

      cb(...args)

      setTimeout(() => {
        isRunning = false
      }, interval)
    }
  }
}
