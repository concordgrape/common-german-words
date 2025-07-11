import React from 'react';

// Define the type for a single sort option
export interface SortOption {
  id: 'frequency' | 'alphabetically' | 'date-saved' | 'next-review';
  label: string;
}

// Define the props for the SortButton component
interface SortButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
  color: string;
}

// SortButton component for individual sort options
const SortButton: React.FC<SortButtonProps> = ({ label, isActive, onClick, index, color }) => {
  // Determine if specific corners should be rounded based on index
  const isTopLeft = index === 0;
  const isTopRight = index === 1;
  const isBottomLeft = index === 2; // For a 2x2 grid, index 2 is bottom-left
  const isBottomRight = index === 3; // For a 2x2 grid, index 3 is bottom-right

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 py-2 px-4
        text-sm font-medium
        transition-all duration-200 ease-in-out
        ${
          isActive
            ? `${color} text-white shadow-md` // Active state styling
            : 'bg-[#F2F2F2] text-black hover:bg-gray-200' // Inactive state styling
        }
        focus:outline-none focus:ring-0
        sm:text-base // Larger text on small screens and up
        ${isTopLeft ? 'rounded-tl-lg' : ''}
        ${isTopRight ? 'rounded-tr-lg' : ''}
        ${isBottomLeft ? 'rounded-bl-lg' : ''}
        ${isBottomRight ? 'rounded-br-lg' : ''}
        // No 'rounded-lg' here to avoid rounding all corners by default.
        // Unspecified corners will remain sharp (0 radius).
      `}
    >
      {label}
    </button>
  );
};

export default SortButton;
