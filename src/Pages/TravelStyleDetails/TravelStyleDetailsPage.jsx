import CommonHeroBanner from "@/components/common/HeroBanner/CommonHeroBanner";
import ExploreJourney from "@/components/TravelStylesDetails/ExploreJourney";
import bg from "../../assets/images/travelstyle-detailsbg.png";
import FeaturedTravels from "@/components/TravelStylesDetails/FeaturedTravels";
import { useParams } from "react-router-dom";
import {
  useGetTravelStylesDetailsDataQuery,
  useGetTripPackageDetailsQuery,
  useMetaDetailsDataMutation,
  useGetAllMenuSubMenuDataQuery,
} from "@/Redux/features/api/apiSlice";
import { InfinitySpin } from "react-loader-spinner";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import HelmetComponent from "@/components/Helmet/Helmet";
import { useTranslation } from "react-i18next";

const TravelStyleDetailsPage = () => {
  const { id, slug } = useParams();
  const { t } = useTranslation();

  // META
  const [metaDetailsData] = useMetaDetailsDataMutation();
  const [metaData, setMetaData] = useState(null);

  useEffect(() => {
    metaDetailsData("travel_style_details")
      .unwrap()
      .then(res => setMetaData(res?.data))
      .catch(err => console.error("Meta save error:", err));
  }, [metaDetailsData]);

  // MENU (per ricavare l'id dallo slug se serve)
  const {
    data: menuData,
    isLoading: isMenuLoading,
    error: menuError,
  } = useGetAllMenuSubMenuDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // ricavo l'id (identifier) per lo stile di viaggio
  let identifier = id || null;

  if (!identifier && slug && menuData?.data) {
    const travelStyleCategory = menuData.data.find(
      cat =>
        cat.redirectLink === "/travel-style" ||
        cat.category?.toLowerCase() === "stili di viaggio" ||
        cat.category?.toLowerCase() === "stile di viaggio" ||
        cat.category?.toLowerCase() === "travel style"
    );

    const match =
      travelStyleCategory?.subCatgoryArr?.find(item => item.slug === slug) ||
      null;

    if (match?.id) {
      identifier = String(match.id);
    }
  }

  // se ancora non abbiamo trovato l'identifier
  if (!identifier) {
    if (isMenuLoading) {
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

    return <div>Travel style non trovato</div>;
  }

  // QUERY DATI (usano identifier, non più direttamente id)
  const {
    data,
    error,
    isLoading: isPackagesLoading,
  } = useGetTripPackageDetailsQuery(identifier, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !identifier,
  });

  const {
    data: singleData,
    error: singleError,
    isLoading: isSingleLoading,
  } = useGetTravelStylesDetailsDataQuery(identifier, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !identifier,
  });

  // LOADING complessivo
  if (isPackagesLoading || isSingleLoading) {
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

  // ERRORI
  if (error) {
    const errorMessage =
      error?.data?.message || error?.error || error?.status || error?.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

  if (singleError) {
    const errorMessage =
      singleError?.data?.message ||
      singleError?.error ||
      singleError?.status ||
      singleError?.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;
  const travelStyle = singleData?.data?.[0];

  if (!travelStyle) {
    return <div>Travel style non trovato</div>;
  }

  console.log(travelStyle);

  return (
    <HelmetComponent
      title={metaData?.title}
      description={metaData?.description}
    >
      <CommonHeroBanner
        bg={`${imgBaseurl}/${travelStyle?.image}`}
        title={travelStyle?.title}
        altTxt={travelStyle?.image_alt_txt}
        subTittle={travelStyle?.sub_title}
      />
      <ExploreJourney data={travelStyle} btnTxt={t("viewAllTravelStyle")} />
      <FeaturedTravels data={data?.data} />
    </HelmetComponent>
  );
};

export default TravelStyleDetailsPage;
