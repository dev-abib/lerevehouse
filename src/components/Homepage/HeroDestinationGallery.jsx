import { useState } from "react";
import { useTranslation } from "react-i18next";
import DestinationCard from "../common/Cards/DestinationCard";

const HeroDestinationGallery = ({ tabContents, destinationSlug }) => {
  const [isShowMore, setIsShowMore] = useState(false);
  const { t } = useTranslation();

  if (!Array.isArray(tabContents)) return null;

  const displayedItems = isShowMore ? tabContents : tabContents.slice(0, 6);

  return (
    <div className="flex flex-col gap-y-5 w-full items-center">
      <div className="grid w-full grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-8 mt-10">
        {displayedItems.map((item) => (
          <DestinationCard
            key={item?.id}
            item={item}
            destinationSlug={destinationSlug}
          />
        ))}
      </div>

      {tabContents.length > 6 && (
        <button
          onClick={() => setIsShowMore((prev) => !prev)}
          className="bg-secondary max-w-[268px] px-7 py-3 font-interTight text-white font-semibold transition-all duration-300 hover:bg-white border border-secondary hover:text-secondary"
        >
          {isShowMore ? t("see_less") : t("show_more")}
        </button>
      )}
    </div>
  );
};

export default HeroDestinationGallery;
