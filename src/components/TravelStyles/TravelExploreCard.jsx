import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";



const TravelExploreCard = ({ item, travelMode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const imgBaseurl = import.meta.env.VITE_SERVER_URL;
   const location = useLocation(); 
   const pathname = location.pathname;
  console.log(travelMode, "this is the travel mode");

  const imageSrc = `${imgBaseurl}/${item?.image || item?.travel_style?.image}`;
  const title = item?.name || item?.travel_style?.name;
  const description = item?.description || item?.travel_style?.description;

  const handleNavigation = () => {
    if (title && title.toLowerCase() === "honeymoon") {
      if (pathname === "/viaggi-noze") { 
        navigate(`/tour-list-details/${item?.id}`);
      } else {
        navigate("/viaggi-noze");
      } 
    } else if (
      title &&
      title.toLowerCase() === "viaggi noze" &&
      travelMode !== "honey_moon"
    ) {
      navigate("/viaggi-noze");
    } else {
      // Safe navigation based on `travelMode`
      if (travelMode === "styles") {
        navigate(`/travel-styles-details/${item?.id}`);
      } else if (
        travelMode === "travel_details" ||
        travelMode === "honey_moon"
      ) {
        navigate(`/tour-list-details/${item?.id}`);
      } else {
        navigate(`/activity-details/${item.id}`);
      }
    }
  };

  return (
    <div className="TravelExploreCard relative rounded-[15px] overflow-hidden flex flex-col items-center justify-center z-[1] h-[240px] lg:h-[400px] 2xl:h-[520px] group">
      <img
        src={imageSrc}
        alt={item?.image_alt_txt || item?.travel_style?.image_alt_txt}
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
      />
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full front duration-500 ease-in-out">
        <h3 className="text-2xl md:text-[30px] 2xl:text-[40px] font-semibold font-editorsNoteNormal text-white mx-auto text-center leading-[48px]">
          {title}
        </h3>
      </div>
      <div className="p-5 2xl:p-[64px] back text-center absolute w-full h-full flex flex-col items-center justify-center duration-500 ease-in-out bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <h3 className="text-[20px] sm:text-lg md:text-lg 2xl:text-[40px] font-semibold font-editorsNoteNormal text-white text-center">
          {title}
        </h3>
        <p className="text-xs xl:text-base text-white leading-normal mt-0 sm:mt-2 font-inter">
          {description}
        </p>
        <button
          className="2xl:mt-9 mt-2 md:mt-3 inline-block px-7 md:py-2 xl:py-3 py-[6px] sm:px-[62px] sm:py-2 text-white text-sm font-medium font-inter bg-secondary rounded-[5px]"
          onClick={handleNavigation}
        >
          {travelMode === "travel_details"
            ? t("travelExploreCard.discoverTrip")
            : t("travelExploreCard.view")}
        </button>
      </div>
    </div>
  );
};

export default TravelExploreCard;
