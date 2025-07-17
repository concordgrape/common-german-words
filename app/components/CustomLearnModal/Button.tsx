import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'default', className, ...props }) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition',
        variant === 'outline'
          ? 'border border-gray-300 text-gray-700 hover:bg-gray-100'
          : 'bg-blue-600 text-white hover:bg-blue-700',
        className
      )}
      {...props}
    />
  );
};
