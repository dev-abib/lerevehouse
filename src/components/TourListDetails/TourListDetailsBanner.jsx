import parse from "html-react-parser";
import { useTranslation } from "react-i18next";

const TourListDetailsBanner = ({ herSectionData }) => {
  const { t } = useTranslation();

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  console.log(herSectionData);

  return (
    <section className="relative h-auto py-14 md:py-0 md:h-[500px] lg:h-[600px] mt-20 xl:mt-24 px-4 sm:px-8 xl:px-0 flex flex-col gap-3 sm:gap-5 lg:gap-10 items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={`${imgBaseurl}/${herSectionData?.heroImage}`}
        alt={herSectionData?.image_alt_txt}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Content */}
      <span className="relative z-10 text-white uppercase bg-[#004265] px-3 sm:px-4 py-1 sm:py-[6px] rounded">
        {herSectionData?.heroSectionTittle}
      </span>
      <h1 className="relative z-10 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-center xl:text-left font-editorsNoteNormal font-light text-white">
        {herSectionData?.heroSectionSubtittle}
      </h1>
      <div className="relative z-10  tour-desc-hero text-white max-w-[900px] text-center xl:text-left">
        {parse(herSectionData?.herSectionDescreption || "")}
      </div>
      <div className="relative z-10 flex items-center flex-wrap justify-center gap-5 md:gap-10 lg:gap-14">
        <div className="text-center">
          <p className="mb-1 font-editorsNoteNormal text-white text-xl lg:text-2xl">
            {herSectionData?.suggestedHolidayLenght}
          </p>
          <p className="uppercase text-white text-sm sm:text-base">
            {t("tourBanner.suggestedLength")}
          </p>
        </div>
        <div className="text-center">
          <p className="mb-1 font-editorsNoteNormal text-white text-xl lg:text-2xl">
            {herSectionData?.bestTimeToGo}
          </p>
          <p className="uppercase text-sm text-white sm:text-base">
            {t("tourBanner.bestTime")}
          </p>
        </div>
        <div className="text-center">
          <p className="mb-1 font-editorsNoteNormal text-xl text-white lg:text-2xl">
            $ {herSectionData?.price}
          </p>
          <p className="uppercase text-sm text-white sm:text-base">
            {t("tourBanner.priceFrom")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TourListDetailsBanner;
