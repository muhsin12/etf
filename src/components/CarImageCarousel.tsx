'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/styles/carousel.css';

interface CarImageCarouselProps {
  images: { url: string }[];
  altText: string;
  className?: string;
  showThumbnails?: boolean;
}

const CarImageCarousel: React.FC<CarImageCarouselProps> = ({
  images,
  altText,
  className = 'w-full h-48',
  showThumbnails = false
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider | null>(null);
  const thumbnailSliderRef = useRef<Slider | null>(null);
  
  // Default image if no images are provided
  const defaultImage = '/placeholder-car.jpg';
  
  // If no images, return default image
  if (!images || images.length === 0) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image 
          src={defaultImage} 
          alt={altText} 
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    );
  }
  
  // If only one image, return it without carousel
  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image 
          src={images[0].url} 
          alt={altText} 
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    );
  }

  const mainSettings = {
    dots: !showThumbnails,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    autoplay: false,
    className: `carousel-container ${className}`,
    fade: true
  };
  
  const thumbnailSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: images.length > 5 ? 5 : images.length,
    slidesToScroll: 1,
    arrows: true,
    focusOnSelect: true,
    centerMode: images.length > 5,
    centerPadding: '0px',
    className: 'thumbnail-slider',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: images.length > 3 ? 3 : images.length,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="relative group" onClick={(e) => e.stopPropagation()}>
      <Slider 
        ref={sliderRef}
        {...mainSettings}
      >
        {images.map((image, index) => (
          <div key={index} className={`relative overflow-hidden ${className}`}>
            <Image 
              src={image.url} 
              alt={`${altText} - Image ${index + 1}`} 
              fill
              style={{ objectFit: 'cover' }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ))}
      </Slider>
      
      {/* Thumbnail navigation */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-4">
          <Slider
            ref={thumbnailSliderRef}
            {...thumbnailSettings}
            afterChange={(current) => {
              if (sliderRef.current) {
                sliderRef.current.slickGoTo(current);
              }
            }}
          >
            {images.map((image, index) => (
              <div key={index} className="px-1">
                <div className={`relative overflow-hidden h-16 ${currentSlide === index ? 'ring-2 ring-blue-500' : ''}`}>
                  <Image
                    src={image.url}
                    alt={`${altText} - Thumbnail ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (sliderRef.current) {
                        sliderRef.current.slickGoTo(index);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
      
      {/* Image counter - only show if thumbnails are not displayed */}
      {!showThumbnails && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
          {currentSlide + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default CarImageCarousel;
