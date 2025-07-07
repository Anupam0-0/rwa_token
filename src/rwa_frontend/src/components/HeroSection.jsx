import React from "react";
import {ArrowRight} from 'lucide-react';

const HeroSection = () => {
  return (
    <div className=" min-h-[calc(100vh-7rem)] flex justify-center bg-gradient-to-b from-white to-sky-100">
      <div className="py-28 flex flex-col gap-10 text-center">
        <h1 className="text-7xl font-bold">Tokenize Real-World Assets</h1>
        <p className=" text-2xl max-w-4xl text-neutral-600">
          Unlock liquidity in real estate, art, commodities, and more through
          fractional <span className="text-purple-500">ownership</span> on the <span className="text-purple-500">Internet Computer Blockchain</span>. Access
          global markets with unpreceeded estate.
        </p>
        <div className="flex gap-6 justify-center text-xl">
            <button className="bg-sky-500 hover:bg-sky-600 text-neutral-100 rounded-lg shadow-xl py-2 px-10 flex justify-center items-center cursor-pointer font-medium">Explore Assets <span className="ml-4" ><ArrowRight size={20} /></span> </button>
            <button className="text-neutral-600 bg-white rounded-lg shadow-xl py-4 px-8 flex justify-center items-center cursor-pointer font-medium">Tokenize your Asset</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
