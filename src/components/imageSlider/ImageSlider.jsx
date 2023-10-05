import { useCallback, useEffect, useRef, useState } from "react";
import styles from './ImageSlider.module.scss'
import classNames from "classnames/bind";
import { LazyLoadImage } from "react-lazy-load-image-component";

const cx = classNames.bind(styles);

const slidesContainerStyles = {
  display: 'flex',
  height: '100%',
  transition: 'transform ease-out 0.5s',
}

const slidesContainerOverflowStyles = {
  overflow: 'hidden',
  height: '100%',
  borderRadius: '30px'
}

const ImageSlider = ({ slides, parentWidth }) => {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeRef = useRef(null);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const getSlideStylesWithBackground = () => ({
    width: `${parentWidth}px`,
  })

  const getSliderContainerStylesWithWidth = () => ({
    ...slidesContainerStyles,
    width: parentWidth * slides.length,
    transform: `translateX(${-(currentIndex * parentWidth)}px)`
  })

  useEffect(() => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }

    timeRef.current = setTimeout(() => {
      goToNext();
    }, 2000)

    return ((() => {
      clearTimeout(timeRef.current)
    }))
  }, [goToNext])

  return (
    <div className={cx("slider")}>
      <div>
        <div onClick={goToPrevious} className={cx("left-arrow")}>
          ❰
        </div>
        <div onClick={goToNext} className={cx("right-arrow")}>
          ❱
        </div>
      </div>

      <div style={slidesContainerOverflowStyles}>
        <div style={getSliderContainerStylesWithWidth()}>
          {slides.map((_, slideIndex) => (
            <LazyLoadImage 
              key={slideIndex}
              src={`${slides[slideIndex].url}`}
              alt={`Carousel ${slideIndex}`}
              effect='blur'
              placeholderSrc={`${slides[slideIndex].url}`}
              style={getSlideStylesWithBackground(slideIndex)}
            />
          ))}
        </div>
      </div>

      <div className={cx("dot-container")}>
        {slides.map((_, slideIndex) => (
          <div
            className={cx("dot")}
            style={currentIndex === slideIndex ? {color: '#FF7E00'} : {}}
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
          >
            ●
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;