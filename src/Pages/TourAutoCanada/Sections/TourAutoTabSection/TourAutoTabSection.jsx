import React, { useState } from "react";
import { useTranslation } from "react-i18next";


const TourAutoTabSection = ({ data }) => {

  const [showMap, setShowMap] = useState("map");

  const handleImgShow = () => {
    if (showMap === "map") {
      setShowMap("img");
    } else if (showMap === "img") {
      setShowMap("map");
    }
  };

  const imgBaseUrl = import.meta.env.VITE_SERVER_URL;
  const { t } = useTranslation();


  return (
    <section className="xl:pb-[77px] pb-9 flex flex-col w-full relative items-center justify-center md:gap-y-5 gap-y-8">
      <div className="flex flex-col gap-y-[45px] w-full relative">
        <div className="flex flex-row relative justify-between items-center gap-3 md:gap-0">
          <span className="text-lg w-[45%] font-medium leading-[120%] font-interTight text-[#004265]">
            {t("tourAuto.resultCount", { count: 3 })}
          </span>
          <button
            onClick={handleImgShow}
            className="xl:px-8 px-2 xl:py-4 py-[10px] bg-[#1687C7] text-sm md:text-base 2xl:text-lg font-medium leading-[120%] font-interTight text-white border-[1px] border-transparent ease-in-out duration-500 hover:bg-transparent hover:border-solid hover:border-[#1687C7] hover:text-[#1687C7]"
          >
            {showMap === "map"
              ? t("tourAuto.showAsImage")
              : t("tourAuto.showAsMap")}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-y-5 w-full relative">
        {data?.map((item, index) => {          
          return (
            <div
              key={index}
              className="flex flex-col xl:flex-row justify-between  items-center 2xl:items-start 2xl:h-[456px] h-full w-full border-[1px] border-solid border-[#0000001F]"
            >
              <div className="md:p-10 p-5 xl:mt-[27px] w-[75%] realtive mt-[10px] flex flex-col 2xl:gap-y-[60px] gap-y-6">
                <div className="flex flex-col gap-y-3 relative w-full ">
                  <div className="flex flex-col gap-y-3 relative w-full ">
                    <span className="w-full h-[1px] bg-[#0000001F]"></span>
                    <h2 className="text-[#004265] font-fontSpring text-2xl md:text-[32px] font-light leading-[150%]">
                      {item?.title}
                    </h2>
                    <div className="flex flex-row w-full items-center justify-between">
                      <h4 className="text-[#004265] font-interTight text-xl font-medium leading-[120%]">
                        {item.duration}
                      </h4>
                      <span className="text-[#9C9EA1] font-interTight text-lg font-normal leading-[120%]">
                        {item?.length}
                      </span>
                    </div>
                    <span className="w-full h-[1px] bg-[#0000001F]"></span>
                  </div>
                  <span className="text-[#565656] max-w-[845px] font-interTight text-sm md:text-base font-normal leading-[150%]">
                    {item?.description}
                  </span>
                </div>
                <div className="flex flex-col gap-y-1">
                  <h5 className="text-[#004265] font-fontSpring text-2xl md:text-[32px] font-normal leading-[120%]">
                    {item.cost}
                  </h5>
                  <p className="text-[#565656] max-w-[845px] font-interTight text-base font-normal leading-[150%]">
                    {item?.condition}
                  </p>
                </div>
              </div>
              <div className="flex">
                {showMap === "map" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item?.map_url,
                    }}
                  ></div>
                ) : (
                  <img
                    src={`${imgBaseUrl}/${item?.image}`}
                    alt={item?.image_alt_txt}
                    className="2xl:w-[655px] 2xl:h-[456px] object-cover"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TourAutoTabSection;
