import TourListDetailsTab from "@/components/TourListDetails/TourListDetailsTab";
import TourListDetailsDescription from "@/components/TourListDetails/TourListDetailsDescription";
import TourListDetailsReview from "@/components/TourListDetails/TourListDetailsReview";
import TourListDetailsDatesPrices from "@/components/TourListDetails/TourListDetailsDatesPrices";
import TourListDetailsSuggestions from "@/components/TourListDetails/TourListDetailsSuggestions";
import TourListDetailsVideoGallery from "@/components/TourListDetails/TourListDetailsVideoGallery";
import ItenaryIdeaDetails from "@/components/TourListDetails/ItenaryIdeaDetails";
import TourListDetailsBanner from "@/components/TourListDetails/TourListDetailsBanner";
import bg from "../../assets/images/destination-bg.jpg";
import WaterActivity from "@/components/TourListDetails/WaterActivity";
import CommonHeroBanner from "@/components/common/HeroBanner/CommonHeroBanner";
import {
  useGetAllPackagesQuery,
  useGetAllReviewsQuery,
  useTripPackageDetailsQuery,
} from "@/Redux/features/api/apiSlice";
import { useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const TouristListDetails = () => {
  const { id } = useParams();

  const { t } = useTranslation();

  const { data, error, isLoading } = useTripPackageDetailsQuery(id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: allPackaageData,
    error: allpackageError,
    isLoading: ispackageLoading,
  } = useGetAllPackagesQuery(id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: reviewData,
    error: allReviewError,
    isLoading: isReviewLoading,
  } = useGetAllReviewsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  if (isLoading || ispackageLoading || isReviewLoading) {
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

  if (error) {
    const errorMessage =
      error.data?.message || error.error || error.status || error.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

  if (allpackageError) {
    const errorMessage =
      allpackageError.data?.message ||
      allpackageError.error ||
      allpackageError.status ||
      allpackageError.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

  if (allReviewError) {
    const errorMessage =
      allReviewError.data?.message ||
      allReviewError.error ||
      allReviewError.status ||
      allReviewError.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

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

  console.log(data?.data , ' this is all data ');
  

  const heroSectionData = {
    heroSectionTittle: data?.data?.trip_detail?.hero_section_title,
    heroSectionSubtittle: data?.data?.trip_detail?.hero_section_sub_title,
    herSectionDescreption: data?.data?.trip_detail?.hero_section_description,
    bestTimeToGo: bestTimeToGo,
    price: data?.data?.package_price,
    suggestedHolidayLenght: data?.data.duration,
    heroImage: data?.data?.trip_package_image,
    img_alt_txt: data?.data?.image_alt_txt,
    img_gallery:data?.data?.image_galleries
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
    {
      label: t("sectionsTab.description"),
      link: "description",
    },
    {
      label: t("sectionsTab.itinerary-plan"),
      link: "itinerary-plan",
    },
    {
      label: t("sectionsTab.dates-and-price"),
      link: "dates-and-price",
    },
    {
      label: t("sectionsTab.brochure-download"),
      link: "brochure-download",
    },
    {
      label: t("sectionsTab.video"),
      link: "Video",
    },
  ];

  return (
    <div>
      {/* Hero section */}
      {/* <CommonHeroBanner
        bg={bg}
        title="Canada & Alaska"
        italic="Travel"
        duration=" 15 Days From  €3,850.00 "
      /> */}
      <TourListDetailsBanner herSectionData={heroSectionData} />

      {/* tabs */}
      <TourListDetailsTab sectionTabs={sectionTabs} />

      {/* tab contents */}
      <section className="container z-[0] mx-auto">
        {/* description */}
        <TourListDetailsDescription
          descreptionData={data?.data?.trip_detail?.description}
        />

        {/* itinerary */}
        <ItenaryIdeaDetails itenariesData={itenariesData} />

        {/* Water Activity */}
        {/* <WaterActivity /> */}

        {/* Testimonials */}
        <TourListDetailsReview data={reviewData?.data} isHeading={true} />

        {/* Dates and Prices */}
        <TourListDetailsDatesPrices data={priceData} />

        {/* video gallery section */}
        <TourListDetailsVideoGallery videos={data?.data?.videos} />

        {/* suggestions */}
        <TourListDetailsSuggestions data={allPackaageData?.data} />
      </section>
    </div>
  );
};

export default TouristListDetails;
