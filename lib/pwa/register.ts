export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration)
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error)
        })
    })
  }
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("[PWA] Notifications not supported")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  return false
}

export async function subscribeToPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("[PWA] Push notifications not supported")
    return null
  }

  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    console.log("[PWA] Push notifications not configured (NEXT_PUBLIC_VAPID_PUBLIC_KEY missing)")
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })

    console.log("[PWA] Push subscription:", subscription)
    return subscription
  } catch (error) {
    console.error("[PWA] Push subscription failed:", error)
    return null
  }
}
