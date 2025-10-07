import { createApi, QueryStatus } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";
import { useSelector } from "react-redux";

const SiteURl = import.meta.env.VITE_SERVER_BASE_URL;

const lan = localStorage.getItem("lan");

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: SiteURl }),
  tagTypes: ["Trips"],
  endpoints: builder => ({
    planTripRequest: builder.mutation({
      query: tripData => ({
        url: "/plan-trip",
        method: "POST",
        data: tripData,
      }),
    }),

    tripPackages: builder.query({
      query: id => ({
        url: `/trip-packages?destination_id=${id ? id : 1}`,
        method: "GET",
      }),
    }),

    allPackages: builder.query({
      query: () => ({
        url: `/destinations`,
        method: `GET`,
      }),
    }),

    getHomePageFaqData: builder.query({
      query: () => ({
        url: `/faq/all`,
        method: `GET`,
      }),
    }),

    sendQuery: builder.mutation({
      query: data => ({
        url: `/send-query`,
        method: "POST",
        data: data,
      }),
    }),

    planYourTrip: builder.mutation({
      query: data => ({
        url: `/plan-trip`,
        method: `POST`,
        data: data,
      }),
    }),

    tripPackageDetails: builder.query({
      query: id => ({
        url: `/trip-package-details/${id}`,
        method: `GET`,
      }),
    }),

    tourGuideData: builder.query({
      query: id => ({
        url: `/trip-guides/${id}`,
        method: "GET",
      }),
    }),

    getFooterLinkData: builder.query({
      query: () => ({
        url: `/social-links`,
        method: `GET`,
      }),
    }),

    getPrivacyPageData: builder.query({
      query: () => ({
        url: `/dynamic-pages/single/privacy-and-policy`,
        method: `GET`,
      }),
    }),

    getTermsAndConditionData: builder.query({
      query: () => ({
        url: `/dynamic-pages/single/terms-and-conditions`,
        method: `GET`,
      }),
    }),

    getSiteSettingData: builder.query({
      query: () => ({
        url: `/site-settings`,
        method: `GET`,
      }),
    }),

    getHomePageHeroSectionData: builder.query({
      query: () => ({
        url: `/cms/home-page-hero-section`,
        method: `GET`,
      }),
    }),

    getWhyBookWithLereveHouse: builder.query({
      query: () => ({
        url: `/cms/why-lerevehouse`,
        method: `GET`,
      }),
    }),

    getRequestedTrips: builder.query({
      query: () => ({
        url: `/most-requested-trips`,
        method: `GET`,
      }),
    }),

    getSmartOfferData: builder.query({
      query: () => ({
        url: `/smart-offers`,
        method: `GET`,
      }),
    }),

    getDestinationOvreviewDetails: builder.query({
      query: () => ({
        url: `/destinations`,
        method: `GET`,
      }),
    }),

    getDestinationsHeroSectionData: builder.query({
      query: () => ({
        url: `/cms/destinations`,
        method: "GET",
      }),
    }),

    getTravelStylesHeroSectionData: builder.query({
      query: () => ({
        url: `/cms/travel-styles`,
        method: "GET",
      }),
    }),

    getAllTravelStylesData: builder.query({
      query: () => ({
        url: `/travel-styles`,
        method: `GET`,
      }),
    }),

    getStylesAdventureData: builder.query({
      query: () => ({
        url: `/cms/waph`,
        method: `GET`,
      }),
    }),

    getTravelStylesDescreptionData: builder.query({
      query: () => ({
        url: `/cms/waph-details`,
        method: `GET`,
      }),
    }),

    getContactHeroSectionData: builder.query({
      query: () => ({
        url: `/cms/contact-us-hero-section`,
        method: "GET",
      }),
    }),

    getOfficeData: builder.query({
      query: () => ({
        url: `/cms/office-addresses`,
        method: `GET`,
      }),
    }),

    getTripPackageDetails: builder.query({
      query: id => ({
        url: `/trip-packages?travel_style_id=${id}`,
        method: `GET`,
      }),
    }),

    getAcitivityHeroSection: builder.query({
      query: () => ({
        url: `/cms/activity-hero-section`,
        method: `GET`,
      }),
    }),

    getActivityDetails: builder.query({
      query: () => ({
        url: `/cms/activity-details-section`,
        method: `GET`,
      }),
    }),

    getAllActivity: builder.query({
      query: () => ({
        url: `/activities`,
        method: `GET`,
      }),
    }),

    getAcitivitySloganData: builder.query({
      query: () => ({
        url: `/cms/activity-slogan-section`,
        method: `GET`,
      }),
    }),

    getDestinationDetails: builder.query({
      query: id => ({
        url: `/destination-details/${id}`,
        method: `GET`,
      }),
    }),

    getDestinationDetailsPackage: builder.query({
      query: id => ({
        url: `/trip-packages?destination_id=${id}`,
        method: `GET`,
      }),
    }),

    getAllPackages: builder.query({
      query: () => ({
        url: `/trip-packages`,
        method: `GET`,
      }),
    }),

    getAllReviews: builder.query({
      query: () => ({
        url: `/reviews`,
        method: `GET`,
      }),
    }),

    getHoneyMoonHeroSectionData: builder.query({
      query: () => ({
        url: `/cms/honeymoon-hero-section`,
        method: `GET`,
      }),
    }),

    getTransportationHeroSectionData: builder.query({
      query: () => ({
        url: `/cms/transportation-hero-section`,
        method: `GET`,
      }),
    }),

    getHoneyMoonDetailsSection: builder.query({
      query: () => ({
        url: `/cms/honeymoon-details-section`,
        method: `GET`,
      }),
    }),

    getAllTransportationData: builder.query({
      query: () => ({
        url: `/transportations`,
        method: `GET`,
      }),
    }),

    getTransportationPageDetails: builder.query({
      query: () => ({
        url: `/cms/transportation-details-section`,
        method: `GET`,
      }),
    }),

    getTouristGuideHeroSectionData: builder.query({
      query: id => ({
        url: `/tourist-guide-hero-section/${id}`,
        method: `GET`,
      }),
    }),

    getTouristGuideSpecailistsSectionData: builder.query({
      query: () => ({
        url: `/cms/guide-tourist-second-section`,
        method: `GET`,
      }),
    }),

    getCanadaTravelData: builder.query({
      query: () => ({
        url: `/cms/guide-tourist-third-section`,
        method: `GET`,
      }),
    }),

    getTouristGuidePlaces: builder.query({
      query: id => ({
        url: `/tourist-guides/${id}`,
        method: `GET`,
      }),
    }),

    getSingleTourDetails: builder.query({
      query: id => ({
        url: `/tourist-guide-details/${id}`,
        method: `GET`,
      }),
    }),

    getNationalParkHeroSectionData: builder.query({
      query: () => ({
        url: `/cms/national-park-hero-section`,
        method: `GET`,
      }),
    }),

    getAllNationalParkData: builder.query({
      query: id => ({
        url: `/national-parks/${id}`,
        method: `GET`,
      }),
    }),

    getEatingAndDrinkingHeroSectionData: builder.query({
      query: () => ({
        url: `/cms/eating-and-drinking-hero-section`,
        method: `GET`,
      }),
    }),

    getAllEatingAndDrinkingData: builder.query({
      query: id => ({
        url: `/eatingdrinking/${id}`,
        method: `GET`,
      }),
    }),

    getAcitivityDatas: builder.query({
      query: () => ({
        url: `/activities`,
        method: `GET`,
      }),
    }),

    getSingleActivityDetails: builder.query({
      query: id => ({
        url: `/activity-details/${id}`,
        method: `GET`,
      }),
    }),

    getAcitivitySubCategoryDetails: builder.query({
      query: id => ({
        url: `/activity-sub-category-details/${id}`,
        method: `GET`,
      }),
    }),

    getRecomendedActivities: builder.query({
      query: () => ({
        url: `/recomended-activities`,
        method: `GET`,
      }),
    }),

    getTransportationPageDetailsData: builder.query({
      query: id => ({
        url: `/transportation-details/${id}`,
        method: `GET`,
      }),
    }),

    getAccomadationsData: builder.query({
      query: id => ({
        url: `/accommodations/${id}`,
        method: `GET`,
      }),
    }),

    getAllMenuSubMenuData: builder.query({
      query: () => ({
        url: `/all-menu-with-sub-menus`,
        method: `GET`,
      }),
    }),

    postExtraItenaries: builder.mutation({
      query: data => ({
        url: `/add-extra-itineraries`,
        method: `POST`,
        data: data,
      }),
    }),

    globalSearch: builder.query({
      query: query => ({
        url: `/global-search?query=${query}`,
        method: `GET`,
      }),
    }),

    getTravelMainHeroSectionData: builder.query({
      query: () => ({
        url: `/cms/guide-tourist-hero-section`,
        method: `GET`,
      }),
    }),

    getTravelStylesDetailsData: builder.query({
      query: id => ({
        url: `/travel-styles-details/${id}`,
        method: `GET`,
      }),
    }),

    MetaDetailsData: builder.mutation({
      query: name => ({
        url: `/meta-tags?page=${name}`,
        method: `POST`,
      }),
    }),

    getAccomadationDetails: builder.query({
      query: id => ({
        url: `/accommodation-details/${id}`,
        method: `GET`,
      }),
    }),

    subscribeNewsletter: builder.mutation({
      query: data => ({
        url: `/newsletter-subscriber-store`,
        method: `POST`,
        data: data,
      }),
    }),

    footerAboveSection: builder.query({
      query: () => ({
        url: `/cms/footer-above-section`,
        method: `GET`,
      }),
    }),

    getNewsLetterTxt: builder.query({
      query: () => ({
        url: `/cms/footer-newsletter`,
        method: `GET`,
      }),
    }),

    getFooterNavData: builder.query({
      query: () => ({
        url: `/cms/footer-links`,
        method: `GET`,
      }),
    }),

    getHomePageTitle: builder.query({
      query: () => ({
        url: `/cms/home-page-titles`,
        method: `GET`,
      }),
    }),

    getDestinationTitle: builder.query({
      query: () => ({
        url: `/cms/destinations-page-titles`,
        method: `GET`,
      }),
    }),

    getTravelStyleTitle: builder.query({
      query: () => ({
        url: `/cms/travel-style-page-titles`,
        method: `GET`,
      }),
    }),

    getActivityTitle: builder.query({
      query: () => ({
        url: `/cms/activity-page-titles`,
        method: `GET`,
      }),
    }),

    getHoneyMoonTitle: builder.query({
      query: () => ({
        url: `/cms/honey-moon-page-titles`,
        method: `GET`,
      }),
    }),

    getAvailableActivitiesTripPackage: builder.query({
      query: ({id}) => ({
        url: `/available-trip-package-for-this-activity/${id}`,
        method: `GET`,
      }),
    }),
  }),
});

export const {
  usePlanTripRequestMutation,
  useTripPackagesQuery,
  useAllPackagesQuery,
  useGetHomePageFaqDataQuery,
  useSendQueryMutation,
  useTripPackageDetailsQuery,
  useTourGuideDataQuery,
  useGetFooterLinkDataQuery,
  useGetPrivacyPageDataQuery,
  useGetSiteSettingDataQuery,
  useGetHomePageHeroSectionDataQuery,
  useGetWhyBookWithLereveHouseQuery,
  useGetRequestedTripsQuery,
  useGetSmartOfferDataQuery,
  useGetDestinationOvreviewDetailsQuery,
  useGetDestinationsHeroSectionDataQuery,
  useGetTravelStylesHeroSectionDataQuery,
  useGetAllTravelStylesDataQuery,
  useGetStylesAdventureDataQuery,
  useGetTravelStylesDescreptionDataQuery,
  useGetContactHeroSectionDataQuery,
  useGetOfficeDataQuery,
  useGetTripPackageDetailsQuery,
  useGetAcitivityHeroSectionQuery,
  useGetActivityDetailsQuery,
  useGetAcitivitySloganDataQuery,
  useGetDestinationDetailsQuery,
  useGetDestinationDetailsPackageQuery,
  useGetAllPackagesQuery,
  useGetAllReviewsQuery,
  useGetHoneyMoonHeroSectionDataQuery,
  useGetTransportationHeroSectionDataQuery,
  useGetAllTransportationDataQuery,
  useGetTransportationPageDetailsQuery,
  useGetTouristGuideHeroSectionDataQuery,
  useGetTouristGuideSpecailistsSectionDataQuery,
  useGetCanadaTravelDataQuery,
  useGetTouristGuidePlacesQuery,
  useGetSingleTourDetailsQuery,
  useGetNationalParkHeroSectionDataQuery,
  useGetAllNationalParkDataQuery,
  useGetEatingAndDrinkingHeroSectionDataQuery,
  useGetAllEatingAndDrinkingDataQuery,
  useGetAcitivityDatasQuery,
  useGetSingleActivityDetailsQuery,
  useGetAcitivitySubCategoryDetailsQuery,
  useGetRecomendedActivitiesQuery,
  useGetTransportationPageDetailsDataQuery,
  useGetAllMenuSubMenuDataQuery,
  useGetAccomadationsDataQuery,
  usePostExtraItenariesMutation,
  useGetTermsAndConditionDataQuery,
  useGlobalSearchQuery,
  useGetTravelMainHeroSectionDataQuery,
  useGetTravelStylesDetailsDataQuery,
  useMetaDetailsDataMutation,
  useGetAccomadationDetailsQuery,
  useGetHoneyMoonDetailsSectionQuery,
  useSubscribeNewsletterMutation,
  useFooterAboveSectionQuery,
  useGetNewsLetterTxtQuery,
  useGetHomePageTitleQuery,
  useGetFooterNavDataQuery,
  useGetDestinationTitleQuery,
  useGetTravelStyleTitleQuery,
  useGetActivityTitleQuery,
  useGetHoneyMoonTitleQuery,
  useGetAvailableActivitiesTripPackageQuery
} = apiSlice;
