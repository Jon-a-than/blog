export async function registerWorkers() {
  if (hasServiceWorkerSupport()) {
    await registerServiceWorker()
  } else {
    console.warn('ServiceWorker not supported')
    alert('ServiceWorker not supported')
  }
}

function hasServiceWorkerSupport() {
  return 'serviceWorker' in navigator
}

async function registerServiceWorker() {
  const localStorageKey = 'serviceWorkerVersion'

  if (localStorage.getItem(localStorageKey) !== import.meta.env.VITE_SERVICE_WORKER_VERSION) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    registrations.forEach((sw) => sw.unregister())

    const registration = await navigator.serviceWorker.register(
      `${import.meta.env.BASE_URL}service-worker.js`,
      {
        scope: import.meta.env.BASE_URL,
        type: 'module',
        updateViaCache: 'all'
      }
    )

    localStorage.setItem(localStorageKey, import.meta.env.VITE_SERVICE_WORKER_VERSION)
    console.log('ServiceWorker registration successful with scope: ', registration.scope)
  }
}
