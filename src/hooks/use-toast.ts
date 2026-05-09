import { useState, useCallback } from 'react';

/**
 * Simple toast notification hook
 * Manages toast state and provides a function to trigger toast notifications
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 3000 }) => {
      const id = Math.random().toString(36).substr(2, 9);

      const newToast = {
        id,
        title,
        description,
        variant, // 'default', 'destructive', 'success', 'info'
        open: true,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss after duration
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, open: false } : t))
          );
          // Remove from DOM after animation
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
          }, 300);
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, open: false } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  return {
    toast,
    toasts,
    dismiss,
  };
};

export default useToast;
