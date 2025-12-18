import { useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import ErrorPage from "@/Pages/ErrroPage/ErrorPage";
import DestinationDetails from "@/Pages/DestinationDetails/DestinationDetails";
import TravelStyleDetailsPage from "@/Pages/TravelStyleDetails/TravelStyleDetailsPage";
import ActivitiesDetails from "@/Pages/ActivitiesDetails/ActivitiesDetails";
import TourWithCar from "@/Pages/TourWithCar/TourWithCar";
import ActivitiesSubcategory from "@/Pages/ActivitiesSubcategory/ActivitiesSubcategory";
import { useGetAllMenuSubMenuDataQuery } from "@/Redux/features/api/apiSlice";
import ViagaNozi from "@/Pages/ViagaNozi/ViagaNozi"; // 👈 AGGIUNGILO QUI
const SlugResolver = () => {
  const { slug } = useParams();

  const {
    data: menuData,
    isLoading,
    error,
  } = useGetAllMenuSubMenuDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  if (!slug) {
    return <ErrorPage />;
  }

  if (isLoading) {
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

  if (error || !menuData?.data) {
    return <ErrorPage />;
  }

  const categories = menuData.data;

  // flatten di tutti i sotto-menu
  const allItems = categories.flatMap(cat =>
    (cat.subCatgoryArr || []).map(item => ({
      ...item,
      parent: cat,
    }))
  );

  const match = allItems.find(item => item.slug === slug);

  if (!match) {
    return <ErrorPage />;
  }

  const url = (match.url || "").toLowerCase();

		const isNozze =
  url.includes("viaggi-nozze");
	
	const isHoney =
  url.includes("honeymoon");
	
	const isActivity =
  url.includes("activity-details");

  const isActivitydetails = url.includes("activities-details");
	
  const isDestination =
    url.includes("destination-details") || url.includes("/destination");

  const isTravelStyle =
    url.includes("travel-styles-details") || url.includes("/travel-style");

	const isRoadTour = url.includes("road-tour-details"); // 👈 AGGIUNTO
	
  if (isDestination) {
    return <DestinationDetails />;
  }

  if (isTravelStyle || isHoney) {
    return <TravelStyleDetailsPage />;
  }
	 if (isNozze) {
    return <ViagaNozi />;
  }
	if (isActivity) {
    return <ActivitiesSubcategory categorySlug={slug}  />;
  }
	if (isActivitydetails) {
    return <ActivitiesDetails />;
  }

if (isRoadTour) {
  return <TourWithCar />;
}

  // fallback: se non è nessuno dei due, per ora 404
  return <ErrorPage />;
};

export default SlugResolver;
