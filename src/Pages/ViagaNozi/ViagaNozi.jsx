import CommonHeroBanner from "@/components/common/HeroBanner/CommonHeroBanner";
import React, { useEffect, useState } from "react";
import ExploreJourney from "@/components/TravelStylesDetails/ExploreJourney";
import FeaturedTravels from "@/components/TravelStylesDetails/FeaturedTravels";
import HoneyMoon from "../../assets/images/honey-moon/honeymoon.png";
import {
  useGetHomePageTitleQuery,
  useGetHoneyMoonDetailsSectionQuery,
  useGetHoneyMoonHeroSectionDataQuery,
  useGetHoneyMoonTitleQuery,
  useGetTransportationHeroSectionDataQuery,
  useGetTripPackageDetailsQuery,
  useMetaDetailsDataMutation,
} from "@/Redux/features/api/apiSlice";
import { InfinitySpin } from "react-loader-spinner";
import toast from "react-hot-toast";
import HelmetComponent from "@/components/Helmet/Helmet";

const ViagaNozi = () => {
  const id = 1;

  const [
    metaDetailsData,
    { isLoading: isMetaDataLoading, isSuccess, isError },
  ] = useMetaDetailsDataMutation();

  const [metaData, setMetaData] = useState(null);

  useEffect(() => {
    metaDetailsData("honeymoon")
      .unwrap()
      .then(res => setMetaData(res?.data))
      .catch(err => console.error("Meta save error:", err));
  }, [metaDetailsData]);

  const { data, error, isLoading } = useGetTripPackageDetailsQuery(id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: honeyMoonData,
    error: honeymoonError,
    isLoading: isHoneyMoonLoading,
  } = useGetHoneyMoonTitleQuery(id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  console.log(honeyMoonData);

  const {
    data: honeyMoonDetailsData,
    error: honeyMoonDetailsError,
    isLoading: isHoneyDetailsLoading,
  } = useGetHoneyMoonDetailsSectionQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: honeyMoondata,
    error: honeyMoonError,
    isLoading: isHoneymoonLoading,
  } = useGetHoneyMoonHeroSectionDataQuery(id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  if (isLoading || isHoneymoonLoading) {
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

  if (error || honeyMoonError) {
    const errorMessage =
      error.data?.message || error.error || error.status || error.message;
    const honeyMoonErrorMsg =
      honeyMoonError.data?.message ||
      honeyMoonError.error ||
      honeyMoonError.status ||
      honeyMoonError.message;
    if (errorMessage) {
      toast.error(errorMessage);
    } else if (honeyMoonError) {
      toast.error(honeyMoonErrorMsg);
    }
  }

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  return (
    <HelmetComponent
      title={metaData?.title}
      description={metaData?.description}
    >
      <CommonHeroBanner
        bg={`${imgBaseurl}/${honeyMoondata?.data?.background_image}`}
        title={honeyMoondata?.data?.title}
        altTxt={honeyMoondata?.image_alt_txt}
      />
      <ExploreJourney
        data={honeyMoonDetailsData.data}
        isBtn={false}
        btnTxt={"All honeymoon Trips "}
      />
      <FeaturedTravels
        data={data?.data}
        isHoneyMoon={true}
        title={honeyMoonData?.data[0]?.title}
        isTravelStyleRedirect={true}
        
      />
    </HelmetComponent>
  );
};

export default ViagaNozi;
