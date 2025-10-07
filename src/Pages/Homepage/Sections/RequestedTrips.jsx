import bg1 from "@/assets/images/bg1.png";
import bg2 from "@/assets/images/bg2.png";
import bg3 from "@/assets/images/bg3.png";
import bg4 from "@/assets/images/bg4.png";
import { useGetRequestedTripsQuery } from "@/Redux/features/api/apiSlice";
import RequestedTripCard from "@/components/common/Cards/RequestedTripCard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const RequestedTrips = ({ title }) => {
  const { t } = useTranslation();

  const { data, error, isLoading } = useGetRequestedTripsQuery(undefined, {
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

  useEffect(() => {
    if (!data?.data) return;

    const processed = data.data.map((item, idx) => {
      console.log(item);

      const newData = {
        id: item?.destination_id,
        image: item?.trip_package_image,
        image_alt_txt: item?.image_alt_txt,
        title: item?.trip_package_title || null,
        description: getLimitedDescription(item?.trip_detail?.description),
      };

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

      return newData;
    });

    setSanitizedData(processed);
  }, [data?.data]);

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
          <RequestedTripCard idx={idx} key={item?.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default RequestedTrips;
