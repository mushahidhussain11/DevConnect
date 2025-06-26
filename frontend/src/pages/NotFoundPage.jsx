import React from 'react'
import { Link } from "react-router-dom"; // Or 'next/link' for Next.js

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-[120px] font-bold text-[#4C68D5] leading-none">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-2">Page Not Found</h2>
      <p className="text-gray-500 mt-3 mb-6 max-w-md">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-[#4C68D5] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#3f56b5] transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
