import { Link } from 'react-router-dom';
import { Particles } from './Particles';

const NotFoundPage = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Particles background */}
      <div className="absolute inset-0 z-0">
        <Particles />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-xl text-center">
          

          {/* Text Content */}
          <h1 className="text-5xl font-bold text-purple-900 mb-4">404 - Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Oops! It seems like you've ventured into uncharted territory. The page you're looking for doesn't exist.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/" 
              className="px-8 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
            >
              Go Home
            </Link>
            <Link 
              to="/study-buddy" 
              className="px-8 py-3 border-2 border-purple-600 text-purple-600 font-medium rounded-xl hover:bg-purple-50 transition-colors"
            >
              Study Buddy
            </Link>
          </div>
        </div>

        {/* Decorative Elements - now semi-transparent to blend with particles */}
        <div className="absolute -z-10 top-20 right-20 w-32 h-32 rounded-full bg-purple-100/70 blur-3xl opacity-70"></div>
        <div className="absolute -z-10 bottom-20 left-20 w-40 h-40 rounded-full bg-purple-50/70 blur-3xl opacity-80"></div>
      </div>
    </section>
  );
};

export default NotFoundPage;