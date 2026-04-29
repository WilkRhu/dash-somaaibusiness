import { useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export function useToast() {
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    // Se houver um container de toast, usar ele
    const toastContainer = document.getElementById('toast-container');
    if (toastContainer) {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 3000);
    } else {
      // Fallback para console
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }, []);

  return { showToast };
}
