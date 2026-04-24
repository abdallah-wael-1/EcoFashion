import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">About EcoFashion</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            We''re building a sustainable fashion marketplace where conscious consumers can buy, sell, and swap quality fashion while earning EcoCredits and reducing their environmental impact.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sustainability</h3>
              <p className="text-gray-600 dark:text-gray-400">Reduce fashion waste through upcycling and secondhand commerce.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Community</h3>
              <p className="text-gray-600 dark:text-gray-400">Connect with eco-conscious fashion enthusiasts worldwide.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Trust</h3>
              <p className="text-gray-600 dark:text-gray-300">Verified sellers, quality items, and transparent reviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ready to Join?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Start your sustainable fashion journey today.</p>
          <Link
            to="/register"
            className="inline-flex px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold transition-colors cursor-pointer"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
