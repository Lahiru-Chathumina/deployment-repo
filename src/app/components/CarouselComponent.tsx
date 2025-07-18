'use client';

import 'flowbite';

export default function CarouselComponent() {
  const slides = [1, 2, 3]; 
  return (
    <div id="default-carousel" className="relative w-full max-w-6xl mx-auto mb-12" data-carousel="slide">
      <div className="relative h-56 overflow-hidden rounded-xl md:h-96">
        {slides.map((n, index) => (
          <div
            key={index}
            className={`duration-700 ease-in-out ${index === 0 ? 'block' : 'hidden'}`}
            data-carousel-item={index === 0 ? 'active' : ''}
          >
            <img
              src={`/slider/carousel-${n}.jpg`} 
              className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-cover"
              alt={`Slide ${n}`}
            />
          </div>
        ))}
      </div>

      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`w-3 h-3 rounded-full bg-white ${idx === 0 ? 'opacity-100' : 'opacity-50'}`}
            aria-current={idx === 0 ? 'true' : 'false'}
            aria-label={`Slide ${idx + 1}`}
            data-carousel-slide-to={idx}
          />
        ))}
      </div>

      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-prev
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
          <svg
            className="w-4 h-4 text-white rtl:rotate-180"
            fill="none"
            viewBox="0 0 6 10"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
          <svg
            className="w-4 h-4 text-white rtl:rotate-180"
            fill="none"
            viewBox="0 0 6 10"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
}
