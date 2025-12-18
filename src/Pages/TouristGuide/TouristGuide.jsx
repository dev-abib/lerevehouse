import canadaMap from "../../assets/images/guida-turistica/canadaMap.png";
import { ArrowSignSvg } from "@/components/common/SvgContainer/SvgContainer";
import TravelDetailsSlider from "@/components/GuidaTuristica/GuidaTuristica";

import tent from "../../assets/images/guida-turistica/tent.jpg";
import dolphin from "../../assets/images/guida-turistica/dolphin.jpg";
import helicopter from "../../assets/images/guida-turistica/helicopter.jpg";
import lakeMountain from "../../assets/images/guida-turistica/lakeMountain.jpg";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import { useEffect, useState } from "react";

import {
  useGetTouristGuideHeroSectionDataQuery,
  useGetTouristGuideSpecailistsSectionDataQuery,
  useGetCanadaTravelDataQuery,
  useGetTouristGuidePlacesQuery,
  useMetaDetailsDataMutation,
} from "@/Redux/features/api/apiSlice";
import toast from "react-hot-toast";
import HelmetComponent from "@/components/Helmet/Helmet";
import { useTranslation } from "react-i18next";

const TouristGuide = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetTouristGuideHeroSectionDataQuery(
    id,
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const { t } = useTranslation();

  const [metaDetailsData, { isLoading: isMetaLoading, isSuccess, isError }] =
    useMetaDetailsDataMutation();

  const [metaData, setMetaData] = useState(null);

  useEffect(() => {
    metaDetailsData(" guide_tourist_details")
      .unwrap()
      .then(res => setMetaData(res?.data))
      .catch(err => console.error("Meta save error:", err));
  }, [metaDetailsData]);

  const {
    data: tourPlacesData,
    error: tourPalcesError,
    isLoading: isTouristPlaceLoading,
  } = useGetTouristGuidePlacesQuery(id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: canadaData,
    error: canadaError,
    isLoading: isCanadaLoading,
  } = useGetCanadaTravelDataQuery(id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: getSpecaillistData,
    error: getspcialistsError,
    isLoading: isSpecaillistLoading,
  } = useGetTouristGuideSpecailistsSectionDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const errorMessage =
        error.data?.message || error.error || error.status || error.message;
      if (errorMessage) toast.error(errorMessage);
    } else if (getspcialistsError) {
      const errorMessage =
        getspcialistsError.data?.message ||
        getspcialistsError.error ||
        getspcialistsError.status ||
        getspcialistsError.message;
      if (errorMessage) toast.error(errorMessage);
    } else if (canadaError) {
      const errorMessage =
        canadaError.data?.message ||
        canadaError.error ||
        canadaError.status ||
        canadaError.message;
      if (errorMessage) toast.error(errorMessage);
    } else if (tourPalcesError) {
      const errorMessage =
        tourPalcesError.data?.message ||
        tourPalcesError.error ||
        tourPalcesError.status ||
        tourPalcesError.message;
      if (errorMessage) toast.error(errorMessage);
    }
  }, [error, getspcialistsError]);



  if (
    isLoading ||
    isSpecaillistLoading ||
    isCanadaLoading ||
    isTouristPlaceLoading
  ) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50 bg-white">
        <InfinitySpin
          visible={true}
          width="200"
          color="#004265"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  console.log(data?.data?.tourist_guide_maps, " rafi bokcod");

  return (
    <HelmetComponent
      title={metaData?.title}
      description={metaData?.description}
    >
      <section className="md:mt-[128px]  mb-10 mt-28 2xl:py-[96px] container flex flex-col 2xl:gap-y-[153px] gap-y-10">
        <div className="flex flex-col 2xl:gap-y-[96px] gap-y-9">
          <div className="flex flex-col gap-y-6 2xl:gap-y-10 items-center justify-center">
            <div
              dangerouslySetInnerHTML={{ __html: data?.data?.title }}
              className="text-[#1687C7] text-3xl md:text-[50px] space-y-3  2xl:text-[64px] font-interTight font-bold leading-[160%]  "
            ></div>
            <div className="flex items-center flex-col 2xl:flex-row 2xl:gap-x-[155px] gap-12">
              <img
                src={`${imgBaseurl}/${data?.data?.map}`}
                className="hidden xl:block md:w-[750px] md:h-[471px]"
                alt={data?.data?.image_alt_txt}
              />
              <div className="flex flex-col gap-y-4 md:mt-0">
                <div
                  dangerouslySetInnerHTML={{ __html: data?.data?.description }}
                  className="text-text-gray text-sm md:text-base leading-[180%] font-normal tracking-[1px] mt-3 md:mt-0"
                ></div>
              </div>
            </div>
            <div className="flex flex-wrap w-full justify-center gap-3">
              {data?.data?.tourist_guide_maps.map((item, idx) => (
                <button
                  onClick={() => {
                    window.open(item?.map_url, "_blank");
                  }}
                  className="bg-secondary px-6 py-2 sm:px-7 sm:py-3 font-interTight text-white font-semibold transition-all duration-300 hover:bg-white border border-secondary hover:text-secondary text-sm sm:text-base"
                  key={idx}
                >
                  {item?.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
            {tourPlacesData?.data?.map((item, index) => {
				   const url = `/tour-guides/${item.id}/${item.slug}`; // <- URL corretta
              return (
                <div
                  key={index}
                  onClick={() => {
                    //navigate(`/tour-guides?id=${item?.id}`);
						  navigate(`/tour-guides/${item.id}/${item.slug}`);
                  }}
                  className="2xl:h-[404px] h-[220px] 2xl:w-[312px] w-full relative cursor-pointer overflow-hidden group"
                >
                  <img
                    src={`${imgBaseurl}/${item.image}`}
                    alt={item?.image_alt_txt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300" />

                  {/* Title */}
                  <div className="absolute inset-0 flex items-center justify-center px-2 text-center">
                    <NavLink
                      to={url}
                      className="text-white md:max-w-[238px] font-interTight md:text-2xl text-lg font-bold leading-[160%] z-10"
                    >
                      {item?.title}
                    </NavLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col 2xl:gap-y-[96px] items-center">
          <div className="flex flex-col gap-y-6 items-center ">
            <div className="flex flex-col gap-y-20 items-center ">
              <div
                dangerouslySetInnerHTML={{
                  __html: getSpecaillistData?.data[0]?.title,
                }}
                className="text-[#000000] font-fontSpring text-[30px] xl:text-[40px] 2xl:text-[56px] font-light 2xl:leading-[160%]"
              ></div>
              <div
                dangerouslySetInnerHTML={{
                  __html: getSpecaillistData?.data[0]?.short_description,
                }}
                className="md:max-w-[1001px] w-full leading-[160%] text-base mt-4 2xl:mt-0 md:text-xl font-interTight text-[#000] text-center"
              ></div>
            </div>
            <div className="flex flex-col md:gap-y-[48px] gap-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div
                  dangerouslySetInnerHTML={{
                    __html: getSpecaillistData?.data[0]?.description,
                  }}
                  className="text-[#787878] flex flex-col gap-y-2 font-interTight text-base 2xl:text-xl font-normal 2xl:leading-[180%] leading-[160%] tracking-[1px]"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HelmetComponent>
  );
};

export default TouristGuide;
