import React from "react";
import YC from "../assets/YC.jpg";
import { Link } from 'react-router-dom';
import { useState } from "react";

export const CardDetails = [
  {
    id: 1001,
    title: "Manhattan Luxury Apartment",
    Category: "Real Estate",
    TotalPrice: "$2,500,500",
    TokenPrice: "$1.00",
    ExpectedAPY: "8.5%",
    location: "Manhattan, NY",
    description: "A luxury apartment in the heart of Manhattan.",
    images: [],
    documents: [],
    total_value: 2500500,
    token_price: 1,
    total_tokens: 2500500,
    available_tokens: 2500500,
    apy: 8.5,
    status: "Active",
    launch_date: "2024-01-01T00:00:00.000Z",
    monthly_income: 15000,
    risk_rating: "A",
    key_metrics: {
      cap_rate: 5.2,
      occupancy_rate: 98,
      location_score: 9.5,
      liquidity_rating: "High"
    }
  },
  {
    id: 1002,
    title: "Vintage Wine Collection",
    Category: "Collectibles",
    TotalPrice: "$800,500",
    TokenPrice: "$1.00",
    ExpectedAPY: "12.3%",
    location: "Bordeaux, France",
    description: "A rare collection of vintage wines from Bordeaux.",
    images: [],
    documents: [],
    total_value: 800500,
    token_price: 1,
    total_tokens: 800500,
    available_tokens: 800500,
    apy: 12.3,
    status: "Active",
    launch_date: "2024-01-01T00:00:00.000Z",
    monthly_income: 4000,
    risk_rating: "B",
    key_metrics: {
      cap_rate: 7.1,
      occupancy_rate: 100,
      location_score: 8.2,
      liquidity_rating: "Medium"
    }
  },
  {
    id: 1003,
    title: "Gold Mining Rights",
    Category: "Commodities",
    TotalPrice: "$1,200,500",
    TokenPrice: "$1.00",
    ExpectedAPY: "15.7%",
    location: "Nevada, USA",
    description: "Mining rights for a gold-rich area in Nevada.",
    images: [],
    documents: [],
    total_value: 1200500,
    token_price: 1,
    total_tokens: 1200500,
    available_tokens: 1200500,
    apy: 15.7,
    status: "Active",
    launch_date: "2024-01-01T00:00:00.000Z",
    monthly_income: 9000,
    risk_rating: "C",
    key_metrics: {
      cap_rate: 9.3,
      occupancy_rate: 100,
      location_score: 7.8,
      liquidity_rating: "Low"
    }
  }
];

const FeaturesAssetsSection = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  return (
    <div className="py-24 flex flex-col gap-12 ">
      <h1 className="text-5xl text-center font-bold">Featured Assets</h1>
      <div className="grid grid-cols-3 mx-auto py-4 gap-12">
        {CardDetails.map((card, i) => (
          <div
            key={i}
            className="p-4 col-span-1 flex flex-col rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          >
            {/* <img
              src={YC}
              alt="thumbnail"
              className="h-72 object-cover rounded-lg"
            /> */}
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

            <button
              className="font-medium text-neutral-50 bg-sky-500 hover:bg-sky-600 py-2 rounded-lg cursor-pointer text-center block"
              onClick={() => setSelectedAsset(card)}
            >
                View Details
            </button>
          </div>
        ))}
      </div>
      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setSelectedAsset(null)}>
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-2">{selectedAsset.title}</h2>
            <p className="text-base text-neutral-500 mb-4">{selectedAsset.Category} | {selectedAsset.location}</p>
            <p className="mb-4">{selectedAsset.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold">Total Value:</p>
                <p>{selectedAsset.TotalPrice}</p>
                <p className="font-semibold mt-2">Token Price:</p>
                <p>{selectedAsset.TokenPrice}</p>
                <p className="font-semibold mt-2">Expected APY:</p>
                <p>{selectedAsset.ExpectedAPY}</p>
                <p className="font-semibold mt-2">Status:</p>
                <p>{selectedAsset.status}</p>
              </div>
              <div>
                <p className="font-semibold">Launch Date:</p>
                <p>{new Date(selectedAsset.launch_date).toLocaleDateString()}</p>
                <p className="font-semibold mt-2">Monthly Income:</p>
                <p>${selectedAsset.monthly_income}</p>
                <p className="font-semibold mt-2">Risk Rating:</p>
                <p>{selectedAsset.risk_rating}</p>
                <p className="font-semibold mt-2">Liquidity:</p>
                <p>{selectedAsset.key_metrics.liquidity_rating}</p>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setSelectedAsset(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturesAssetsSection;
