declare global {
  interface WorkerGlobalScope {
    skipWaiting: () => void
  }
}

export {}
