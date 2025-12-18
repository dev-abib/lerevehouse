import CommonHeroBanner from "@/components/common/HeroBanner/CommonHeroBanner";
import ActivitiesSubcategoryLeftDescription from "@/components/ActivitiesSubcategory/ActivitiesSubcategoryLeftDescription";
import ActivitiesSubcategoryRightDescription from "@/components/ActivitiesSubcategory/ActivitiesSubcategoryRightDescription";
import ActivitiesSubcategoryTab from "@/components/ActivitiesSubcategory/ActivitiesSubcategoryTab";
import { useEffect, useState } from "react";
import ActivitiesSubcategoryCard from "@/components/common/Cards/ActivitiesSubcategoryCard";
import { useParams, useLocation } from "react-router-dom";
import {
  useGetAvailableActivitiesTripPackageQuery,
  useGetSingleActivityDetailsQuery,
  useMetaDetailsDataMutation,
  useGetAllMenuSubMenuDataQuery, // 👈 AGGIUNTO
} from "@/Redux/features/api/apiSlice";
import { InfinitySpin } from "react-loader-spinner";
import toast from "react-hot-toast";
import HelmetComponent from "@/components/Helmet/Helmet";
import { useTranslation } from "react-i18next";
import DestinationDetailsSlider from "@/components/DestinationDetails/DestinationDetailsSlider";
import ErrorPage from "@/Pages/ErrroPage/ErrorPage";

const ActivitiesSubcategory = ({ categorySlug }) => {
  const location = useLocation();
  const { queryId, slug } = useParams(); // 👈 ORA PRENDIAMO ANCHE LO SLUG
  const { t } = useTranslation();

  // ---------- META ----------
  const [metaDetailsData] = useMetaDetailsDataMutation();
  const [metaData, setMetaData] = useState(null);

  useEffect(() => {
    metaDetailsData("activity_details")
      .unwrap()
      .then(res => setMetaData(res?.data))
      .catch(err => console.error("Meta save error:", err));
  }, [metaDetailsData]);

  // ---------- MENU (per risolvere slug -> id quando arrivo da /hiking-trekking) ----------
  const {
    data: menuData,
    isLoading: isMenuLoading,
    error: menuError,
  } = useGetAllMenuSubMenuDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // ricavo l'id "identifier" da usare in TUTTE le query
  let identifier = queryId || null;

  if (!identifier && slug && menuData?.data) {
    const activitiesCategory = menuData.data.find(
      cat =>
        cat.redirectLink === "/activities" ||
        cat.category?.toLowerCase() === "activity"
    );

    const match = activitiesCategory?.subCatgoryArr?.find(
      item => item.slug === slug
    );

    if (match?.id) {
      identifier = String(match.id);
    }
  }

  // ---------- QUERY DATI ----------
  const {
    data,
    error,
    isLoading,
  } = useGetSingleActivityDetailsQuery(identifier || "default", {
    skip: !identifier,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: activityDetailsData,
    error: activityDetailsDataError,
    isLoading: isActivityLoading,
  } = useGetAvailableActivitiesTripPackageQuery(
    { id: identifier },
    {
      skip: !identifier,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  // gestione errori API
  useEffect(() => {
    if (error) {
      const errorMessage =
        error.data?.message || error.error || error.status || error.message;
      if (errorMessage) toast.error(errorMessage);
    }
    if (activityDetailsDataError) {
      const errorMessage =
        activityDetailsDataError.data?.message ||
        activityDetailsDataError.error ||
        activityDetailsDataError.status ||
        activityDetailsDataError.message;
      if (errorMessage) toast.error(errorMessage);
    }
  }, [error, activityDetailsDataError]);

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  // ---------- COSTRUZIONE TABS ----------
  const [allActitvitySubCategoryTab, setallActitvitySubCategoryTab] = useState(
    []
  );
  const [activeTab, setActiveTab] = useState([]);

  useEffect(() => {
    if (data?.data?.activity_category) {
      const categories = data.data.activity_category.map(item => ({
        id: item.id,
        title: item.name,
        items: item.activity_sub_category.length,
        contents: item.activity_sub_category.map(sub => ({
          id: `${sub.id}`,
          image: `${sub?.image}`,
          title: sub?.title,
          duration: sub?.time,
          slug: sub?.slug, // 👈 ok tenerlo, ma il link lo gestisce la card
        })),
      }));

      setallActitvitySubCategoryTab(categories);
      setActiveTab(categories[0]);
    }
  }, [data]);

  const heroData = data?.data?.activity_details?.[0]?.activity;

  // ---------- RETURN CONDIZIONALI (dopo tutti gli hook) ----------

  // se ancora non ho l'identifier
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
    return <ErrorPage />;
  }

  // loading principale dati categoria
  if (isLoading || isActivityLoading) {
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

  if (!heroData) {
    return <ErrorPage />;
  }

  // ---------- UI ----------
  return (
    <HelmetComponent
      title={metaData?.title}
      description={metaData?.description}
    >
      <div>
        <CommonHeroBanner
          bg={`${imgBaseurl}/${heroData?.image}`}
          title={heroData?.name}
          italic={t("activities")}
        />

        <section className="2xl:my-20 md:my-10 mt-10 container">
          {/* title */}
          <div>
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-editorsNoteNormal text-center text-primary">
              {heroData?.name}{" "}
              <span className="font-editorsNoteItalic">{t("activities")}</span>
            </h2>
          </div>

          {/* details */}
          <div className="w-full flex flex-col md:flex-col lg:flex-col xl:flex-row md:gap-[400px] gap-[340px] xs:gap-[350px] sm:gap-[350px] lg:gap-[450px] xl:gap-[35px] 2xl:gap-[56px] lg:mt-[60px] md:mt-6 mt-4 items-stretch">
            <ActivitiesSubcategoryLeftDescription
              bgImg={`${imgBaseurl}/${data?.data?.activity_details[0]?.image}`}
            />

            <ActivitiesSubcategoryRightDescription
              data={data?.data?.activity_details[0]}
            />
          </div>

          {/* tab section */}
          <div className="xl:my-20 mt-5 md:mt-8 lg:mt-8">
            <div>
              <h2 className="text-3xl text-primary font-editorsNoteNormal">
                {t("see")} {heroData?.name} {t("activitiesByYourself")}
              </h2>
            </div>

            <div className="xl:grid xl:grid-cols-8 gap-8 mt-4 md:mt-5 xl:mt-10">
              {/* tabs */}
              <div className="flex flex-col gap-5 col-span-2">
                {allActitvitySubCategoryTab?.map(tab => (
                  <ActivitiesSubcategoryTab
                    key={tab?.id}
                    tab={tab}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                ))}
              </div>

              {/* contents */}
              <div className="grid md:grid-cols-2 md:gap-2 gap-5 col-span-6 my-8 xl:my-0">
                {activeTab?.contents?.map(item => (
                  <ActivitiesSubcategoryCard item={item} key={item?.id} categorySlug={categorySlug} />
                ))}
              </div>
            </div>
          </div>

          <div className="xl:my-20 mt-5 md:mt-8 lg:mt-8">
            <DestinationDetailsSlider
              destinationSuggestions={activityDetailsData?.data}
              title={heroData?.name}
              isViewAll={false}
            />
          </div>
        </section>
      </div>
    </HelmetComponent>
  );
};

export default ActivitiesSubcategory;
