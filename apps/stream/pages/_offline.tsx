import Image from "next/image";
import React from "react";

export default function Fallback() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-secondary">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6">
          <Image
            src="/offline-icon.svg"
            alt="Offline"
            height={120}
            width={120}
            className="mx-auto"
          />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800">You're Offline</h1>
        <p className="text-gray-600 mb-6">
          It seems you've lost your internet connection. Please check your network and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}
