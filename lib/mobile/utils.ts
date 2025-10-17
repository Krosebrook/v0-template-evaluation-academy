export function isMobile(): boolean {
  if (typeof window === "undefined") return false
  return window.innerWidth < 768
}

export function isIOS(): boolean {
  if (typeof window === "undefined") return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function isAndroid(): boolean {
  if (typeof window === "undefined") return false
  return /Android/.test(navigator.userAgent)
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(display-mode: standalone)").matches
}

export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop"

  const width = window.innerWidth

  if (width < 768) return "mobile"
  if (width < 1024) return "tablet"
  return "desktop"
}

export function supportsTouch(): boolean {
  if (typeof window === "undefined") return false
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

export function getViewportHeight(): number {
  if (typeof window === "undefined") return 0
  return window.innerHeight
}

export function preventZoom() {
  if (typeof document === "undefined") return

  document.addEventListener("gesturestart", (e) => {
    e.preventDefault()
  })

  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.scale !== 1) {
        e.preventDefault()
      }
    },
    { passive: false },
  )
}

export function enableSmoothScroll() {
  if (typeof document === "undefined") return

  document.documentElement.style.scrollBehavior = "smooth"
}
