'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToastData = {
  id: number;
  title: string;
  subtitle?: string;
  variant: ToastVariant;
};

type ToastContextType = {
  showToast: (toast: Omit<ToastData, 'id'>) => void;
};

type ToastVariant = 'success' | 'error' | 'warning' | 'known' | 'info';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [visibleToasts, setVisibleToasts] = useState<number[]>([]);

  const showToast = ({ title, subtitle, variant }: Omit<ToastData, 'id'>) => {
    const id = Date.now();
    const newToast = { id, title, subtitle, variant };
    setToasts(prev => [...prev, newToast]);
    setVisibleToasts(prev => [...prev, id]);

    setTimeout(() => {
      // Trigger fade-out
      setVisibleToasts(prev => prev.filter(tid => tid !== id));

      // Remove from DOM after transition
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300); // match CSS duration
    }, 5000);
  };

  const handleClose = (id: number) => {
    setVisibleToasts(prev => prev.filter(tid => tid !== id));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  };

  const getIcon = (variant: ToastVariant) => {
        switch (variant) {
            case 'error':
            return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="2" d="M12 9v4m0 4h.01M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
                </svg>
            );
            case 'warning':
            return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a1 1 0 0 0 .86 1.5h18.64a1 1 0 0 0 .86-1.5L13.71 3.86a1 1 0 0 0-1.72 0Z" />
                </svg>
            );
            case 'known':
            return (
              <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m17 21-5-4-5 4V3.889a.92.92 0 0 1 .244-.629.808.808 0 0 1 .59-.26h8.333a.81.81 0 0 1 .589.26.92.92 0 0 1 .244.63V21Z"/>
              </svg>
            );
            case 'info':
              return (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
                    fill="#1C274C"
                  />
                </svg>
              );
            case 'success':
            default:
            return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 18 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z" />
                </svg>
            );
        }
    };

    const getBgColor = (variant: ToastVariant) => {
        switch (variant) {
            case 'error':
              return 'bg-red-100';
            case 'warning':
              return 'bg-yellow-100';
            case 'known':
              return 'bg-orange-100';
            case 'info':
              return 'bg-blue-100';
            case 'success':
            default:
              return 'bg-green-100';
        }
    };

    const getTextColor = (variant: ToastVariant) => {
        switch (variant) {
            case 'error':
              return 'text-red-600';
            case 'warning':
              return 'text-yellow-600';
            case 'known':
              return 'text-orange-500';
            case 'info':
              return 'text-blue-600';
            case 'success':
            default:
              return 'text-green-500';
        }
    };


  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(({ id, title, subtitle, variant }) => {
          const isVisible = visibleToasts.includes(id);
          return (
            <div
              key={id}
              className={`flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out transform
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
              role="alert"
            >
            <div className={`inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${getBgColor(variant)} ${getTextColor(variant)}`}>
                {getIcon(variant)}
              </div>
              <div className="ms-3 text-sm font-normal">
                <div className="font-semibold text-gray-900">{title}</div>
                {subtitle && <div>{subtitle}</div>}
              </div>
              <button
                onClick={() => handleClose(id)}
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
                aria-label="Close"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context.showToast;
};
