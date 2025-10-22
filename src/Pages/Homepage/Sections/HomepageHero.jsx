import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";
import HeroSlide from "@/components/Homepage/HeroSlide";
import { useGetHomePageHeroSectionDataQuery } from "@/Redux/features/api/apiSlice";

const HomepageHero = () => {
  const { data, error, isLoading } = useGetHomePageHeroSectionDataQuery(
    undefined,
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  
  return (
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
        {data?.data?.map((item, idx) => (
          <SwiperSlide key={idx}>
            <HeroSlide
              vidoeUrl={item?.file_url}
              title={item?.title}
              subTitle={item?.short_description}
              btnTxt={item?.button_text}
              isExternalBtnLink={item?.is_link_available}
              buttonLink={item?.button_link}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomepageHero;

   

