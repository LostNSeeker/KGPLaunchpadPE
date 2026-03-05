import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Children, useState, useEffect } from 'react';

type CarouselProps = {
  children: ReactNode;
  /** Hide prev/next buttons and dots */
  hideControls?: boolean;
  /** Auto-advance interval in ms (only when hideControls is true) */
  autoPlayInterval?: number;
}

export default function Carousel({
  children,
  hideControls = false,
  autoPlayInterval = 0,
}: CarouselProps) {

  const [curr, setCurr] = useState(0);
  const slides = Children.toArray(children);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));

  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    if (!hideControls || autoPlayInterval <= 0 || slides.length <= 1) return;
    const t = setInterval(() => {
      setCurr((c) => (c === slides.length - 1 ? 0 : c + 1));
    }, autoPlayInterval);
    return () => clearInterval(t);
  }, [hideControls, autoPlayInterval, slides.length]);

  return (
    <div className='w-full overflow-hidden relative'>
      <div
        className='flex transition-transform ease-out duration-500'
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full min-w-full flex-shrink-0">
            {slide}
          </div>
        ))}
      </div>

      {!hideControls && (
        <>
          <div className='absolute inset-0 flex items-center justify-between p-4 pointer-events-none'>
            <button onClick={prev} className='pointer-events-auto p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white'>
              <ChevronLeft size={40} />
            </button>
            <button onClick={next} className='pointer-events-auto p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white'>
              <ChevronRight size={40} />
            </button>
          </div>
          <div className='absolute bottom-4 right-0 left-0 pointer-events-none'>
            <div className='flex items-center justify-center gap-2'>
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`
                    transition-all w-3 h-3 bg-white rounded-full
                    ${curr === i ? "p-2" : "bg-opacity-50"}
                  `}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}