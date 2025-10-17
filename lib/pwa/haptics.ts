export function triggerHapticFeedback(type: "light" | "medium" | "heavy" = "medium") {
  if ("vibrate" in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
    }
    navigator.vibrate(patterns[type])
  }
}

export function addHapticToElement(element: HTMLElement, type: "light" | "medium" | "heavy" = "medium") {
  element.addEventListener("click", () => {
    triggerHapticFeedback(type)
    element.classList.add("haptic-feedback")
    setTimeout(() => element.classList.remove("haptic-feedback"), 100)
  })
}
