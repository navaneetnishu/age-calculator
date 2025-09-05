'use client';

import { useEffect, useState } from 'react';
import { logMemoryUsage, measurePerformance } from '@/utils/performanceUtils';

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: string;
  renderTime: number;
  cacheHitRate: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const measureLoadTime = () => {
      const loadTime = performance.now();
      setMetrics(prev => ({
        ...prev,
        loadTime: Math.round(loadTime)
      } as PerformanceMetrics));
    };

    const measureRenderTime = () => {
      measurePerformance('Component Render', () => {
        // Simulate render measurement
        const renderTime = performance.now();
        setMetrics(prev => ({
          ...prev,
          renderTime: Math.round(renderTime)
        } as PerformanceMetrics));
      });
    };

    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = Math.round(memory.usedJSHeapSize / 1048576);
        setMetrics(prev => ({
          ...prev,
          memoryUsage: `${memoryUsage} MB`
        } as PerformanceMetrics));
      }
    };

    // Initial measurements
    measureLoadTime();
    measureRenderTime();
    updateMemoryUsage();

    // Update memory usage periodically
    const interval = setInterval(updateMemoryUsage, 5000);

    // Show monitor after 2 seconds
    const showTimer = setTimeout(() => setIsVisible(true), 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(showTimer);
    };
  }, []);

  if (!isVisible || !metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold">Performance</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      <div className="space-y-1">
        <div>Load: {metrics.loadTime}ms</div>
        <div>Memory: {metrics.memoryUsage}</div>
        <div>Render: {metrics.renderTime}ms</div>
        <div>Cache: {metrics.cacheHitRate}%</div>
      </div>
    </div>
  );
}
