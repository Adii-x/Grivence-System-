import React, { useEffect, useState, useCallback } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let addToastFn: ((message: string, type: Toast['type']) => void) | null = null;

export const showToast = (message: string, type: Toast['type'] = 'info') => {
  addToastFn?.(message, type);
};

const borderColors = {
  success: 'border-l-[hsl(var(--success))]',
  error: 'border-l-[hsl(var(--danger))]',
  info: 'border-l-[hsl(var(--info))]',
};

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [exiting, setExiting] = useState<Set<string>>(new Set());

  const removeToast = useCallback((id: string) => {
    setExiting((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      setExiting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 200);
  }, []);

  useEffect(() => {
    addToastFn = (message, type) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 4000);
    };
    return () => { addToastFn = null; };
  }, [removeToast]);

  return (
    <div
      className="fixed z-[9998] flex flex-col gap-2 w-[min(20rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)]"
      style={{
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
        right: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`bg-elevated border-l-[3px] ${borderColors[t.type]} rounded-md px-4 py-3 text-sm text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.4)]
            ${exiting.has(t.id) ? 'toast-exit' : 'toast-enter'}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
