/* eslint-disable react/prop-types */
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import TravelListCard from "../common/Cards/TravelListCard";
import {
  NextSlideSvg,
  PrevSlideSvg,
} from "../common/SvgContainer/SvgContainer";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DestinationDetailsSlider = ({ destinationSuggestions, title , isViewAll = true }) => {
  const { id } = useParams();

  const { queryId } = useParams();
  const [swiperRef, setSwiperRef] = useState(null);
  const { t } = useTranslation();

  return (
    <div id="suggestions" className="md:mt-16 mb-0 my-10 xl:yt-20">
      {/* title */}
      <div>
        <h3 className="text-center text-3xl xl:text-4xl font-editorsNoteNormal text-primary">
          {t("destinationDetailsSlider.suggested")}{" "}
          <span className="font-editorsNoteItalic">
            {t("destinationDetailsSlider.tours")}
          </span>{" "}
          {t("destinationDetailsSlider.for")} <span>{title}</span>
        </h3>
      </div>

      {/* slider */}
      <div className="md:mt-16 mt-6 relative">
        <Swiper
          breakpoints={{
            360: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 15 },
            1280: { slidesPerView: 3, spaceBetween: 24 },
          }}
          loop={true}
          spaceBetween={20}
          onSwiper={setSwiperRef}
          className="mySwiper"
        >
          {destinationSuggestions?.map((item, idx) => (
            <SwiperSlide key={idx}>
              <TravelListCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* slider navigation */}
        <button
          onClick={() => swiperRef?.slidePrev()}
          className="size-10 bg-[#E6ECF0] shadow-md rounded-full flex items-center justify-center absolute top-1/2 -left-4 lg:-left-8 z-10"
        >
          <PrevSlideSvg />
        </button>
        <button
          onClick={() => swiperRef?.slideNext()}
          className="size-10 bg-[#E6ECF0] shadow-md rounded-full flex items-center justify-center absolute top-1/2 -right-4 lg:-right-8 z-10"
        >
          <NextSlideSvg />
        </button>
      </div>

      {/* view all tour btn */}
      <div className="w-full flex items-center justify-center mt-10 mb-10 ">
        {isViewAll && (
          <Link
            to={`/tour-lists/${id || queryId}?isdestination=true`}
            className="block px-8 xl:px-12 2xl:px-24 py-3 text-sm lg:text-base bg-primary text-white font-interTight font-medium border border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
          >
            {t("destinationDetailsSlider.viewAll")} {title}{" "}
            {t("destinationDetailsSlider.tour")}
          </Link>
        )}
      </div>
    </div>
  );
};

export default DestinationDetailsSlider;
