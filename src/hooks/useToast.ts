import { useState, useCallback } from 'react';

interface ToastOptions {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface ToastState extends ToastOptions {
  id: string;
}

/**
 * Hook for managing toast notifications
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((options: ToastOptions) => {
    const id = Date.now().toString();
    const toast: ToastState = {
      ...options,
      id,
      type: options.type || 'info',
      duration: options.duration || 3000
    };

    setToasts(prev => [...prev, toast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    success: (message: string, duration?: number) => 
      showToast({ message, type: 'success', duration }),
    error: (message: string, duration?: number) => 
      showToast({ message, type: 'error', duration }),
    warning: (message: string, duration?: number) => 
      showToast({ message, type: 'warning', duration }),
    info: (message: string, duration?: number) => 
      showToast({ message, type: 'info', duration }),
  };
};
