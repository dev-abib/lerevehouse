/* eslint-disable react/prop-types */
import { ClockSvg } from "../SvgContainer/SvgContainer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const slugify = str =>
  String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")      // spazi/underscore → -
    .replace(/[^a-z0-9-]/g, "")   // rimuove caratteri strani
    .replace(/-+/g, "-");         // comprime -- multipli

const TravelListCard = ({ item, destinationSlug }) => {
  const { t } = useTranslation();

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  const buildSeoUrl = () => {
    const id = item?.id;

    // se non abbiamo l'id, evitiamo di fare magie → fallback diretto
    if (!id) {
      return `/tour-list-details/${item?.id ?? ""}`;
    }

    // se non abbiamo destinationSlug, usiamo il vecchio permalink
    if (!destinationSlug) {
      return `/tour-list-details/${id}`;
    }

    let slug = item?.slug || null;

    if (slug) {
      // se lo slug NON termina con -numero, aggiungo l'id
      if (!/-\d+$/.test(slug)) {
        slug = `${slug}-${id}`;
      }
    } else {
      // nessuno slug dall'API → lo creo dal titolo
      const titleForSlug =
        item?.trip_package_title ||
        item?.trip_title ||
        item?.name ||
        "";

      if (!titleForSlug) {
        // non abbiamo abbastanza info → vecchio permalink
        return `/tour-list-details/${id}`;
      }

      const baseSlug = slugify(titleForSlug);
      slug = `${baseSlug}-${id}`;
    }

    return `/${destinationSlug}/${slug}`;
  };

  const seoUrl = buildSeoUrl();

  return (
    <div className="px-4 py-5 font-interTight group bg-[#f4f4f4]">
      <div className="w-full h-[150px] lg:h-[200px] xl:h-72 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
          src={`${imgBaseurl}/${item?.trip_package_image}`}
          alt={item?.image_alt_txt}
        />
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <ClockSvg />
          <span className="font-semibold text-sm lg:text-base text-primary">
            {t("travelCard.dayTrip", { count: item?.duration })}
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="text-lg lg:text-xl font-semibold">
            {item?.trip_package_title}
          </h4>
        </div>

        <div className="w-full flex items-center justify-between pt-3">
          <span className="text-primary text-sm lg:text-base font-semibold">
            ${item?.package_price}
          </span>

          <Link
            to={seoUrl}
            className="bg-primary px-4 py-2 text-white text-xs lg:text-sm border border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
          >
            {t("travelCard.viewTour")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TravelListCard;
