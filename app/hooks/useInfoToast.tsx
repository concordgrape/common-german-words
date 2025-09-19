// components/Toast/InfoToast.tsx
'use client';

import React, { useEffect, useState } from 'react';

type InfoToastProps = {
  loading: boolean;
  title: string;
  subtitle?: string;
};

export const InfoToast: React.FC<InfoToastProps> = ({ loading, title, subtitle }) => {
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (loading) {
      // Show the toast
      setVisible(true);

      // Clear any existing timer if we're re-entering loading
      if (timer) clearTimeout(timer);
    } else if (visible) {
      // Set a timeout to hide after 2 seconds minimum
      const t = setTimeout(() => setVisible(false), 2000);
      setTimer(t);
    }

    // Cleanup on unmount
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-[100px] right-4 z-50">
      <div
        className="flex items-center w-full max-w-xs p-4 text-gray-300 dark:text-gray-500 bg-gray-700 dark:bg-white rounded-lg shadow-sm"
        role="alert"
      >
        <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="ms-3 text-sm font-normal">
          <div className="font-semibold text-gray-100 dark:text-gray-900">{title}</div>
          {subtitle && <div>{subtitle}</div>}
        </div>
      </div>
    </div>
  );
};
