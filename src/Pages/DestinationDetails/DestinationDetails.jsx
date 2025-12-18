import CommonHeroBannerVideo from "@/components/common/HeroBanner/CommonHeroBannerVideo";
import DestinationDetailsTabs from "@/components/DestinationDetails/DestinationDetailsTabs";
import DestinationDetailsDescription from "@/components/DestinationDetails/DestinationDetailsDescription";
import DestinationDetailsSlider from "@/components/DestinationDetails/DestinationDetailsSlider";
import WhyBookSection from "../Homepage/Sections/WhyBookSection";
import DestinationPlacesToVisit from "@/components/DestinationDetails/DestinationPlacesToVisit";
import DestinationLuxurySection from "@/components/DestinationDetails/DestinationLuxurySection";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import {
  useGetAccomadationsDataQuery,
  useGetDestinationDetailsPackageQuery,
  useGetDestinationDetailsQuery,
  useMetaDetailsDataMutation,
  useGetAllMenuSubMenuDataQuery,
} from "@/Redux/features/api/apiSlice";
import toast from "react-hot-toast";
import { InfinitySpin } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import HelmetComponent from "@/components/Helmet/Helmet";

const DestinationDetails = () => {
  const { id, slug } = useParams();
  const { t } = useTranslation();

  // menu
  const {
    data: menuData,
    isLoading: isMenuLoading,
    error: menuError,
  } = useGetAllMenuSubMenuDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // ricavo l'id (identifier)
  let identifier = id || null;

  if (!identifier && slug && menuData?.data) {
    const destinationCategory = menuData.data.find(
      cat =>
        cat.redirectLink === "/destination" ||
        cat.category?.toLowerCase() === "destinazione"
    );

    const match = destinationCategory?.subCatgoryArr?.find(
      item => item.slug === slug
    );

    if (match?.id) {
      identifier = String(match.id);
    }
  }

  // meta
  const [metaDetailsData] = useMetaDetailsDataMutation();
  const [metaData, setMetaData] = useState(null);

  useEffect(() => {
    metaDetailsData("destination_details")
      .unwrap()
      .then(res => setMetaData(res?.data))
      .catch(err => console.error("Meta save error:", err));
  }, [metaDetailsData]);

  // query dati
  const { data, error, isLoading } = useGetDestinationDetailsQuery(identifier, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !identifier,
  });

  const {
    data: accomandationData,
    error: accomadationError,
    isLoading: isAccomadtion,
  } = useGetAccomadationsDataQuery(identifier, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !identifier,
  });

  const {
    data: destinationSuggestionData,
    error: destinationSuggestionError,
    isLoading: isdestinationLoading,
  } = useGetDestinationDetailsPackageQuery(identifier, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !identifier,
  });

	const title = data?.data?.name || "";

	// MEMO: costruisco l'array solo quando cambia title (o la lingua t)
	const sectionTabs = useMemo(() => {
	  if (!title) return [];
	  return t("touristGuide.sectionTabs", {
		returnObjects: true,
		title,
	  })?.map((label, index) => ({
		label,
		link: [
		  `${title}-holiday`,
		  "suggestions",
		  "places-to-visit",
		  "where-to-stay",
		][index],
	  })) || [];
	}, [t, title]);

	const [activeTab, setActiveTab] = useState(null);

	useEffect(() => {
	  if (title && sectionTabs.length) {
		setActiveTab(sectionTabs[0]);
	  }
	}, [title, sectionTabs]);


  // ⚠️ TUTTI GLI HOOK SONO SOPRA
  // 👇 Da qui in giù solo return condizionali

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

    return <div>Destinazione non trovata</div>;
  }

  // loading dati principali
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

  // errori
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

  // se per qualche motivo titolo/tab non sono ancora pronti
  if (!title || !activeTab) return null;

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;
  const DescreptionData = data?.data?.destination_details;

  return (
    <HelmetComponent
      title={metaData?.title}
      description={metaData?.description}
      className="relative "
    >
      <CommonHeroBannerVideo
        heroBg={`${imgBaseurl}/${data?.data?.destination_details?.video}`}
        title={title.toLowerCase()}
        capitalize={true}
      />

      <DestinationDetailsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sectionTabs={sectionTabs}
      />

      <section className="container mx-auto my-10 xl:my-20">
        <DestinationDetailsDescription
          data={DescreptionData}
          id={`${title}-holiday`}
        />

        <DestinationDetailsSlider
          destinationSuggestions={destinationSuggestionData?.data}
          title={title}
		  destinationSlug={slug}
          isSlice={true}
        />

        <WhyBookSection />

        <DestinationPlacesToVisit placesToVisitInfo={data?.data} />

        <DestinationLuxurySection luxuryPlacesInfo={accomandationData?.data} />
      </section>
    </HelmetComponent>
  );
};

export default DestinationDetails;
