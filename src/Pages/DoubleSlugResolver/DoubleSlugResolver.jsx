import { useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import ErrorPage from "@/Pages/ErrroPage/ErrorPage";
import TouristListDetails from "@/Pages/TouristListDetails/TouristListDetails";
import ActivitiesDetails from "@/Pages/ActivitiesDetails/ActivitiesDetails";
import { useGetAllMenuSubMenuDataQuery } from "@/Redux/features/api/apiSlice";

const DoubleSlugResolver = () => {
  const { slug1, slug2 } = useParams();

  const {
    data: menuData,
    isLoading,
    error,
  } = useGetAllMenuSubMenuDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  if (!slug1 || !slug2) {
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

  // TROVO la categoria "activity"
  const activityCategory = categories.find(
    cat =>
      cat.redirectLink === "/activities" ||
      cat.category?.toLowerCase() === "activity"
  );

  const activityCategorySlugs =
    activityCategory?.subCatgoryArr?.map(item => item.slug) || [];

  const isActivityCategory = activityCategorySlugs.includes(slug1);

  // 👉 CASO 1: PRIMO SLUG = CATEGORIA ACTIVITY → DETTAGLIO ATTIVITÀ
  if (isActivityCategory) {
    // slug1 = categoria (es. "hiking-trekking")
    // slug2 = attività (es. "i-migliori-luoghi-per-immersioni-a-vancouver")
    // qui dobbiamo montare il dettaglio activity
    return <ActivitiesDetails />;
  }

  // 👉 CASO 2: altrimenti lascio comportamento attuale TOUR
  return <TouristListDetails />;
};

export default DoubleSlugResolver;
