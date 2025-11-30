import Link from 'next/link';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[200px] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            The page you&apos;re looking for seems to have wandered off...
          </p>
          <p className="text-gray-500">
            Don&apos;t worry, even the best explorers get lost sometimes! 🗺️
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-12">
          <div className="text-8xl mb-4 animate-bounce">
            🔍
          </div>
          <p className="text-gray-500 italic">
            &quot;Not all who wander are lost, but this page definitely is!&quot;
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiHome className="mr-2 group-hover:animate-pulse" />
            Back to Home
          </Link>
          
          <Link
            href="/events"
            className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition inline-flex items-center shadow-md hover:shadow-lg border border-gray-200"
          >
            <FiSearch className="mr-2" />
            Browse Events
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Home
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/events"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Events
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/about"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              About
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Login
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">💡 Fun Fact:</span> The first documented use of &quot;404&quot; 
            as an error code was at CERN in 1992. Now you know! 🎓
          </p>
        </div>
      </div>
    </div>
  );
}
