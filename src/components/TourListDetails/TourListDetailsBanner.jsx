import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import parse from "html-react-parser";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";
import HeroSlideImg from "./HeroSlideImg";

const TourListDetailsBanner = ({ herSectionData }) => {
  const { t } = useTranslation();
  console.log(herSectionData?.herSectionDescreption);

  return (
    <section className="flex flex-col gap-y-20 ">
      <div className="-mt-[56px] 2xl:mt-0 4xl:-mt-[56px] relative">
        {/* Custom Pagination Container */}
        <div className="custom-swiper-pagination absolute top-4 left-1/2 -translate-x-1/2 z-10" />
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {herSectionData?.img_gallery?.map((item, idx) => {
            return (
              <SwiperSlide key={idx}>
                <HeroSlideImg imgUrl={item?.image} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className="relative z-10 max-w-full px-4 sm:px-8 xl:px-0 flex flex-col gap-6 sm:gap-8  items-center justify-center overflow-hidden bg-white pb-14">
        {/* Title Section */}
        <span className="relative z-10 text-white uppercase bg-[#004265] px-4 py-2 sm:px-6 sm:py-3 rounded text-sm sm:text-base md:text-lg">
          {herSectionData?.heroSectionTittle}
        </span>

        <h1 className="relative z-10 text-3xl sm:text-4xl md:text-5xl xl:text-6xl text-center xl:text-left font-serif font-light text-black mt-4 sm:mt-6">
          {herSectionData?.heroSectionSubtittle}
        </h1>

        <div
          dangerouslySetInnerHTML={{
            __html: herSectionData?.herSectionDescreption,
          }}
          className="text-xl  text-gray-600 mt-4 sm:mt-6 max-w-[1000px] text-center leading-[150%] "
        ></div>

        {/* Information Section (Holiday Length, Best Time, Price) */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-y-10 max-w-[300px] md:max-w-[800px] w-full  mt-6 sm:mt-8 ">
          {/* Suggested Holiday Length */}
          <div className="text-center  flex-1">
            <p className="mb-1 font-serif text-gray-800 text-xl lg:text-2xl font-semibold">
              {herSectionData?.suggestedHolidayLenght}
            </p>
            <p className="uppercase whitespace-nowrap text-gray-600 text-sm sm:text-base">
              {t("tourBanner.suggestedLength")}
            </p>
          </div>

          {/* Best Time to Go */}
          <div className="text-center  flex-1">
            <p className="mb-1 font-serif whitespace-nowrap text-gray-800 text-xl lg:text-2xl font-semibold">
              {herSectionData?.bestTimeToGo}
            </p>
            <p className="uppercase text-sm text-gray-600 sm:text-base">
              {t("tourBanner.bestTime")}
            </p>
          </div>

          {/* Price */}
          <div className="text-center  flex-1">
            <p className="mb-1 font-serif text-xl text-gray-800 lg:text-2xl font-semibold">
              $ {herSectionData?.price}
            </p>
            <p className="uppercase text-sm text-gray-600 sm:text-base">
              {t("tourBanner.priceFrom")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourListDetailsBanner;
