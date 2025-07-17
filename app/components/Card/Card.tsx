import React, { useState } from 'react';
import { IconType } from 'react-icons';
import CustomLearnModal from '../CustomLearnModal/CustomLearnModal';

interface CardProps {
  icon: IconType;
  iconBgColor: string;
  title: string;
  description: string;
  features: string[];
}

export const Card: React.FC<CardProps> = ({
  icon: Icon,
  iconBgColor,
  title,
  description,
  features,
}) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm flex flex-col gap-4 text-center transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-lg">
        <div className={`w-18 h-18 mx-auto flex items-center justify-center rounded-xl ${iconBgColor}`}>
            <Icon className="text-white text-4xl" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <ul className="text-gray-500 text-sm space-y-1">
            {features.map((feature, index) => (
            <li key={index}>{feature}</li>
            ))}
        </ul>
        <button className="cursor-pointer mt-2 bg-black text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition" onClick={() => setOpen(true)}>
            Start Learning →
        </button>

        <CustomLearnModal key={title} isOpen={open} onClose={() => setOpen(false)} />
        </div>
    );
};
