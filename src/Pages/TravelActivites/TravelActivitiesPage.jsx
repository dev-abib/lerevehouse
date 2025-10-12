import TripAttraction from "@/components/TravelActivities/TripAttraction";
import TravelActivitiesImg from "../../assets/images/travel-activities-bg.png";
import CommonHeroBannerV2 from "@/components/common/HeroBanner/CommonHeroBannerV2";
import BrowseThings from "@/components/TravelActivities/BrowseThings";
import ActivitiesCanDo from "@/components/TravelActivities/ActivitiesCanDo";
import TravelCta from "@/components/TravelStyles/TravelCta";
import {
  useGetAcitivityHeroSectionQuery,
  useGetActivityDetailsQuery,
  useGetAcitivitySloganDataQuery,
  useMetaDetailsDataMutation,
  useGetActivityTitleQuery,
} from "@/Redux/features/api/apiSlice";
import { InfinitySpin } from "react-loader-spinner";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import HelmetComponent from "@/components/Helmet/Helmet";
import { useTranslation } from "react-i18next";

const TravelActivitiesPage = () => {
  const [
    metaDetailsData,
    { isLoading: isMetaDataLoading, isSuccess, isError },
  ] = useMetaDetailsDataMutation();

  const [metaData, setMetaData] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    metaDetailsData("activity")
      .unwrap()
      .then(res => setMetaData(res?.data))
      .catch(err => console.error("Meta save error:", err));
  }, [metaDetailsData]);

  const { data, error, isLoading } = useGetAcitivityHeroSectionQuery(
    undefined,
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const {
    data: activityTitle,
    error: activityTitleError,
    isLoading: isAcitivityLoading,
  } = useGetActivityTitleQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  console.log(activityTitle);

  const {
    data: activityDetails,
    error: activityDetailsError,
    isLoading: activityDetailsLoading,
  } = useGetActivityDetailsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: activitySloganData,
    error: activitySloganError,
    isLoading: isAcitvitySloganLoading,
  } = useGetAcitivitySloganDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  if (isLoading || activityDetailsLoading || isAcitvitySloganLoading) {
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

  const location = useLocation();

  if (activitySloganError) {
    const errorMessage =
      activitySloganError.data?.message ||
      activitySloganError.error ||
      activitySloganError.status ||
      activitySloganError.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

  if (error) {
    const errorMessage =
      error.data?.message || error.error || error.status || error.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

  if (activityDetailsError) {
    const errorMessage =
      activityDetailsError.data?.message ||
      activityDetailsError.error ||
      activityDetailsError.status ||
      activityDetailsError.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;


  return (
    <HelmetComponent
      title={metaData?.title}
      description={metaData?.description}
    >
      <CommonHeroBannerV2
        isAcitivity={true}
        item={data?.data[0]}
        bgImg={`${imgBaseurl}/${data?.data[0]?.background_image}`}
        altTxt={data?.data?.image_alt_txt}
      />
      <TripAttraction data={activityDetails?.data[0]} />
      <BrowseThings title={activityTitle?.data[1].title} />
      {/* <ActivitiesCanDo /> */}
      <div className="2xl:pt-20">
        <TravelCta
          title={activitySloganData?.data?.title}
          description={activitySloganData?.data?.short_description}
          btnText={t("btnText")}
          imgUrl={`${imgBaseurl}/${activitySloganData?.data?.background_image}`}
          altTxt={activitySloganData?.data?.image_alt_txt}
        />
      </div>
    </HelmetComponent>
  );
};

export default TravelActivitiesPage;
