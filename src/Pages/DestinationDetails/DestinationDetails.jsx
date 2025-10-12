import CommonHeroBannerVideo from "@/components/common/HeroBanner/CommonHeroBannerVideo";
import DestinationDetailsTabs from "@/components/DestinationDetails/DestinationDetailsTabs";
import DestinationDetailsDescription from "@/components/DestinationDetails/DestinationDetailsDescription";
import DestinationDetailsSlider from "@/components/DestinationDetails/DestinationDetailsSlider";
import WhyBookSection from "../Homepage/Sections/WhyBookSection";
import DestinationPlacesToVisit from "@/components/DestinationDetails/DestinationPlacesToVisit";
import DestinationLuxurySection from "@/components/DestinationDetails/DestinationLuxurySection";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import {
  useGetAccomadationsDataQuery,
  useGetDestinationDetailsPackageQuery,
  useGetDestinationDetailsQuery,
  useMetaDetailsDataMutation,
} from "@/Redux/features/api/apiSlice";
import toast from "react-hot-toast";
import { InfinitySpin } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import HelmetComponent from "@/components/Helmet/Helmet";

const DestinationDetails = () => {
  const { id } = useParams();
    const { t } = useTranslation();

  const [metaDetailsData, { isLoading:isMetaloading, isSuccess, isError }] =
    useMetaDetailsDataMutation();

  const [metaData, setMetaData] = useState(null);

  useEffect(() => {
    metaDetailsData("destination_details")
      .unwrap()
      .then(res => setMetaData(res?.data))
      .catch(err => console.error("Meta save error:", err));
  }, [metaDetailsData]);



  const { data, error, isLoading } = useGetDestinationDetailsQuery(id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: accomandationData,
    error: accomadationError,
    isLoading: isAccomadtion,
  } = useGetAccomadationsDataQuery(id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: destinationSuggestionData,
    error: destinationSuggestionError,
    isLoading: isdestinationLoading,
  } = useGetDestinationDetailsPackageQuery(id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const handleDestinationMap = address => {
    const location = `https://www.google.com/maps?q=${address}`;
    window.open(location, "_blank");
  };

  const title = data?.data?.name || "";
  const sectionTabs = t("touristGuide.sectionTabs", {
    returnObjects: true,
    title,
  })?.map((label, index) => ({
    label,
    link: [
      `${title}-holiday`,
      "suggestions",
      "places-to-visit",
      "where-to-stay"
    ][index]
  }));

  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (title) {
      setActiveTab(sectionTabs[0]);
    }
  }, [title]);

  // Loading state
  if (isLoading || isdestinationLoading) {
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

  // Error state
  if (error) {
    const errorMessage =
      error.data?.message || error.error || error.status || error.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

  if (destinationSuggestionError) {
    const errorMessage =
      destinationSuggestionError.data?.message ||
      destinationSuggestionError.error ||
      destinationSuggestionError.status ||
      destinationSuggestionError.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

  // Wait for title and tab setup
  if (!title || !activeTab) return null;

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;
  const DescreptionData = data?.data?.destination_details;

  console.log(data?.data);
  

  return (
    <HelmetComponent
      title={metaData?.title}
      description={metaData?.description}
      className="relative "
    >
      {/* hero */}
      <CommonHeroBannerVideo
        heroBg={`${imgBaseurl}/${data?.data?.destination_details?.video}`}
        title={title.toLowerCase()}
        capitalize={true}
      />

      {/*  Section Tabs */}
      <DestinationDetailsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sectionTabs={sectionTabs}
      />

      <section className="container  mx-auto my-10 xl:my-20    ">
        {/* description container*/}
        <DestinationDetailsDescription
          data={DescreptionData}
          id={`${title}-holiday`}
        />

        {/* Suggestions container */}
        <DestinationDetailsSlider
          destinationSuggestions={destinationSuggestionData?.data}
          title={title}
          isSlice={true}
        />

        {/* why book this tour section */}
        <WhyBookSection />

        {/* places to visit section */}
        <DestinationPlacesToVisit placesToVisitInfo={data?.data} />

        {/* Luxury Section */}
        <DestinationLuxurySection luxuryPlacesInfo={accomandationData?.data} />
      </section>
    </HelmetComponent>
  );
};

export default DestinationDetails;
