import { useEffect, useRef, useState } from 'react';

/**
 * SectionTitle — animated bordered heading, EcoFashion theme
 *
 * Props:
 *   badge      {string}  pill above title
 *   title      {string}  plain part of heading
 *   highlight  {string}  gradient-green part of heading
 *   subtitle   {string}  paragraph below
 *   align      {'center'|'left'}
 *   size       {'sm'|'md'|'lg'}
 */

const SectionTitle = ({
  badge,
  title = '',
  highlight = '',
  subtitle,
  align = 'center',
  size = 'lg',
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const centered = align !== 'left';

  const titleSize =
    size === 'sm' ? 'text-2xl sm:text-3xl' :
    size === 'md' ? 'text-3xl sm:text-4xl' :
                    'text-4xl sm:text-5xl';

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-3 ${centered ? 'items-center text-center' : 'items-start text-left'}`}
    >
      {/* Badge */}
      {badge && (
        <div
          className={`inline-flex items-center gap-2 rounded-full border border-green-200 dark:border-green-800
            bg-green-50 dark:bg-green-900/30 px-4 py-1.5
            text-xs font-semibold tracking-wide text-green-700 dark:text-green-400
            transition-all duration-700 ease-out
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          style={{ transitionDelay: '0ms' }}
        >
          {badge}
        </div>
      )}

      {/* Bordered animated box */}
      <div
        className={`relative transition-all duration-700 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: badge ? '80ms' : '0ms' }}
      >
        {/* Animated gradient border via pseudo wrapper */}
        <div className="relative rounded-2xl p-[2px] overflow-hidden">

          {/* Gradient border background */}
          <div
            className={`absolute inset-0 rounded-2xl transition-opacity duration-700
              ${visible ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #10b981, #34d399, #22c55e)',
              backgroundSize: '300% 300%',
              animation: visible ? 'borderRotate 4s linear infinite' : 'none',
            }}
          />

          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ zIndex: 1 }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-60%',
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                animation: visible ? 'shimmer 3s ease-in-out infinite 1s' : 'none',
              }}
            />
          </div>

          {/* Inner card */}
          <div className={`relative rounded-[14px] bg-white dark:bg-gray-900
            px-8 py-5 sm:px-12 sm:py-6`}
            style={{ zIndex: 2 }}
          >
            <h2 className={`${titleSize} font-bold leading-tight tracking-tight
              text-gray-900 dark:text-white`}>
              {title && !highlight && title}

              {title && highlight && (
                <>
                  {title}{' '}
                  <span className="relative inline-block">
                    <span
                      className={`absolute -bottom-1 left-0 h-[3px] rounded-full
                        bg-gradient-to-r from-green-500 to-emerald-400
                        transition-all duration-700 ease-out
                        ${visible ? 'w-full' : 'w-0'}`}
                      style={{ transitionDelay: '500ms' }}
                    />
                    <span className="bg-gradient-to-r from-green-500 to-emerald-400
                      dark:from-green-400 dark:to-emerald-300 bg-clip-text text-transparent">
                      {highlight}
                    </span>
                  </span>
                </>
              )}

              {!title && highlight && (
                <span className="relative inline-block">
                  <span
                    className={`absolute -bottom-1 left-0 h-[3px] rounded-full
                      bg-gradient-to-r from-green-500 to-emerald-400
                      transition-all duration-700 ease-out
                      ${visible ? 'w-full' : 'w-0'}`}
                    style={{ transitionDelay: '500ms' }}
                  />
                  <span className="bg-gradient-to-r from-green-500 to-emerald-400
                    dark:from-green-400 dark:to-emerald-300 bg-clip-text text-transparent">
                    {highlight}
                  </span>
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Dots at ends of border box */}
        <div
          className={`flex justify-between px-1 mt-1.5
            transition-all duration-500
            ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '800ms' }}
          aria-hidden
        >
          {[0, 1].map(i => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-green-500"
              style={{
                boxShadow: '0 0 6px #22c55e',
                animation: visible ? `dotPulse 2s ease-in-out infinite ${i * 0.4}s` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`max-w-2xl text-base sm:text-lg leading-relaxed
            text-gray-500 dark:text-gray-400
            transition-all duration-700 ease-out
            ${centered ? 'mx-auto' : ''}
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          style={{ transitionDelay: '320ms' }}
        >
          {subtitle}
        </p>
      )}

      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes borderRotate {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0%   { left: -60%; }
          100% { left: 120%; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
};

export default SectionTitle;