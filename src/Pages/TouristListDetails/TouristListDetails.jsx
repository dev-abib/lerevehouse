import TourListDetailsTab from "@/components/TourListDetails/TourListDetailsTab";
import TourListDetailsDescription from "@/components/TourListDetails/TourListDetailsDescription";
import TourListDetailsReview from "@/components/TourListDetails/TourListDetailsReview";
import TourListDetailsDatesPrices from "@/components/TourListDetails/TourListDetailsDatesPrices";
import TourListDetailsSuggestions from "@/components/TourListDetails/TourListDetailsSuggestions";
import TourListDetailsVideoGallery from "@/components/TourListDetails/TourListDetailsVideoGallery";
import ItenaryIdeaDetails from "@/components/TourListDetails/ItenaryIdeaDetails";
import TourListDetailsBanner from "@/components/TourListDetails/TourListDetailsBanner";

import {
  useGetAllPackagesQuery,
  useGetAllReviewsQuery,
  useTripPackageDetailsQuery,
  useGetAllMenuSubMenuDataQuery,
  useGetDestinationDetailsPackageQuery,
} from "@/Redux/features/api/apiSlice";

import { useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const TouristListDetails = () => {
  // può arrivare:
  // - /tour-list-details/:id
  // - /:destinationSlug/:tripSlug   (vecchia SEO)
  // - /:slug1/:slug2                (via DoubleSlugResolver)
  const { id, destinationSlug, tripSlug, slug1, slug2 } = useParams();
	const idFromSlug2 =
  !id && slug2
    ? slug2.match(/-(\d+)$/)?.[1] || null
    : null;
  const { t } = useTranslation();

  // NORMALIZZAZIONE SLUG
  const effectiveDestinationSlug = destinationSlug || slug1 || null;
  const effectiveTripSlug = tripSlug || slug2 || null;

const hasId = Boolean(id || idFromSlug2);
const hasSlugPair = Boolean(effectiveDestinationSlug && effectiveTripSlug);
	
  // 1) MENU – per ricavare l'ID della destinazione (quando usiamo gli slug)
  const {
    data: menuData,
    isLoading: isMenuLoading,
    error: menuError,
  } = useGetAllMenuSubMenuDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // ricavo destinationId SOLO se non ho id ed ho gli slug
  let destinationId = null;

  if (!hasId && hasSlugPair && menuData?.data) {
    const destinationCategory = menuData.data.find(
      cat =>
        cat.redirectLink === "/destination" ||
        cat.category?.toLowerCase() === "destinazione"
    );

    const match = destinationCategory?.subCatgoryArr?.find(
      item => item.slug === effectiveDestinationSlug
    );

    if (match?.id) {
      destinationId = String(match.id);
    }
  }

  // 2) PACKAGES della destinazione (per risalire al trip da tripSlug)
  const {
    data: destinationPackagesData,
    isLoading: isPackagesLoading,
    error: destinationPackagesError,
  } = useGetDestinationDetailsPackageQuery(destinationId, {
    skip: !destinationId, // non chiamare l'API se non abbiamo ancora destinationId
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // 3) Calcolo l'ID finale del trip
  let finalTripId = null;

  if (id) {
    // caso vecchio: /tour-list-details/:id
    finalTripId = String(id);
  } else if (idFromSlug2) {
    // caso SEO: /<destinationSlug>/<tripSlug-con-id-finale>
    // es: historical-tour-mexico-baja-california-5 → 5
    finalTripId = String(idFromSlug2);
  } else if (hasSlugPair && destinationPackagesData?.data) {
    // fallback: provo comunque a risalire dal tripSlug (se mai servisse)
    const tripMatch = destinationPackagesData.data.find(trip => {
      const slugFromApi =
        trip.slug || trip.trip_slug || trip.tripSlug || "";
      return slugFromApi === effectiveTripSlug;
    });
    if (tripMatch?.id) {
      finalTripId = String(tripMatch.id);
    }
  }


  // 4) NOT FOUND (destinazione o tour inesistenti)
  const destinationNotFound =
    hasSlugPair &&
    !hasId &&
    !isMenuLoading &&
    !destinationId; // non trovata nel menu

  const tripNotFound =
    hasSlugPair &&
    !hasId &&
    !!destinationId &&
    !isPackagesLoading &&
    destinationPackagesData?.data &&
    !finalTripId; // nessun trip con quello slug

  if (destinationNotFound || tripNotFound) {
    return <div>Tour non trovato</div>;
  }

  // 5) QUERY sul trip (usiamo finalTripId)
  const {
    data,
    error,
    isLoading: isTripLoading,
  } = useTripPackageDetailsQuery(finalTripId, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !finalTripId, // non chiamare finché non sappiamo l'id
  });

  const {
    data: allPackaageData,
    error: allpackageError,
    isLoading: ispackageLoading,
  } = useGetAllPackagesQuery(finalTripId, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !finalTripId,
  });

  const {
    data: reviewData,
    error: allReviewError,
    isLoading: isReviewLoading,
  } = useGetAllReviewsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // 6) LOADING – se stiamo ancora risolvendo slug/id o caricando i dati
  const isResolvingSlug =
    hasSlugPair &&
    !hasId && // siamo in modalità slug, non id
    (isMenuLoading ||
      (destinationId && isPackagesLoading && !tripNotFound));

  if (
    isResolvingSlug ||
    isTripLoading ||
    ispackageLoading ||
    isReviewLoading
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

  // 7) Se dopo tutto questo ancora non abbiamo un id valido o dati → not found
  if (!finalTripId || !data?.data) {
    return <div>Tour non trovato</div>;
  }

  // 8) GESTIONE ERRORI
  if (error) {
    const errorMessage =
      error.data?.message || error.error || error.status || error.message;
    if (errorMessage) toast.error(errorMessage);
  }

  if (allpackageError) {
    const errorMessage =
      allpackageError.data?.message ||
      allpackageError.error ||
      allpackageError.status ||
      allpackageError.message;
    if (errorMessage) toast.error(errorMessage);
  }

  if (allReviewError) {
    const errorMessage =
      allReviewError.data?.message ||
      allReviewError.error ||
      allReviewError.status ||
      allReviewError.message;
    if (errorMessage) toast.error(errorMessage);
  }

  if (menuError || destinationPackagesError) {
    const errorMessage =
      menuError?.data?.message ||
      menuError?.error ||
      destinationPackagesError?.data?.message ||
      destinationPackagesError?.error;
    if (errorMessage) toast.error(errorMessage);
  }

  // 9) PREPARAZIONE DATI PER IL TEMPLATE

  const bestTimeRange = data?.data?.trip_detail?.best_time_to_go;
  let bestTimeToGo;

  if (bestTimeRange) {
    const [start, end] = bestTimeRange.split(" - ");
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startMonth = startDate.toLocaleString("default", { month: "short" });
    const endMonth = endDate.toLocaleString("default", { month: "short" });
    bestTimeToGo = `${startMonth} - ${endMonth}`;
  }

  const heroSectionData = {
    heroSectionTittle: data?.data?.trip_detail?.hero_section_title,
    heroSectionSubtittle: data?.data?.trip_detail?.hero_section_sub_title,
    herSectionDescreption: data?.data?.trip_detail?.hero_section_description,
    bestTimeToGo: bestTimeToGo,
    price: data?.data?.package_price,
    suggestedHolidayLenght: data?.data.duration,
    heroImage: data?.data?.trip_package_image,
    img_alt_txt: data?.data?.image_alt_txt,
    img_gallery: data?.data?.image_galleries,
  };

  const itenariesData = {
    itenareiesSubTittle: data?.data?.trip_detail?.itinerary_sub_title,
    allItenareies: data?.data?.itineraries,
  };

  const priceData = {
    priceInclusiveData:
      data?.data.trip_detail?.prices_for_basic_and_full_inclusive_packages,
    basic_package_price_with_details:
      data?.data.trip_detail?.basic_package_price_with_details,
    brouchure: data?.data?.trip_detail?.brochure_pdf,
  };

  const sectionTabs = [
    { label: t("sectionsTab.description"), link: "description" },
    { label: t("sectionsTab.itinerary-plan"), link: "itinerary-plan" },
    { label: t("sectionsTab.dates-and-price"), link: "dates-and-price" },
    { label: t("sectionsTab.brochure-download"), link: "brochure-download" },
    { label: t("sectionsTab.video"), link: "Video" },
  ];

  return (
    <div>
      <TourListDetailsBanner herSectionData={heroSectionData} />

      <TourListDetailsTab sectionTabs={sectionTabs} />

      <section className="container z-[0] mx-auto">
        <TourListDetailsDescription
          descreptionData={data?.data?.trip_detail?.description}
        />

        <ItenaryIdeaDetails itenariesData={itenariesData} />

        <TourListDetailsReview data={reviewData?.data} isHeading={true} />

        <TourListDetailsDatesPrices data={priceData} />

        <TourListDetailsVideoGallery videos={data?.data?.videos} /> 
		  
		<TourListDetailsSuggestions   data={allPackaageData?.data}   destinationSlug={effectiveDestinationSlug} />
      </section>
    </div>
  );
};

export default TouristListDetails;
