export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 8000,
  errorMessage = "Operation timeout",
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), timeoutMs))
  return Promise.race([promise, timeoutPromise])
}

export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2, delayMs = 1000): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)))
      }
    }
  }

  throw lastError
}
