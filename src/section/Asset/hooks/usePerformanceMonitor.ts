import { useEffect, useRef } from "react"

interface PerformanceMetrics {
  renderTime: number
  memoryUsage?: number
  timestamp: number
}

const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0)
  const renderCount = useRef<number>(0)

  useEffect(() => {
    renderStartTime.current = performance.now()
    renderCount.current += 1

    return () => {
      const renderTime = performance.now() - renderStartTime.current
      const metrics: PerformanceMetrics = {
        renderTime,
        timestamp: Date.now(),
      }

      // Add memory usage if available
      if ((performance as any).memory) {
        metrics.memoryUsage = (performance as any).memory.usedJSHeapSize
      }

      // Log performance metrics in development
      if (process.env.NODE_ENV === "development") {
        console.log(`[${componentName}] Render #${renderCount.current}:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          memoryUsage: metrics.memoryUsage ? `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB` : "N/A",
        })
      }

      // Warn if render time is too high
      if (renderTime > 16) {
        console.warn(`[${componentName}] Slow render detected: ${renderTime.toFixed(2)}ms`)
      }
    }
  })

  return {
    renderCount: renderCount.current,
  }
}

export default usePerformanceMonitor 