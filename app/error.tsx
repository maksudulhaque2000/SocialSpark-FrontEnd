"use client";

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console (or send to external logging service)
    console.error('Unhandled error (app/error.tsx):', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full text-center bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Something went wrong</h1>
        <p className="text-gray-600 mb-6">An unexpected error occurred. You can try to reload the page or return to the homepage.</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Try again
          </button>

          <Link
            href="/"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex items-center justify-center"
          >
            Go to Home
          </Link>
        </div>

        <details className="mt-6 text-left text-sm text-gray-500">
          <summary className="cursor-pointer">Technical details (expand)</summary>
          <pre className="whitespace-pre-wrap mt-2 break-words">{String(error?.message || 'No details available')}</pre>
        </details>
      </div>
    </div>
  );
}
