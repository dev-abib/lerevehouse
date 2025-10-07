/* eslint-disable react/prop-types */
import PlacesToVisitCard from "../common/Cards/PlacesToVisitCard";
import { useTranslation, Trans } from "react-i18next";

const DestinationPlacesToVisit = ({ placesToVisitInfo }) => {
  const imgBaseurl = import.meta.env.VITE_SERVER_URL;
  const { t } = useTranslation();

  console.log(placesToVisitInfo, "this is the places info");

  return (
    <div
      id="places-to-visit"
      className="flex flex-col lg:my-0 2xl:flex-row md:gap-12 gap-10"
    >
      <div className="hidden w-full 2xl:flex flex-col gap-y-[95px] items-center">
        <h4 className="text-3xl font-editorsNoteNormal text-primary">
          {t("destination1.mapTitle", { name: placesToVisitInfo?.name })}
        </h4>
        <div className="w-[650px] relative">
          <img
            src={`${imgBaseurl}/${placesToVisitInfo?.destination_details?.map}`}
            alt="not found"
            className="object-cover w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[814px] max-h-[814px] rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default DestinationPlacesToVisit;
