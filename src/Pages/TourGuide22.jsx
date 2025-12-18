import g1 from "../assets/images/tour-guide/g1.png";
import g2 from "../assets/images/tour-guide/g2.png";
import g3 from "../assets/images/tour-guide/g3.png";
import g4 from "../assets/images/tour-guide/g4.png";
import g5 from "../assets/images/tour-guide/g5.png";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import WhatToDo from "@/components/TourGuide/WhatToDo";
import WhatToEat from "@/components/TourGuide/WhatToEat";
import FestivalsCalendar from "@/components/TourGuide/FestivalsCalendar";
import Map from "@/components/TourGuide/Map";
import WhereToStay from "@/components/TourGuide/WhereToStay";
import { useParams } from "react-router-dom";
import { useTourGuideDataQuery } from "@/Redux/features/api/apiSlice";
import { InfinitySpin } from "react-loader-spinner";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const TourGuide22 = () => {
 const [searchParams] = useSearchParams();
  const idParam = searchParams.get("id");
  const id = Number(idParam);

  if (!id || Number.isNaN(id)) {
    return <ErrorPage />;   // o un fallback decente
  }

  const { data, error, isLoading } = useTourGuideDataQuery(id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

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

  console.log(data);
  

  const whereToStayAllData = {
    whereToStayData: data?.data?.where_to_stay_description,
    whereToStaImage: data?.data?.where_to_stay_image,
  };

  const imgBaseUrl = import.meta.env.VITE_SERVER_URL;

  return (
    <section className="container">
      {/* Tour Gallery */}
      <div className="2xl:mt-44 mt-32 mb-10">
        <figure className="h-[250px] sm:h-[300px] lg:h-[650px]">
          <img
            src={`${imgBaseUrl}/${data?.data?.trip_guide_images[0].image}`}
            alt="g1"
            className="w-full h-full object-cover"
          />
        </figure>
        <div className="grid mt-3 lg:mt-5 lg:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-5">
          {data?.data?.trip_guide_images?.slice(1, 5).map((img, index) => (
            <div key={index} className="h-[250px] sm:h-[300px] lg:h-[350px]">
              <img
                src={`${imgBaseUrl}/${img.image}`}
                alt={`g${index + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tour Guide Tabs */}
      <div className="mb-10">
        <Tabs>
          <TabList className="flex flex-wrap md:flex-row flex-col items-center md:gap-6 gap-3 justify-between md:pb-12 pb-6">
            <Tab
              className="px-4 pb-1 outline-none border-b-2 border-transparent 
               hover:border-light-blue focus:outline-none cursor-pointer text-base xl:text-lg font-medium duration-300"
              selectedClassName="!border-light-blue text-prmiary-blue !border-b-2"
            >
              What to do
            </Tab>
            <Tab
              className="px-4 pb-1 outline-none border-b-2 border-transparent 
               hover:border-light-blue focus:outline-none cursor-pointer text-base xl:text-lg font-medium duration-300"
              selectedClassName="!border-light-blue text-prmiary-blue !border-b-2"
            >
              What to eat
            </Tab>
            <Tab
              className="px-4 pb-1 outline-none border-b-2 border-transparent 
               hover:border-light-blue focus:outline-none cursor-pointer text-base xl:text-lg font-medium duration-300"
              selectedClassName="!border-light-blue text-prmiary-blue !border-b-2"
            >
              Festivals calendar
            </Tab>
            <Tab
              className="px-4 pb-1 outline-none border-b-2 border-transparent 
               hover:border-light-blue focus:outline-none cursor-pointer text-base xl:text-lg font-medium duration-300"
              selectedClassName="!border-light-blue text-prmiary-blue !border-b-2"
            >
              MAP
            </Tab>
            <Tab
              className="px-4 pb-1 outline-none border-b-2 border-transparent 
               hover:border-light-blue focus:outline-none cursor-pointer text-base xl:text-lg font-medium duration-300"
              selectedClassName="!border-light-blue text-prmiary-blue !border-b-2"
            >
              Where to stay
            </Tab>
          </TabList>
          <TabPanel>
            <WhatToDo data={data?.data?.what_to_do} />
          </TabPanel>
          <TabPanel>
            <WhatToEat data={data?.data?.what_to_eat_description} />
          </TabPanel>
          <TabPanel>
            <FestivalsCalendar
              data={data?.data?.festivals_calender_description}
            />
          </TabPanel>
          <TabPanel>
            <Map data={data?.data?.map_url} />
          </TabPanel>
          <TabPanel>
            <WhereToStay data={whereToStayAllData} />
          </TabPanel>
        </Tabs>
      </div>
    </section>
  );
};

export default TourGuide22;
