import React from 'react';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const RoomImageSlider = ({ images, currentSlide, setCurrentSlide }) => {
  const [sliderRef, instanceRef] = useKeenSlider({
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  return (
    <div className="relative rounded-lg overflow-hidden bg-black mb-4">
      <div ref={sliderRef} className="keen-slider h-[400px]">
        {images.map((img, i) => (
          <div key={i} className="keen-slider__slide flex justify-center items-center">
            <img
              src={img}
              alt={`Ảnh phòng ${i + 1}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.src = "https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg";
              }}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
          >
            ❮
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
          >
            ❯
          </button>
        </>
      )}

      <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        {currentSlide + 1} / {images.length}
      </div>
    </div>
  );
};

export default RoomImageSlider;