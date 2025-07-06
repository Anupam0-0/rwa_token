import React from "react";
import YC from "../assets/YC.jpg";

const CardDetails = [
  {
    title: "Manhattan Luxury Apartment",
    Category: "Real Estate",
    TotalPrice: "$2,500,500",
    TokenPrice: "$1.00",
    ExpectedAPY: "8.5%",
  },
  {
    title: "Vintage Wine Collection",
    Category: "Collectibles",
    TotalPrice: "$800,500",
    TokenPrice: "$1.00",
    ExpectedAPY: "12.3%",
  },
  {
    title: "Gold Mining Rights",
    Category: "Commodities",
    TotalPrice: "$1,200,500",
    TokenPrice: "$1.00",
    ExpectedAPY: "15.7%",
  },
];

const FeaturesAssetsSection = () => {
  return (
    <div className="py-24 flex flex-col gap-12 ">
      <h1 className="text-5xl text-center font-bold">Featured Assets</h1>
      <div className="grid grid-cols-3 mx-auto py-4 gap-12">
        {CardDetails.map((card, i) => (
          <div
            key={i}
            className="p-4 col-span-1 flex flex-col rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          >
            <img
              src={YC}
              alt="thumbnail"
              className="h-72 object-cover rounded-lg"
            />
            <div className="py-4 flex flex-col gap-2">
              <h2 className="text-2xl font-medium">{card.title}</h2>
              <p className="text-base font-medium text-neutral-500">{card.Category}</p>
              <div className="flex flex-col gap-2 py-3">
                <div className="flex justify-between">
                  <p>Total Value:</p>
                  <p className="font-medium">{card.TotalPrice}</p>
                </div>
                <div className="flex justify-between">
                  <p>Token Price:</p>
                  <p className="font-medium">{card.TokenPrice}</p>
                </div>
                <div className="flex justify-between">
                  <p>Expected APY:</p>
                  <p className="text-green-600 font-medium" >{card.ExpectedAPY}</p>
                </div>
              </div>
            </div>

            <button className="font-medium text-neutral-50 bg-sky-500 hover:bg-sky-600 py-2 rounded-lg cursor-pointer">
                View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesAssetsSection;
