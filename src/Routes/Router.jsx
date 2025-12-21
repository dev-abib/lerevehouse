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
import SlugResolver from "@/Pages/SlugResolver/SlugResolver";
import DoubleSlugResolver from "@/Pages/DoubleSlugResolver/DoubleSlugResolver";
import TourGuidesRedirect from "@/Pages/TourGuidesRedirect/TourGuidesRedirect";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: [
      // HOME
      {
        index: true,
        element: <Homepage />,
      },

      // ------------- STATIC PAGES / LISTE -------------
      { path: "/destination", element: <Destination /> },
      { path: "/destinazioni", element: <Destination /> },

      { path: "/travel-style", element: <TravelStylePage /> },
      { path: "/stili-di-viaggio", element: <TravelStylePage /> }, // IT

      { path: "/activities", element: <TravelActivitiesPage /> },
      { path: "/attivita", element: <TravelActivitiesPage /> }, // IT

      { path: "/travel-activities", element: <TravelActivitiesPage /> },

      { path: "/viaggi-nozze", element: <ViagaNozi /> },
      // { path: "/honeymoon", element: <ViagaNozi /> },
      // { path: "/luna-di-miele", element: <ViagaNozi /> },

      { path: "/contact", element: <Contact /> },
      { path: "/contatti", element: <Contact /> }, // IT
      { path: "/tour-mezi", element: <TourCanada /> },

      {
        path: "/guida-turistica/:id/:destinationSlug/:slug",
        element: <SingleCanadaTour />,
      },
      {
        path: "/tour-guides/:id/:destinationSlug/:slug",
        element: <SingleCanadaTour />,
      },

      { path: "/tour-guides/:id/:slug", element: <TourGuidesRedirect /> },
      { path: "/tour-guides/:id", element: <TourGuidesRedirect /> },
      { path: "/tour-guides", element: <TourGuidesRedirect /> },
      //  { path: "/tour-guides", element: <TourGuide22 /> },
      { path: "/atlantics-provinces", element: <AtlanticProvinces /> },
      { path: "/ontario-quebec", element: <OntarionQuebec /> },
      { path: "/Prairies", element: <Prairies /> },
      { path: "/tour-auto", element: <TourAutoCanada /> },
      { path: "/canada-holiday", element: <CanadaHoliday /> },
      { path: "/map", element: <TestMap /> },
      { path: "/canada-map", element: <CanadaMap /> },
      { path: "/pages/privacy-policy", element: <DynamicPage /> },
      { path: "/pages/terms-and-conditions", element: <DynamicPage /> },
      { path: "/search", element: <SearchPage /> },

      // ------------- DESTINATION DETAILS -------------
      {
        path: "/destination-details/:id/:slug",
        element: <DestinationDetails />,
      },
      {
        path: "/destination-details/:id",
        element: <DestinationDetails />,
      },

      // ------------- TRAVEL STYLE DETAILS -------------
      {
        path: "/travel-styles-details/:id/:slug",
        element: <TravelStyleDetailsPage />,
      },
      {
        path: "/travel-styles-details/:id",
        element: <TravelStyleDetailsPage />,
      },

      // ------------- TOURIST GUIDE -------------
      // GUIDA TURISTICA
      { path: "/tourist-guide", element: <TravelGuide /> }, // EN (lista)
      { path: "/guida-turistica", element: <TravelGuide /> }, // IT

      {
        path: "/tourist-guide/:id/:slug",
        element: <TouristGuide />,
      },
      {
        path: "/guida-turistica/:id/:slug",
        element: <TouristGuide />,
      },
      {
        path: "/tourist-guide/:id",
        element: <TouristGuide />,
      },
      {
        path: "/guida-turistica/:id",
        element: <TouristGuide />,
      },

      // ------------- ACTIVITIES -------------
      {
        path: "/activity-details/:queryId",
        element: <ActivitiesSubcategory />,
      },
      {
        path: "/activity-details/:id/:slug",
        element: <ActivitiesDetails />,
      },
      {
        path: "/activity-details/:id",
        element: <ActivitiesDetails />,
      },
      {
        path: "/activities-details/:id", // alias vecchia rotta
        element: <ActivitiesDetails />,
      },

      // ------------- TOUR LISTS / DETTAGLI -------------
      {
        path: "/tour-lists/:title",
        element: <TourList />,
      },
      {
        path: "/tour-list-details/:id",
        element: <TouristListDetails />,
      },

      // ------------- ALTRE DETTAGLIO PAGINE -------------
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

      // ROAD TOUR
      {
        path: "/road-tour-details/:id/:slug",
        element: <TourWithCar />,
      },
      {
        path: "/road-tour-details/:id",
        element: <TourWithCar />,
      },

      // MAP SINGLE
      {
        path: "/map/:id",
        element: <CanadaMap />,
      },
      // SEO: /<travelStyleSlug>/<tripSlug>
      /*	{
  path: "/:destinationSlug/:tripSlug",
  element: <TouristListDetails />,
},*/
      {
        path: "/:slug1/:slug2",
        element: <DoubleSlugResolver />, // nuovo componente
      },

      // ------------- SLUG GENERICO (DESTINATION / TRAVEL STYLE) -------------
      {
        path: "/:slug",
        element: <SlugResolver />,
      },

      // ------------- 404 FALLBACK (DEVE ESSERE L'ULTIMA) -------------
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;
