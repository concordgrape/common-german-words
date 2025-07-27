import React from "react";
import EpubReader from "./EpubReader";

export const BookSection = () => {
    return (
        <div className={`w-full max-w-[800px] p-1 sm:p-4 md:p-4 items-start overflow-hidden mt-5 px-2 lg:px-5`}>
            <h1 className="text-black text-5xl font-extrabold">Learn</h1>
            <h2 className="text-gray-700 text-base font-regular">Customize how you&apos;ll practise a set of words, you can also navigate to the <a href="/browse" className='text-blue-700'><u>Browse page</u></a> to add words to the &apos;saved&apos; collection</h2>
            <BookContentSection />
        </div>
    )
}

const BookContentSection = () => {
    return (
        <div className="bg-[#FFFFFF] border-1 border-gray-200 px-6 py-4 pt-5 rounded-lg mt-3 shadow-sm">
            <EpubReader />
        </div>
    );
}