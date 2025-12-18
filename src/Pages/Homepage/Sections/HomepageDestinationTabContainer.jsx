import HeroDestinationGallery from "@/components/Homepage/HeroDestinationGallery";
import HeroDestinationTab from "@/components/Homepage/HeroDestinationTab";
import { useEffect, useState } from "react";
import {
  useTripPackagesQuery,
  useAllPackagesQuery,
} from "@/Redux/features/api/apiSlice";

const HomepageDestinationTabContainer = () => {
  const [activeTab, setActiveTab] = useState(1);

  const { data, error, isLoading } = useTripPackagesQuery(activeTab?.id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: tabData,
    error: tabError,
    isLoading: isTablLoading,
  } = useAllPackagesQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const TabData = tabData?.data || [];

  useEffect(() => {
    if (TabData.length > 0) {
      setActiveTab(TabData[0]); // tab = oggetto destination
    }
  }, [TabData]);

  // 👉 qui estraiamo lo slug della destination dal tab attivo
  const destinationSlug =
    activeTab?.slug ||
    activeTab?.destination_slug ||
    activeTab?.destinationSlug ||
    activeTab?.destination?.slug ||
    null;

  return (
    <div className="mt-5 container mx-auto px-4 text-lg lg:text-xl lg:px-8 2xl:px-16 3xl:px-32">
      <HeroDestinationTab
        tabs={TabData}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      <HeroDestinationGallery
        tabContents={data?.data || []}
        destinationSlug={destinationSlug}
      />
    </div>
  );
};

export default HomepageDestinationTabContainer;
