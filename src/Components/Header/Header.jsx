import React from "react";
import "./Header.css";
import { headerBooks } from "../../Data/Data";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { GoArrowRight } from "react-icons/go";
import { GoArrowLeft } from "react-icons/go";

import headerShape from "../../assets/header-shape.svg";

export default function Header() {
  return (
    <header>
      <div className=" header-container">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          loop={true}
          modules={[Navigation, Pagination]}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            prevEl: ".button-prev-slide",
            nextEl: ".button-next-slide",
          }}
        >
          {headerBooks.map(({ title, info, img, btnLink }, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="header-wrapper container">
                  <div className="header-left">
                    <h1>{title}</h1>
                    <p dangerouslySetInnerHTML={{ __html: info }}></p>
                    <Link className="btn btn-border" to={btnLink}>
                      Learn More
                    </Link>
                  </div>
                  <div className="header-right">
                    <img src={img} alt="" />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
          <div className="slider-button">
            <div className="button-prev-slide slidebutton">
              <GoArrowLeft />
            </div>
            <div className="button-next-slide slidebutton">
              <GoArrowRight />
            </div>
          </div>
          <div className="container">
            <div className="swiper-pagination"></div>
          </div>
        </Swiper>
        <div className="header-shape">
          <img src={headerShape} className="header-s" alt=""></img>
        </div>
      </div>
    </header>
  );
}

// import React from "react";
// import "./Header.css";
// import { headerBooks } from "../../Data/Data";
// import { Link } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch, faShoppingBasket } from "@fortawesome/free-solid-svg-icons";

// export default function Header() {
//   return (
//     <header className="vintage-header">
//       <div className="header-container">
//         <Swiper
//           spaceBetween={50}
//           slidesPerView={1}
//           loop={true}
//           modules={[Navigation, Pagination]}
//           pagination={{ el: ".swiper-pagination", clickable: true }}
//           navigation={{
//             prevEl: ".button-prev-slide",
//             nextEl: ".button-next-slide",
//           }}
//         >
//           {headerBooks.map(({ title, info, img, btnLink }, index) => {
//             return (
//               <SwiperSlide key={index}>
//                 <div className="header-wrapper container">
//                   <div className="header-left">
//                     <h1 className="vintage-title">{title}</h1>
//                     <p
//                       className="vintage-text"
//                       dangerouslySetInnerHTML={{ __html: info }}
//                     ></p>
//                     <Link className="btn-vintage" to={btnLink}>
//                       Explore Collection
//                     </Link>
//                   </div>
//                   <div className="header-right">
//                     <img src={img} alt="" className="vintage-image" />
//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//           {/* Navigation buttons */}
//         </Swiper>
//       </div>
//     </header>
//   );
// }
