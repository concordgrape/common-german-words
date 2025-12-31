import React from "react";

// Define the type for a single sort option
export interface SortOption {
  id: "frequency" | "alphabetically" | "my-saved" | "my-known";
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
const SortButton: React.FC<SortButtonProps> = ({
  label,
  isActive,
  onClick,
  index,
  color,
}) => {
  // Determine if specific corners should be rounded based on index
  const isTopLeft = index === 0;
  const isTopRight = index === 1;
  const isBottomLeft = index === 2; // For a 2x2 grid, index 2 is bottom-left
  const isBottomRight = index === 3; // For a 2x2 grid, index 3 is bottom-right

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 py-3 ${color == "bg-orange-400" ? "px-4 sm:px-4 md:px-6 text-lg" : "text-sm"} sm:px-0 md:px-2 lg:px-3
        font-medium text-center
        transition-all duration-200 ease-in-out
        ${
          isActive
            ? `${color} text-white dark:text-black shadow-md` // Active state styling
            : "bg-[#F2F2F2] dark:bg-[#1B263B] text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600" // Inactive state styling
        }
        focus:outline-none focus:ring-0
        border-[0.01vw] border-gray-200 dark:border-gray-600
        ${isTopLeft ? "rounded-tl-lg" : ""}
        ${isTopRight ? "rounded-tr-lg" : ""}
        ${isBottomLeft ? "rounded-bl-lg" : ""}
        ${isBottomRight ? "rounded-br-lg" : ""}
        // No 'rounded-lg' here to avoid rounding all corners by default.
        // Unspecified corners will remain sharp (0 radius).
      `}
    >
      {label}
    </button>
  );
};

export default SortButton;
