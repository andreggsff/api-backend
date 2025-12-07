import React, { FC, ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode; 
}

export const ChartCard: FC<ChartCardProps> = ({ title, children }) => {
  return (
<div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        {title}
      </h2>
      
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;