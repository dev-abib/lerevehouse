import MainLayout from "@/Layout/MainLayout";
import ActivitiesDetails from "@/Pages/ActivitiesDetails/ActivitiesDetails";
import ActivitiesSubcategory from "@/Pages/ActivitiesSubcategory/ActivitiesSubcategory";
import AtlanticProvinces from "@/Pages/AtlanticProvinces/AtlanticProvinces";
import CanadaHoliday from "@/Pages/CanadaHoliday/CanadaHoliday";
import CanadaMap from "@/Pages/CanadaMap/CanadaMap";
import Contact from "@/Pages/Contact/Contact";
import CustomizeTripCanada from "@/Pages/CustomizeTripCanada/CustomizeTripCanada";
import Destination from "@/Pages/Destination/Destination";
import DestinationDetails from "@/Pages/DestinationDetails/DestinationDetails";
import DynamicPage from "@/Pages/DynamicPage/DynamicPage";
import EatAndDrink from "@/Pages/EatAndDrink/EatAndDrink";
import ErrorPage from "@/Pages/ErrroPage/ErrorPage";
import Homepage from "@/Pages/Homepage/Homepage";
import OntarionQuebec from "@/Pages/OntarioQuebec/OntarionQuebec";
import Prairies from "@/Pages/Praises/Prairies";
import SingleCanadaTour from "@/Pages/SingleCanadaTour/SingleCanadaTour";
import TestMap from "@/Pages/TestMap/TestMap";
import TourAutoCanada from "@/Pages/TourAutoCanada/TourAutoCanada";
import TourCanada from "@/Pages/TourCanda/TourCanada";
import TourGuide from "@/Pages/TourGuide/TourGuide";
import TourGuide22 from "@/Pages/TourGuide22";
import TouristGuide from "@/Pages/TouristGuide/TouristGuide";
import TouristListDetails from "@/Pages/TouristListDetails/TouristListDetails";
import TourList from "@/Pages/TourList/TourList";
import TourWithCar from "@/Pages/TourWithCar/TourWithCar";
import TravelActivitiesPage from "@/Pages/TravelActivites/TravelActivitiesPage";
import TravelGuide from "@/Pages/TravelGuide/TravelGuide";
import TravelStylePage from "@/Pages/TravelStyle/TravelStylePage";
import TravelStyleDetailsPage from "@/Pages/TravelStyleDetails/TravelStyleDetailsPage";
import ViagaNozi from "@/Pages/ViagaNozi/ViagaNozi";
import SearchPage from "@/SearchPage/SearchPage";
import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    element: (
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
      {
        path: "/destination",
        element: <Destination />,
      },
      {
        path: "/destination-details/:id",
        element: <DestinationDetails />,
      },
      {
        path: "/travel-style",
        element: <TravelStylePage />,
      },
      {
        path: "/travel-styles-details/:id",
        element: <TravelStyleDetailsPage />,
      },
      {
        path: "/tourist-guide",
        element: <TravelGuide />,
        // element: <TouristGuide />,
      },
      {
        path: "/tourist-guide/:id",
        element: <TouristGuide />,
      },
      {
        path: "/activity-details/:queryId",
        element: <ActivitiesSubcategory />,
      },
      {
        path: "/activities-details/:id",
        element: <ActivitiesDetails />,
      },
      {
        path: "/activities",
        element: <TravelActivitiesPage />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/tour-lists/:title",
        element: <TourList />,
      },
      {
        path: "/tour-list-details/:id",
        element: <TouristListDetails />,
      },

      {
        path: "/travel-styles-details/:slug",
        element: <TravelStyleDetailsPage />,
      },

      {
        path: "/travel-activities",
        element: <TravelActivitiesPage />,
      },
      {
        path: "/map",
        element: <TestMap />,
      },
      {
        path: "/national-park/:id",
        element: <TourGuide />,
      },
      {
        path: "/eat&-drink/:id",
        element: <EatAndDrink />,
      },
      {
        path: "/tour-guide-deatils/:slug",
        element: <TourGuide22 />,
      },
      {
        path: "/tour-mezi",
        element: <TourCanada />,
      },
      {
        path: "/viaggi-noze",
        element: <ViagaNozi />,
      },
      {
        path: "/customize/tour-canda",
        element: <CustomizeTripCanada />,
      },
      {
        path: "/tour-guides",
        element: <SingleCanadaTour />,
      },
      {
        path: "/atlantics-provinces",
        element: <AtlanticProvinces />,
      },
      {
        path: "/ontario-quebec",
        element: <OntarionQuebec />,
      },
      {
        path: "/Prairies",
        element: <Prairies />,
      },
      {
        path: "/tour-auto",
        element: <TourAutoCanada />,
      },
      {
        path: "/road-tour-details/:id",
        element: <TourWithCar />,
      },
      {
        path: "/canada-holiday",
        element: <CanadaHoliday />,
      },
      {
        path: "/map/:id",
        element: <CanadaMap />,
      },
      {
        path: "/canada-map",
        element: <CanadaMap />,
      },
      {
        path: "/pages/privacy-policy",
        element: <DynamicPage />,
      },
      {
        path: "/pages/terms-and-conditions",
        element: <DynamicPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
    ],
  },
]);
export default router;
