'use client';

import { useToast } from "@/app/hooks/useToast";
import GoogleTTSButton from "../GoogleTTSButton/GoogleTTSButton";

interface WordPopoverProps {
    word: string;
}

export default function WordPopover({ word }: WordPopoverProps) {
    const toast = useToast();
  return (
    <div className="absolute left-10 top-[-10px] mt-1 bg-white dark:hover:bg-gray-[#181922] border border-gray-300 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 p-2 flex gap-2 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
            <GoogleTTSButton text={word} />
            <button className="w-6 h-6 flex items-center justify-center rounded text-blue-500 hover:bg-gray-100" onClick={(e) => {
                e.stopPropagation();
                toast({ title: 'Copied Word', subtitle: `'${word}' copied to clipboard`, variant: 'success' });
            }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="1em"
                        height="1em"
                        >
                        <path
                            fill="currentColor"
                            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"
                        ></path>
                    </svg>
            </button>
        </div>
    </div>
  );
}
