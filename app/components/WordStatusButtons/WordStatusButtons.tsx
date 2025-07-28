'use client';

import { FaCheck } from 'react-icons/fa';
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useIsMobile } from '@/app/helpers/utils';
//import { Word } from '@/app/helpers/fetchBasicWordList';

interface WordStatusButtonsProps {
 // word: Word;
  isPlusEnabled: boolean;
  isCheckEnabled: boolean;
  onPlusClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCheckClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function WordStatusButtons({
  //word,
  isPlusEnabled,
  isCheckEnabled,
  onPlusClick,
  onCheckClick,
}: WordStatusButtonsProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex gap-1 items-center">
      <div data-tip="Save Word" className="tooltip relative group w-8 h-8 sm:h-6 md:h-6 sm:w-6 md:w-6 lg:h-6 lg:w-6 mr-2">        
        <button
          className={`w-full h-full ${
            isPlusEnabled ? 'bg-orange-400 text-white' : 'bg-gray-200 dark:bg-gray-500 dark:text-gray-200 text-black'
          } rounded-sm hover:bg-orange-400 hover:text-white cursor-pointer`}
          onClick={onPlusClick}
        >
            {isPlusEnabled ? 
                <FaBookmark className="m-auto" size={isMobile ? 14 : 13} />
            :
                <FaRegBookmark className="m-auto" size={isMobile ? 14 : 13} />
            }
        </button>
      </div>

      <button data-tip="Known Word" className={`tooltip w-8 h-8 sm:h-6 md:h-6 sm:w-6 md:w-6 lg:h-6 lg:w-6 ${
          isCheckEnabled ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-500 dark:text-gray-200'
        } rounded-sm hover:bg-green-500 hover:text-white cursor-pointer`}
        onClick={onCheckClick}
      >
        <FaCheck className="m-auto" size={isMobile ? 12 : 10} />
      </button>
    </div>
  );
}
