import React, { createContext, useContext, useCallback, useState } from 'react';

const ToastContext = createContext();

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const push = useCallback((msg, opts = {}) => {
    const id = ++idCounter;
    const toast = {
      id,
      message: msg,
      type: opts.type || 'info',
      duration: opts.duration === 0 ? 0 : (opts.duration || 4000)
    };
    setToasts(t => [...t, toast]);
    if (toast.duration > 0) {
      setTimeout(() => remove(id), toast.duration);
    }
    return id;
  }, [remove]);

  const value = { push, remove };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" style={containerStyle}>
        {toasts.map(t => (
          <div key={t.id} style={{ ...toastStyle, ...typeStyles[t.type] }}>
            <span>{t.message}</span>
            <button onClick={() => remove(t.id)} style={closeBtnStyle}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

// Inline styling for quick usage (can extract to CSS later)
const containerStyle = {
  position: 'fixed',
  top: '1rem',
  right: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  zIndex: 9999,
  maxWidth: '320px'
};

const toastStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
  padding: '0.75rem 1rem',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#fff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

const typeStyles = {
  info: { background: '#2563eb' },
  success: { background: '#16a34a' },
  error: { background: '#dc2626' },
  warning: { background: '#d97706' }
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  fontSize: '1rem',
  cursor: 'pointer',
  lineHeight: 1
};

export default ToastContext;
