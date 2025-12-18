/* eslint-disable react/prop-types */
import { LinkSvgSlider } from "../SvgContainer/SvgContainer";
import { Link } from "react-router-dom";

const ExtraOrdinaryHomepageSlider = ({ destination, slug }) => {
  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  // Se ho lo slug (IT: /destinazione-alaska, EN: /alaska-destination)
  // lo uso. Altrimenti fallback alla rotta vecchia con id.
  const linkTo = slug
    ? `/${slug}`
    : `/destination-details/${destination?.id}`;

  return (
    <div className="relative h-[300px] lg:h-[500px] w-[220px] lg:w-[350px] overflow-hidden">
      {/* Main image */}
      <img
        src={`${imgBaseurl}/${destination?.image}`}
        alt={destination?.image_alt_txt}
        className="h-full w-full object-cover"
      />

      {/* Overlay content */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <Link
          to={linkTo}
          className="flex items-center gap-2 font-interTight text-base md:text-lg lg:text-xl px-2 text-white"
        >
          <h5 className="uppercase">{destination?.name}</h5>
          <span>
            <LinkSvgSlider />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ExtraOrdinaryHomepageSlider;
