import bg1 from "@/assets/images/bg1.png";
import bg2 from "@/assets/images/bg2.png";
import bg3 from "@/assets/images/bg3.png";
import bg4 from "@/assets/images/bg4.png";

import {
  useGetRequestedTripsQuery,
  useGetAllMenuSubMenuDataQuery, // <--- hook reale
} from "@/Redux/features/api/apiSlice";

import RequestedTripCard from "@/components/common/Cards/RequestedTripCard";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const bgImages = [bg1, bg2, bg3, bg4];

const RequestedTrips = ({ title }) => {
  const { t, i18n } = useTranslation();

  // 🔹 lingua corrente (normalizzata a 'it' / 'en')
  const currentLang = i18n.language?.startsWith("it") ? "it" : "en";
  console.log("🌍 RequestedTrips currentLang:", currentLang);

  // 👉 TRIPS (meglio se l’API accetta lan; se il tuo hook prende un oggetto, adatta qui)
  const { data, error, isLoading } = useGetRequestedTripsQuery(currentLang, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // 👉 MENU (per costruire la mappa id → slug nella lingua giusta)
  const {
    data: menuData,
    error: menuError,
    isLoading: menuLoading,
  } = useGetAllMenuSubMenuDataQuery(currentLang, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [sanitizedData, setSanitizedData] = useState([]);

  const getLimitedDescription = (desc, wordLimit = 50) => {
    if (!desc) return "";
    const words = desc.split(" ");
    const limitedWords = words.slice(0, wordLimit);
    return limitedWords.join(" ") + (words.length > wordLimit ? "..." : "");
  };

  // 🔹 mappa { destination_id: slug } usando il MENU nella lingua corrente
  const destinationSlugMap = useMemo(() => {
    if (!menuData?.data) return {};

    console.log("🍽 RAW MENU DATA:", menuData.data);

    // gestiamo sia IT che EN
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
        "⚠️ Nessuna categoria 'destinazione/destination' trovata nel menu"
      );
      return {};
    }

    const map = {};
    destinationCategory.subCatgoryArr?.forEach(sub => {
      // id: 1 → slug es. "destinazione-alaska" (IT) o "alaska-destination" (EN)
      map[sub.id] = sub.slug;
    });

    console.log("🗺 destinationSlugMap costruita dal menu:", map);
    return map;
  }, [menuData?.data]);

  useEffect(() => {
    if (!data?.data) return;

    console.log("🔥 RAW RequestedTrips data:", data.data);

    const processed = data.data.map((item, idx) => {
      console.log("➡️ RequestedTrip raw item:", item);

      const destinationSlug = destinationSlugMap[item.destination_id] || null;
      const tripSlug = item.slug || null;

      const newData = {
        id: item.id, // id del pacchetto (serve al fallback)
        destinationId: item.destination_id,
        destinationSlug, // es. IT: "destinazione-alaska" | EN: "alaska-destination"
        tripSlug,        // es. "tour-classic-alaska-1"
        image: item.trip_package_image,
        image_alt_txt: item.image_alt_txt,
        title: item.trip_package_title || null,
        description: getLimitedDescription(item?.trip_detail?.description),

        bgImage: bgImages[idx % bgImages.length],
      };

      // layout / colori come prima
      if (idx === 0) {
        newData.bgColor = "#002B4D";
        newData.type = "horizontal";
      } else if (idx === 1) {
        newData.bgColor = "#455C01";
        newData.type = "vertical";
      } else if (idx === 2) {
        newData.bgColor = "#271000";
        newData.type = "vertical";
      } else if (idx === 3) {
        newData.bgColor = "#C54F05";
        newData.type = "horizontal";
      }

      console.log("🧩 SANITIZED item:", newData);
      return newData;
    });

    console.log("✅ FINAL sanitizedData:", processed);
    setSanitizedData(processed);
  }, [data?.data, destinationSlugMap]);

  return (
    <section className="bg-[#E8F3FA] flex flex-col py-10 2xl:py-20">
      {/* Title */}
      <div>
        <h2 className="text-center text-3xl 2xl:text-5xl font-editorsNoteNormal text-primary">
          {title}
        </h2>
      </div>

      {/* Cards */}
      <div className="mt-8 2xl:mt-16 grid grid-cols-6 gap-6 container mx-auto px-4 lg:px-8 2xl:px-16 3xl:px-32">
        {sanitizedData?.map((item, idx) => (
          <RequestedTripCard
            idx={idx}
            key={`${item?.id}-${idx}`}
            item={item}
          />
        ))}
      </div>
    </section>
  );
};

export default RequestedTrips;
