/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DurationSvg, LinkSvg } from "../SvgContainer/SvgContainer";
import map from "../../../assets/images/card-map.png";
import { useTranslation } from "react-i18next";

const DestinationCard = ({ item, destinationSlug: destinationSlugProp }) => {
  const [showExplore, setShowExplore] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const imgBaseUrl = import.meta.env.VITE_SERVER_URL;

  // 🔹 slug del tour (da trip-packages)
  const tripSlug =
    item?.slug ||
    item?.trip_slug ||
    item?.tripSlug ||
    null;

  // 🔹 slug della destinazione: CI FIDIAMO della prop (arriva dal tab attivo)
  const destinationSlug =
    destinationSlugProp ||
    item?.destinationSlug ||
    item?.destination_slug ||
    item?.destination?.slug ||
    null;

  // 🔗 Costruisco l'URL:
  // 1) se ho destinationSlug + tripSlug → SEO URL /destinazione-alaska/tour-classic-alaska-8
  // 2) altrimenti fallback vecchio /tour-list-details/:id
  const hasSeoUrl = destinationSlug && tripSlug;
  const linkTo = hasSeoUrl
    ? `/${destinationSlug}/${tripSlug}`
    : `/tour-list-details/${item?.id}`;

  return (
    <div
      onClick={() => {
        navigate(linkTo);
      }}
      onMouseEnter={() => setShowExplore(true)}
      onMouseLeave={() => setShowExplore(false)}
      className="h-[300px] xl:h-[350px] 3xl:h-[550px] group font-interTight cursor-pointer text-white px-5 flex items-end relative"
      style={{
        background: `linear-gradient(180deg, rgba(30, 48, 63, 0.00) 41.29%, rgba(0, 0, 0, 0.52) 77.46%), url(${imgBaseUrl}/${item?.trip_package_image})`,
        backgroundSize: "cover",
        backgroundPosition: "40% 60%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="pb-8 space-y-2">
        <div className="space-y-1">
          <h3 className="text-xl 3xl:text-2xl">{item?.trip_package_title}</h3>
          <h4 className="text-xl 3xl:text-2xl">€{item?.package_price}</h4>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <DurationSvg />
          <span>{item?.duration}</span>
        </div>
      </div>

      {/* explore button */}
      <Link
        to={linkTo}
        className={`bg-black/20 backdrop-blur-sm px-3 py-1 absolute top-5 right-5 flex items-center gap-1 text-sm transition-all duration-300 ${
          showExplore ? "opacity-100" : "opacity-0"
        }`}
      >
        {t("explorebuttons.explore")} <LinkSvg />
      </Link>

      {/* map */}
      {item?.mapBg && (
        <div className="absolute top-4 left-5">
          <img src={map} alt={item?.image_alt_txt} />
        </div>
      )}
    </div>
  );
};

export default DestinationCard;
