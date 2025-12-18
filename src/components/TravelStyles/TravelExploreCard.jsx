import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAllMenuSubMenuDataQuery } from "@/Redux/features/api/apiSlice";

const TravelExploreCard = ({ item, travelMode, link }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  // Carico il menu per recuperare gli slug delle destinazioni
  const { data: menuData } = useGetAllMenuSubMenuDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const imageSrc = `${imgBaseurl}/${item?.image || item?.travel_style?.image}`;
  const title = item?.name || item?.travel_style?.name;
  const description = item?.description || item?.travel_style?.description;

  // slug del tour (trip package)
  const tourSlug =
    item?.slug ||
    item?.trip_package_slug ||
    null;

  // id destinazione (da tour)
  const destinationId =
    item?.destination_id ||
    item?.destination?.id ||
    null;

  // slug destinazione (se già presente nel JSON)
  let destinationSlug = item?.destination?.slug || null;

  // se non ho destinationSlug ma ho destinationId, lo ricavo dal menu
  if (!destinationSlug && destinationId && menuData?.data) {
    const destinationCategory = menuData.data.find(
      cat =>
        cat.redirectLink === "/destination" ||
        cat.category?.toLowerCase() === "destinazione"
    );

    const match = destinationCategory?.subCatgoryArr?.find(
      dest => dest.id === destinationId
    );

    if (match?.slug) {
      destinationSlug = match.slug;
    }
  }

  const handleNavigation = () => {
    // 🔹 1) Travel styles (pagina /travel-style) → /<slug-style> (SlugResolver)
    if (travelMode === "styles") {
      const styleSlug = item?.slug || item?.travel_style?.slug;
      if (!styleSlug) {
        console.warn("TravelExploreCard: manca slug per travel style", item);
        return;
      }
      navigate(`/${styleSlug}`);
      return;
    }

    // 🔹 2) Lista viaggi (trip packages) → /<destinationSlug>/<tripSlug>
    if (travelMode === "travel_details" || travelMode === "honey_moon") {
      if (destinationSlug && tourSlug) {
        // ✅ nuovo URL SEO
        navigate(`/${destinationSlug}/${tourSlug}`);
      } else {
        console.warn(
          "TravelExploreCard: mancano destinationSlug o tourSlug, fallback su id",
          { destinationSlug, tourSlug, item }
        );
        // 🔙 fallback di sicurezza finché non hai tutti i dati sul backend
        navigate(`/tour-list-details/${item?.id}`);
      }
      return;
    }

    // 🔹 3) Default: attività → /activity-details/:id/:slug
    const activitySlug = item?.slug;
    if (activitySlug) {
      if (link) {
			// se passo link="/", risultato: "/attivita-acquatiche"
			navigate(`${link}${activitySlug}`);
		  } else {
			// fallback vecchio comportamento
			navigate(`/activity-details/${item.id}/${activitySlug}`);
		  }
    } else {
      navigate(`/activity-details/${item.id}`);
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
