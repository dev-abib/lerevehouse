import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-auto mt-[150px]  bg-gray-100 px-4 py-10 md:py-20">
      <div className="text-center container mx-auto px-4 lg:px-8 2xl:px-16 3xl:px-32 bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-semibold text-gray-800 mb-2">
          Oops! Something went wrong.
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          We couldn't find the page you were looking for.
        </p>
        <p className="text-sm text-gray-500">
          Please check the URL, or{" "}
          <a href="/" className="text-blue-500 hover:underline">
            return to the homepage
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
