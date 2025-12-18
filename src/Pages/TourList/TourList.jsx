import CommonHeroBanner from "@/components/common/HeroBanner/CommonHeroBanner";
import TravelListCard from "@/components/common/Cards/TravelListCard";
import { useParams, useSearchParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import toast from "react-hot-toast";
import {
  useGetDestinationDetailsPackageQuery,
  useGetTripPackageDetailsQuery,
  useGetAllMenuSubMenuDataQuery,
} from "@/Redux/features/api/apiSlice";
import { useTranslation } from "react-i18next";

const TourList = () => {
  const { title } = useParams(); // es: "Canada West", "Alaska"
  const [searchParams] = useSearchParams();
  const isDestination = searchParams.get("isdestination") === "true";
  const { t } = useTranslation();

  const decodedTitle = decodeURIComponent(title || "");

  // 1️⃣ Prendo il MENU per risalire all'id dalla label
  const {
    data: menuData,
    isLoading: isMenuLoading,
    error: menuError,
  } = useGetAllMenuSubMenuDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // 2️⃣ Ricavo l'ID a partire da title e dal tipo (destinazione / travel style)
  let identifier = null;

  if (menuData?.data && decodedTitle) {
    if (isDestination) {
      // categoria destination / destinazione
      const destinationCategory = menuData.data.find(
        cat =>
          cat.redirectLink === "/destination" ||
          cat.category?.toLowerCase() === "destination" ||
          cat.category?.toLowerCase() === "destinazione"
      );

      const match = destinationCategory?.subCatgoryArr?.find(
        item => item.name === decodedTitle
      );

      if (match?.id) identifier = String(match.id);
    } else {
      // categoria travel style / stile di viaggio
      const travelStyleCategory = menuData.data.find(
        cat =>
          cat.redirectLink === "/travel-style" ||
          cat.category?.toLowerCase() === "travel style" ||
          cat.category?.toLowerCase() === "stile di viaggio"
      );

      const match = travelStyleCategory?.subCatgoryArr?.find(
        item => item.name === decodedTitle
      );

      if (match?.id) identifier = String(match.id);
    }
  }

  // 3️⃣ Query dati, SOLO quando abbiamo l'id
  const {
    data,
    error,
    isLoading: isTripListLoading,
  } = useGetTripPackageDetailsQuery(identifier, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !identifier || isDestination, // questa la usiamo SOLO per travel style
  });

  const {
    data: destinationSuggestionData,
    error: destinationSuggestionError,
    isLoading: isDestinationListLoading,
  } = useGetDestinationDetailsPackageQuery(identifier, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !identifier || !isDestination, // questa SOLO per destinazioni
  });

  // 4️⃣ LOADING: mentre risolviamo id o carichiamo dati
  if (
    isMenuLoading ||
    isTripListLoading ||
    isDestinationListLoading
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

  // 5️⃣ Se non c'è identifier dopo aver caricato il menu → non trovata
  if (!identifier) {
    return (
      <section className="my-10 xl:my-20 container mx-auto">
        <p className="text-center text-gray-500">{t("noTourFound")}</p>
      </section>
    );
  }

  // 6️⃣ Error handling
  if (error) {
    const errorMessage =
      error.data?.message || error.error || error.status || error.message;
    if (errorMessage) toast.error(errorMessage);
  }

  if (destinationSuggestionError) {
    const errorMessage =
      destinationSuggestionError.data?.message ||
      destinationSuggestionError.error ||
      destinationSuggestionError.status ||
      destinationSuggestionError.message;
    if (errorMessage) toast.error(errorMessage);
  }

  if (menuError) {
    const errorMessage =
      menuError.data?.message ||
      menuError.error ||
      menuError.status ||
      menuError.message;
    if (errorMessage) toast.error(errorMessage);
  }

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  const tourData = isDestination
    ? destinationSuggestionData?.data
    : data?.data;

  if (!tourData || tourData.length === 0) {
    return (
      <section className="my-10 xl:my-20 container mx-auto">
        <p className="text-center text-gray-500">{t("noTourFound")}</p>
      </section>
    );
  }

  const bannerImage = isDestination
    ? `${imgBaseurl}/${tourData[0]?.trip_package_image}`
    : `${imgBaseurl}/${tourData[0]?.travel_style?.image}`;

  const italicText = isDestination
    ? tourData[0]?.trip_package_title
    : tourData[0]?.travel_style?.name;

  const headingName = isDestination
    ? tourData[0]?.trip_package_title
    : tourData[0]?.travel_style?.name;

  return (
    <div>
      <CommonHeroBanner
        title={t("travelTo")}
        bg={bannerImage}
        italic={italicText}
      />

      {/* Tour Lists */}
      <section className="my-10 xl:my-20 container mx-auto">
        {/* Title */}
        <div>
          <h2 className="text-center text-3xl xl:text-4xl font-editorsNoteNormal text-primary">
            {t("allToursFor")}
            <span> {headingName}</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-4 xl:gap-6 mt-10">
          {tourData?.length > 0 ? (
            tourData.map(item => <TravelListCard key={item?.id} item={item} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">
              {t("noTourFound")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default TourList;
