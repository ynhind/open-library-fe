import React from "react";
import "./FeaturesBook.css";
import TitileTypeOne from "../../UI/TitileTypeOne/TitileTypeOne";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { featuredBooksData } from "../../Data/Data";

import { BsArrowReturnRight } from "react-icons/bs";

const breakpoints = {
  1024: {
    slidesPerView: 4,
    spaceBetweenSlides: 30,
  },
  768: {
    slidesPerView: 3,
    spaceBetweenSlides: 20,
  },
  480: {
    slidesPerView: 2,
    spaceBetweenSlides: 10,
  },
  0: {
    slidesPerView: 1,
    spaceBetweenSlides: 10,
  },
};

export default function FeaturesBook() {
  return (
    <section>
      <div className="container features-book-container">
        <TitileTypeOne
          TitleTop={"Some quality items"}
          Title={"Featured Books"}
        />
        <Swiper
          spaceBetween={50}
          slidesPerView={4}
          loop={true}
          modules={[Pagination]}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          breakpoints={breakpoints}
        >
          {featuredBooksData.map(
            ({ img, imgLlink, name, nameLink, writer, price }, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="featurebook-box">
                    <Link to={imgLlink}>
                      <img src={img} alt="" />
                    </Link>
                    <div className="featurebook-info">
                      <Link to={nameLink}>
                        <h4>{name}</h4>
                      </Link>
                      <div>
                        <small>{writer}</small>
                      </div>
                      <h5>
                        <span>{price}</span>
                      </h5>
                    </div>
                  </div>
                </SwiperSlide>
              );
            }
          )}
          <div className="feature-border container"></div>
          <div className="swiper-pagination"></div>
          <Link to="*" className="btn feature-btn">
            View all products <BsArrowReturnRight />
          </Link>
        </Swiper>
      </div>
    </section>
  );
}
