import CommonHeroBanner from "@/components/common/HeroBanner/CommonHeroBanner";
import SingleDestinationCard from "@/components/common/Cards/SingleDestinationCard";
import {
  useGetDestinationOvreviewDetailsQuery,
  useGetDestinationTitleQuery,
  useGetTravelMainHeroSectionDataQuery,
  useMetaDetailsDataMutation,
} from "@/Redux/features/api/apiSlice";
import { InfinitySpin } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import HelmetComponent from "@/components/Helmet/Helmet";

const TravelGuide = () => {
  const { t } = useTranslation();
  // Fetch destinations data
  const {
    data: destinationsData,
    isLoading,
    error,
  } = useGetDestinationOvreviewDetailsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: destinationTitle,
    isLoading: dsetinationTitleLoadin,
    error: destinationError,
  } = useGetDestinationTitleQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [
    metaDetailsData,
    { isLoading: isMetaDataLoading, isSuccess, isError },
  ] = useMetaDetailsDataMutation();

  const [metaData, setMetaData] = useState(null);

  useEffect(() => {
    metaDetailsData("guide_tourist")
      .unwrap()
      .then(res => setMetaData(res?.data))
      .catch(err => console.error("Meta save error:", err));
  }, [metaDetailsData]);

  // Fetch hero section data
  const {
    data: heroSectionData,
    error: heroSectionError,
    isLoading: isHeroSectionLoading,
  } = useGetTravelMainHeroSectionDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  // Process hero section title
  const slicedTxt = heroSectionData?.data[0]?.title?.split(" ") || [];
  const normalTxt = slicedTxt.slice(0, 2).join(" ");
  const styledTxt = slicedTxt.slice(2).join(" ");

  const groupDestinations = () => {
    if (!destinationsData?.data) return [];

    const destinations = [...destinationsData.data];
    const groups = [];

    // First row: 2 items
    if (destinations.length > 0) {
      groups.push(destinations.splice(0, 2));
    }

    if (destinations.length > 0) {
      groups.push(destinations.splice(0, 2));
    }

    if (destinations.length > 0) {
      groups.push(destinations);
    }

    return groups;
  };

  const getCardHeight = (rowIndex, cardIndex) => {
    if (rowIndex === 0) return "full";

    if (rowIndex === 2) return "full";

    return undefined;
  };

  if (isLoading || isHeroSectionLoading) {
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
  if (error || heroSectionError) return <div>Error loading data</div>;

  return (
    <HelmetComponent
      title={metaData?.title}
      description={metaData?.description}
    >
      {/* Hero section */}
      <CommonHeroBanner
        bg={`${imgBaseurl}/${heroSectionData?.data?.background_image}`}
        title={heroSectionData?.data?.title}
        subTittle={heroSectionData?.data?.sub_title}
        altTxt={heroSectionData.data?.image_alt_txt}
      />

      {/* Destination section */}
      <section className="my-8 md:my-10 3xl:my-20 container mx-auto">
        <div>
          <h2 className="text-3xl lg:text-4xl 3xl:text-5xl font-editorsNoteNormal text-primary">
            {destinationTitle?.data[0]?.title}
          </h2>

          <div className="mt-7 xs:mt-8 xl:mt-10 3xl:mt-16 flex flex-col gap-4 3xl:gap-7">
            {groupDestinations().map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`flex items-center flex-wrap ${
                  row.length >= 3 ? "lg:flex-nowrap" : "md:flex-nowrap"
                } gap-4 3xl:gap-7`}
              >
                {row.map((destination, cardIndex) => {
                  console.log(destination);
                  return (
                    <SingleDestinationCard
                      key={destination?.id}
                      bg={`${imgBaseurl}/${destination?.image}`}
                      title={destination?.name.trim()}
                      height={getCardHeight(rowIndex, cardIndex)}
                      id={destination?.id}
                      isTravelGuide={true}
						 slug={destination?.slug}      
                      subTittle={destination?.subtitle}
                      altTxt={destination?.image_alt_txt}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </HelmetComponent>
  );
};

export default TravelGuide;
