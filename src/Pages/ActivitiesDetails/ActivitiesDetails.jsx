import CommonHeroBanner from "@/components/common/HeroBanner/CommonHeroBanner";
import bg from "@/assets/images/activities/activities-details.jfif";
import image1 from "@/assets/images/activities-details/1.jfif";
import image2 from "@/assets/images/activities-details/2.jfif";
import image3 from "@/assets/images/activities-details/3.jfif";
import image4 from "@/assets/images/activities-details/4.jfif";
import img1 from "@/assets/images/activities/1.jfif";
import img2 from "@/assets/images/activities/2.jfif";
import img3 from "@/assets/images/activities/3.jfif";
import img4 from "@/assets/images/activities/4.jfif";
import ActivitiesDetailsGallery from "@/components/ActivitiesDetails/ActivitiesDetailsGallery";
import ActivitiesSubcategoryCard from "@/components/common/Cards/ActivitiesSubcategoryCard";
import plane from "../../assets/images/activities-details/plane.jpg";
import { tickPriceLeft } from "@/components/DummyData/priceDummyData";
import { CheckMark } from "@/components/common/SvgContainer/SvgContainer";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  useGetAcitivitySubCategoryDetailsQuery,
  useGetRecomendedActivitiesQuery,
  useMetaDetailsDataMutation,
  useGetAllMenuSubMenuDataQuery,
  useGetSingleActivityDetailsQuery, // ⬅️ AGGIUNTO: /activity-details/:id
} from "@/Redux/features/api/apiSlice";
import HelmetComponent from "@/components/Helmet/Helmet";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { InfinitySpin } from "react-loader-spinner";
import ErrorPage from "@/Pages/ErrroPage/ErrorPage";

const ActivitiesDetails = () => {
  const location = useLocation();

  // 🔧 gestiamo più casi possibili di param (id/slug, slug1/slug2, ecc.)
  const params = useParams();
  const {
    id: paramId,
    slug: paramSlug,
    slug1,
    slug2,
    categorySlug: paramCategorySlug,
    activitySlug: paramActivitySlug,
  } = params;

  // routeId = può essere un id numerico ("33") o uno slug di categoria ("hiking-trekking")
  const routeId = paramId || slug1 || paramCategorySlug || null;
  // routeSlug = slug di attività ("the-best-diving-spots-in-vancouver") o slug vecchio
  const routeSlug = paramSlug || slug2 || paramActivitySlug || null;

  const { t } = useTranslation();

  // ---------- META ----------
  const [metaDetailsData, { isLoading: isMetaLoading, isSuccess, isError }] =
    useMetaDetailsDataMutation();

  const [metaData, setMetaData] = useState(null);

  useEffect(() => {
    metaDetailsData("activity_sub_category_details")
      .unwrap()
      .then(res => setMetaData(res?.data))
      .catch(err => console.error("Meta save error:", err));
  }, [metaDetailsData]);

  // ---------- MENU ----------
  const {
    data: menuData,
    isLoading: isMenuLoading,
    error: menuError,
  } = useGetAllMenuSubMenuDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // capisco se l'"id" della route è numerico (vecchio schema) o slug (nuovo schema)
  const isNumericId = routeId && /^\d+$/.test(routeId);

  // se NON è numerico → siamo nel caso SEO: /categorySlug/activitySlug
  const categorySlug = !isNumericId ? routeId : null; // es. "hiking-trekking"
  const activitySlug = !isNumericId ? routeSlug : null; // es. "the-best-diving-spots-in-vancouver"

  // 1️⃣ Se siamo in slug-mode, dal menu ricavo l'activityId (per chiamare /activity-details/:id)
  const activityIdFromMenu = useMemo(() => {
    if (!categorySlug || !menuData?.data) return null;

    const activitiesCategory = menuData.data.find(
      cat =>
        cat.redirectLink === "/travel-activities" ||
        cat.redirectLink === "/activities" ||
        (cat.category || "").toLowerCase().includes("activity")
    );

    const match = activitiesCategory?.subCatgoryArr?.find(
      item => item.slug === categorySlug
    );

    return match?.id ? String(match.id) : null;
  }, [categorySlug, menuData]);

  // 2️⃣ Con activityId chiamo /activity-details/:id per avere l'albero completo (quello che hai incollato tu)
  const {
    data: activityTreeData,
    isLoading: isActivityTreeLoading,
    error: activityTreeError,
  } = useGetSingleActivityDetailsQuery(activityIdFromMenu || "default", {
    skip: !activityIdFromMenu, // chiamato solo in slug-mode
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // 3️⃣ Dal tree cerco la subcategory che matcha activitySlug e prendo il suo id
  const subcategoryIdFromSlug = useMemo(() => {
    if (!activitySlug || !activityTreeData?.data?.activity_category) {
      return null;
    }

    const allSubcats = activityTreeData.data.activity_category.flatMap(cat =>
      (cat.activity_sub_category || []).map(sub => sub)
    );

    const match = allSubcats.find(sub => sub.slug === activitySlug);

    return match?.id ? String(match.id) : null;
  }, [activitySlug, activityTreeData]);

  // 4️⃣ IDENTIFIER FINALE
  // - se "id" è numerico → vecchia rotta (es: /activities-details/33)
  // - altrimenti → uso l'id trovato da slug (es: /hiking-trekking/the-best-...)
  const identifier = isNumericId ? routeId : subcategoryIdFromSlug || null;

  // ---------- QUERY DATI ATTIVITÀ (DETTAGLIO SUBCATEGORY) ----------
  const {
    data,
    error,
    isLoading,
  } = useGetAcitivitySubCategoryDetailsQuery(identifier || "default", {
    skip: !identifier,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: RecomendedData,
    error: recomendedError,
    isLoading: isRecomendedLoading,
  } = useGetRecomendedActivitiesQuery(identifier || "default", {
    skip: !identifier,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // ---------- gestione errori API ----------
  useEffect(() => {
    const pushError = errObj => {
      if (!errObj) return;
      const errorMessage =
        errObj.data?.message ||
        errObj.error ||
        errObj.status ||
        errObj.message;
      if (errorMessage) toast.error(errorMessage);
    };

    pushError(error);
    pushError(recomendedError);
    pushError(activityTreeError);
  }, [error, recomendedError, activityTreeError]);

  // ---------- RETURN CONDIZIONALI (dopo TUTTI gli hook) ----------

  // se non ho ancora capito che subcategory devo mostrare
  if (!identifier) {
    // in slug-mode devo aspettare menu + albero attività
    if (!isNumericId && (isMenuLoading || isActivityTreeLoading)) {
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

    // se arrivo qui, non ho trovato mappatura slug→id
    return <ErrorPage />;
  }

  // loading principale dati attività
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

  if (!data?.data?.[0]) {
    return <ErrorPage />;
  }

  const heroData = data?.data[0].activity_sub_category;
  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  // ---------- UI (tutta la tua, invariata) ----------
  return (
    <HelmetComponent
      title={metaData?.title}
      description={metaData?.description}
    >
      <CommonHeroBanner
        uppercaseItalic={true}
        uppercaseTitle={true}
        bg={`${imgBaseurl}/${heroData?.image}`}
        title={heroData?.title}
      />

      <section className="container md:my-20 mt-10 mb-10">
        {/* gallery */}
        <ActivitiesDetailsGallery
          activitiesDetailsGalleryItems={
            data?.data[0]?.activity_sub_category_details_images
          }
        />

        {/* description */}
        <div className="md:mt-16 mt-8">
          <div
            dangerouslySetInnerHTML={{
              __html: data?.data[0]?.short_description,
            }}
            className="space-y-2 text-2xl font-editorsNoteNormal text-text-black font-medium short_descreption "
          ></div>
        </div>

        {/* map section */}
        <div className="md:mt-16 mt-8 flex flex-col md:flex-row md:gap-10 gap-6 md:h-[700px] items-stretch">
          {/* left side */}
          <div className="md:w-2/3">
            <img
              src={`${imgBaseurl}/${data?.data[0]?.image}`}
              className="w-full h-[280px] md:h-[665px] object-cover"
              alt="not found"
            />
          </div>

          {/* right side */}
          <div className="flex flex-col gap-6 justify-center md:w-1/3">
            {/* Where */}
            <div className="space-y-3">
              <h4 className="text-2xl font-editorsNoteNormal text-text-black font-medium leading-[140%]">
                {t("activityDetails.where")}
              </h4>
              <div className="space-y-2 font-interTight text-text-gray">
                <p>{data?.data[0]?.where}</p>
              </div>
            </div>

            {/* When */}
            <div className="space-y-3">
              <h4 className="text-2xl font-editorsNoteNormal text-text-black font-medium leading-[140%]">
                {t("activityDetails.when")}
              </h4>
              <div className="space-y-2 font-interTight text-text-gray">
                <p>{data?.data[0]?.when}</p>
              </div>
            </div>

            {/* Available Date */}
            <div className="space-y-3">
              <h4 className="text-2xl font-editorsNoteNormal text-text-black font-medium leading-[140%]">
                {t("activityDetails.availableDate")}
              </h4>
              <div className="space-y-2 font-interTight text-text-gray">
                <p>{data?.data[0]?.avaiable_date}</p>
              </div>
            </div>

            {/* Number of Travelers */}
            <div className="space-y-3">
              <h4 className="text-2xl font-editorsNoteNormal text-text-black font-medium leading-[140%]">
                {t("activityDetails.travelers")}
              </h4>
              <div className="space-y-2 font-interTight text-text-gray">
                <p>{data?.data[0]?.number_of_people}</p>
              </div>
            </div>
          </div>
        </div>

        {/* includes and excludes */}
        <div className="md:mt-16 mt-8 md:p-10 p-5 bg-[#efefef] flex flex-row gap-[60px] flex-wrap ">
          <div className="flex flex-col gap-y-[36px]">
            <div
              dangerouslySetInnerHTML={{
                __html: data?.data[0]?.description,
              }}
              className="flex flex-col flex-wrap gap-y-4 text-[#252525] text-lg lg:text-2xl font-fontSpring font-medium leading-[150%]"
            ></div>
          </div>
        </div>

        {/* recommendation */}
        <div className="md:mt-16 mt-8">
          <div>
            <h4 className="font-editorsNoteNormal text-3xl font-medium leading-[132%]">
              {t("recommendedActivities")}
            </h4>
          </div>

          <div className="md:mt-16 mt-4 grid lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 md:gap-2 gap-5 col-span-6">
            {RecomendedData?.data?.slice(0, 4).map(item => (
              <ActivitiesSubcategoryCard item={item} key={item?.id} />
            ))}
          </div>
        </div>
      </section>
    </HelmetComponent>
  );
};

export default ActivitiesDetails;
