/* eslint-disable react/prop-types */
import { useState } from "react";
import PlacesToVisitCard from "../common/Cards/PlacesToVisitCard";
import { useTranslation, Trans } from "react-i18next";

const DestinationPlacesToVisit = ({ placesToVisitInfo }) => {
  const imgBaseurl = import.meta.env.VITE_SERVER_URL;
  const { t } = useTranslation();

  console.log(placesToVisitInfo, "this is the places info");

  console.log(
    placesToVisitInfo?.destination_details?.destination_detail_maps,
    "this is the places info"
  );

  return (
    <div
      id="places-to-visit"
      className="flex flex-col lg:my-0 2xl:flex-row md:gap-12 gap-10"
    >
      {/* Tabs Section */}
      <div className="w-full 2xl:flex flex-col gap-y-5 items-center px-4 sm:px-0">
        <h4 className="text-3xl font-editorsNoteNormal text-primary mb-6 text-center">
          {t("destination1.mapTitle", { name: placesToVisitInfo?.name })}
        </h4>

        {/* Map Image Section */}
        <div className="w-full sm:w-[650px] relative mb-6">
          <img
            src={`${imgBaseurl}/${placesToVisitInfo?.destination_details?.map}`}
            alt="Map not found"
            className="object-cover w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[814px] max-h-[814px] rounded-lg"
          />
        </div>

        {/* Buttons for Places */}
        <div className="flex flex-wrap w-full justify-center gap-3">
          {placesToVisitInfo?.destination_details?.destination_detail_maps.map(
            (item, idx) => (
              <button
                onClick={() => {
                  window.open(item?.map_url, "_blank");
                }}
                className="bg-secondary px-6 py-2 sm:px-7 sm:py-3 font-interTight text-white font-semibold transition-all duration-300 hover:bg-white border border-secondary hover:text-secondary text-sm sm:text-base"
                key={idx}
              >
                {item?.name}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationPlacesToVisit;
