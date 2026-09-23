import { useEffect, useRef } from 'react';
import $ from 'jquery';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import imageOne from './img/shose.jpg';
import amazonImage from './img/shop.jpg';
import electronicsImage from './img/electronics.jpg';
import fashionImage from './img/bagshop.jpg';

function CarouselEffect() {

  const carouselRef = useRef(null);

  useEffect(() => {

    const $carousel = $(carouselRef.current);
    const $track = $carousel.find('.carousel-track');
    const $slides = $carousel.find('.carousel-slide');
    const $dots = $carousel.find('.carousel-dot');

    const totalSlides = $slides.length;

    let currentSlide = 0;
    let autoplay;
    let startX = 0;
    let endX = 0;

    const showSlide = (index, direction = 'next') => {

      if (index < 0) {
        index = totalSlides - 1;
      }

      if (index >= totalSlides) {
        index = 0;
      }

      currentSlide = index;

      $slides.removeClass('active previous next');

      $slides
        .eq(index)
        .addClass('active');

      $track.css(
        'transform',
        `translateX(-${index * 100}%)`
      );

      $dots
        .removeClass('active')
        .eq(index)
        .addClass('active');

      /*
       * Small visual direction class
       */
      if (direction === 'next') {
        $carousel
          .removeClass('slide-prev')
          .addClass('slide-next');
      } else {
        $carousel
          .removeClass('slide-next')
          .addClass('slide-prev');
      }

    };

    const nextSlide = () => {
      showSlide(currentSlide + 1, 'next');
    };

    const previousSlide = () => {
      showSlide(currentSlide - 1, 'prev');
    };

    const startAutoplay = () => {

      clearInterval(autoplay);

      autoplay = setInterval(() => {
        nextSlide();
      }, 4500);

    };

    const stopAutoplay = () => {
      clearInterval(autoplay);
    };


    /*
     * Previous
     */

    $carousel
      .find('.carousel-prev')
      .on('click', () => {

        previousSlide();
        startAutoplay();

      });


    /*
     * Next
     */

    $carousel
      .find('.carousel-next')
      .on('click', () => {

        nextSlide();
        startAutoplay();

      });


    /*
     * Dots
     */

    $dots.on('click', function () {

      const index = $(this).index();

      if (index > currentSlide) {
        showSlide(index, 'next');
      } else {
        showSlide(index, 'prev');
      }

      startAutoplay();

    });


    /*
     * Pause when mouse is over carousel
     */

    $carousel
      .on('mouseenter', stopAutoplay)
      .on('mouseleave', startAutoplay);


    /*
     * Touch / swipe
     */

    $carousel.on('touchstart', function (event) {

      startX =
        event.originalEvent.touches[0].clientX;

    });

    $carousel.on('touchend', function (event) {

      endX =
        event.originalEvent.changedTouches[0].clientX;

      const distance = startX - endX;

      if (Math.abs(distance) < 50) {
        return;
      }

      if (distance > 0) {
        nextSlide();
      } else {
        previousSlide();
      }

      startAutoplay();

    });


    /*
     * Keyboard
     */

    $(document).on('keydown.carousel', function (event) {

      if (event.key === 'ArrowRight') {
        nextSlide();
        startAutoplay();
      }

      if (event.key === 'ArrowLeft') {
        previousSlide();
        startAutoplay();
      }

    });


    /*
     * Initial slide
     */

    showSlide(0);

    startAutoplay();


    /*
     * Cleanup
     */

    return () => {

      stopAutoplay();

      $carousel
        .find('.carousel-prev')
        .off('click');

      $carousel
        .find('.carousel-next')
        .off('click');

      $dots.off('click');

      $carousel
        .off('mouseenter mouseleave');

      $carousel.off('touchstart touchend');

      $(document).off('keydown.carousel');

    };

  }, []);


  return (

    <section
      className="hero-carousel"
      ref={carouselRef}
    >

      <div className="carousel-track">


        {/* =========================
            IMAGE 1
        ========================= */}

        <article className="carousel-slide">

          <img
            src={imageOne}
            alt="E-Shop collection"
            className="carousel-image"
          />

          <div className="carousel-overlay" />

          <div className="carousel-action">

            <Link
              to="/products"
              className="image-shop-button"
            >
              Shop now
              <ArrowUpRight size={18} />
            </Link>

          </div>

        </article>


        {/* =========================
            IMAGE 2
        ========================= */}

        <article className="carousel-slide">

          <img
            src={fashionImage}
            alt="Fashion collection"
            className="carousel-image"
          />

          <div className="carousel-overlay" />

          <div className="carousel-action">

            <Link
              to="/products"
              className="image-shop-button"
            >
              Shop now
              <ArrowUpRight size={18} />
            </Link>

          </div>

        </article>


        {/* =========================
            IMAGE 3
        ========================= */}

        <article className="carousel-slide">

          <img
            src={electronicsImage}
            alt="Electronics collection"
            className="carousel-image"
          />

          <div className="carousel-overlay" />

          <div className="carousel-action">

            <Link
              to="/products"
              className="image-shop-button"
            >
              Shop now
              <ArrowUpRight size={18} />
            </Link>

          </div>

        </article>


        {/* =========================
            IMAGE 4
        ========================= */}

        <article className="carousel-slide">

          <img
            src={amazonImage}
            alt="Online shopping collection"
            className="carousel-image"
          />

          <div className="carousel-overlay" />

          <div className="carousel-action">

            <Link
              to="/products"
              className="image-shop-button"
            >
              Shop now
              <ArrowUpRight size={18} />
            </Link>

          </div>

        </article>

      </div>


      {/* =========================
          ARROWS
      ========================= */}

      <button
        type="button"
        className="carousel-control carousel-prev"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        type="button"
        className="carousel-control carousel-next"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>


      {/* =========================
          DOTS
      ========================= */}

      <div className="carousel-dots">

        <button
          type="button"
          className="carousel-dot active"
          aria-label="Slide 1"
        />

        <button
          type="button"
          className="carousel-dot"
          aria-label="Slide 2"
        />

        <button
          type="button"
          className="carousel-dot"
          aria-label="Slide 3"
        />

        <button
          type="button"
          className="carousel-dot"
          aria-label="Slide 4"
        />

      </div>

    </section>

  );
}

export default CarouselEffect;