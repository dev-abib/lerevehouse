import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import DestinationCard from "@/components/common/Cards/DestinationCard";
import {
  NextSlideSvg,
  PrevSlideSvg,
} from "@/components/common/SvgContainer/SvgContainer";
import { useMemo, useState } from "react";
import {
  useGetSmartOfferDataQuery,
  useGetAllMenuSubMenuDataQuery, // <-- hook reale
} from "@/Redux/features/api/apiSlice";
import { useTranslation } from "react-i18next";

const SmartOffersSection = ({ title }) => {
  const { t, i18n } = useTranslation();

  // 🔹 lingua corrente normalizzata
  const currentLang = i18n.language?.startsWith("it") ? "it" : "en";
  console.log("🌍 [SmartOffers] currentLang:", currentLang);

  // 🔹 smart offers (se l’API accetta lan, puoi passare currentLang al posto di undefined)
  const { data } = useGetSmartOfferDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // 🔹 menu per recuperare gli slug delle destinazioni nella lingua corretta
  const {
    data: menuData,
    error: menuError,
    isLoading: menuLoading,
  } = useGetAllMenuSubMenuDataQuery(currentLang, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [swiperRef, setSwiperRef] = useState(null);

  // 🗺 mappa { destination_id: slug } tipo { 1: "destinazione-alaska", ... }
  const destinationSlugMap = useMemo(() => {
    if (!menuData?.data) return {};

    console.log("🍽 [SmartOffers] RAW MENU DATA:", menuData.data);

    const destinationCategory = menuData.data.find(cat => {
      const c = cat.category?.toLowerCase();
      return (
        c === "destinazione" ||
        c === "guida turistica" ||
        c === "destination" ||
        c === "tourist guide"
      );
    });

    if (!destinationCategory) {
      console.warn(
        "⚠️ [SmartOffers] Nessuna categoria 'destinazione/destination' trovata nel menu"
      );
      return {};
    }

    const map = {};
    destinationCategory.subCatgoryArr?.forEach(sub => {
      // id: 1 → slug localizzato (IT o EN)
      map[sub.id] = sub.slug;
    });

    console.log("🗺 [SmartOffers] destinationSlugMap:", map);
    return map;
  }, [menuData?.data]);

  const smartOffers = data?.data || [];
  console.log("🔥 [SmartOffers] raw smartOffers:", smartOffers);

  return (
    <section className="container flex flex-col gap-y-[40px] lg:gap-y-[60px] mx-auto px-4 lg:px-8 2xl:px-16 3xl:px-32 py-10 2xl:py-20">
      {/* title */}
      <div>
        <h2
          className="text-center text-4xl xl:text-5xl font-editorsNoteNormal text-primary"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>

      {/* sliders */}
      <div className="relative">
        <Swiper
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={true}
          spaceBetween={20}
          onSwiper={setSwiperRef}
          className="mySwiper"
        >
          {smartOffers.map(item => {
            console.log("➡️ [SmartOffers] raw item:", item);

            const destinationSlug =
              item?.destinationSlug ||
              item?.destination_slug ||
              item?.destination?.slug ||
              destinationSlugMap[item.destination_id] || // <- da menu localizzato
              null;

            const tripSlug =
              item?.tripSlug ||
              item?.slug ||
              item?.trip_slug ||
              null;

            const enhancedItem = {
              ...item,
              destinationSlug,
              tripSlug,
            };

            console.log("🧩 [SmartOffers] enhancedItem:", enhancedItem);

            return (
              <SwiperSlide
                key={
                  item?.id ||
                  item?.trip_package_title ||
                  item?.destinationTitle
                }
              >
                <DestinationCard item={enhancedItem} />
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* slider navigation */}
        <button
          onClick={() => swiperRef?.slidePrev()}
          className="size-10 bg-white shadow-md rounded-full flex items-center justify-center absolute top-1/2 -left-4 lg:-left-8 z-20"
        >
          <PrevSlideSvg />
        </button>
        <button
          onClick={() => swiperRef?.slideNext()}
          className="size-10 bg-white shadow-md rounded-full flex items-center justify-center absolute top-1/2 -right-4 lg:-right-8 z-20"
        >
          <NextSlideSvg />
        </button>
      </div>
    </section>
  );
};

export default SmartOffersSection;
