import {
  useGetAcitivityDatasQuery,
  useGetAllTravelStylesDataQuery,
} from "@/Redux/features/api/apiSlice";
import TravelExploreCard from "../TravelStyles/TravelExploreCard";
import { InfinitySpin } from "react-loader-spinner";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BrowseThings = ({ title }) => {
  const { t } = useTranslation();
  const { data, error, isLoading } = useGetAllTravelStylesDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: allActivityData,
    error: allActivityError,
    isLoading: isActivityLoading,
  } = useGetAcitivityDatasQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const location = useLocation();

  if (isLoading) {
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

  if (error) {
    const errorMessage =
      error.data?.message || error.error || error.status || error.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

  return (
    <section className="2xl:py-20 md:py-0 py-1">
      <div className="container">
        <div className="2x:mb-[60px] mb-7 md:mb-10">
          <h3 className="title--xxl text-center">{title}</h3>
        </div>
        <div>
          <div className="grid lg:grid-cols-3 gap-5">
            {(location.pathname === "/activities"
              ? allActivityData?.data
              : data?.data
            )?.map(item => (
              <TravelExploreCard
                link="/activities-details/"
                key={item.id}
                item={item}
                travelMode="activity"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseThings;
