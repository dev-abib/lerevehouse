import CommonHeroBanner from "@/components/common/HeroBanner/CommonHeroBanner";
import React, { useEffect, useState } from "react";
import MapSection from "./Sections/MapSection";
import ConsultCard from "@/components/common/Cards/ConsultCard";
import { useLocation, useParams } from "react-router-dom";
import { useGetSingleTourDetailsQuery } from "@/Redux/features/api/apiSlice";
import { InfinitySpin } from "react-loader-spinner";
import toast from "react-hot-toast";
import { Link } from "react-scroll";
import { useTranslation } from "react-i18next";

const SingleCanadaTour = () => {
  const [activeTab, setactiveTab] = useState("");
  const [allTabs, setallTabs] = useState([]);

  // 👇 new: prendo id e slug dall'URL tipo /tour-guides/1/the-boundless-north
  const { id: idParam, slug } = useParams();

  // 👇 fallback per vecchi link /tour-guides?id=1
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const idQuery = queryParams.get("id");

  // id effettivo usato per la chiamata API
  const id = idParam || idQuery || "";

  const { t } = useTranslation();

  const { data, error, isLoading } = useGetSingleTourDetailsQuery(id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (data?.data?.place) {
      const placeNames = data.data.place.map(place => place?.name);
      setallTabs(placeNames);
      setactiveTab(data.data.place[0]?.name);
    }
  }, [data?.data?.place]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        error.data?.message || error.error || error.status || error.message;
      if (errorMessage) toast.error(errorMessage);
    }
  }, [error]);

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

  if (!data?.data) {
    return null; // oppure una ErrorPage
  }

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  return (
    <section className="mt-10 flex flex-col">
      <CommonHeroBanner
        title={data.data.title}
        italic={false}
        subTittle={data.data.sub_title}
        bg={`${imgBaseurl}/${data.data.image}`}
        altTxt={data.data.image_alt_txt}
      />

      <div className="flex flex-col 4xl:pt-[110px] xl:pt-12 lg:pt-8 2xl:gap-y-[108px] gap-y-14">
        <MapSection data={data.data.tourist_guide_details} />

        <div className="flex flex-col">
          <div>
            <div className="flex items-center border-t shadow-lg shadow-[rgba(0,0,0,0.7)] bg-white border-solid h-[75px] justify-center">
              <span className="text-[#1687C7] text-[18px] font-semibold leading-[150%] tracking-[1px] font-interTight">
                {t("consult")}
              </span>
            </div>

            <div className="sticky top-[145px] py-5 z-0 flex flex-row flex-wrap items-center justify-evenly md:justify-start h-auto gap-x-3 bg-[#1687C7] lg:px-[180px] px-2">
              {allTabs.map((item, index) => (
                <Link
                  key={index}
                  offset={-250}
                  to={item}
                  onClick={() => setactiveTab(item)}
                  className={`${
                    activeTab === item && "bg-[#56C2FF]"
                  } md:px-3 px-1 md:py-4 cursor-pointer py-2 md:h-[59px] text-white`}
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex flex-col py-[30px] md:py-[40px] xl:py-[64px] bg-[#78787836]">
              <div className="container flex flex-col gap-y-[20px] 2xl:gap-y-[64px]">
                {data.data.place?.map((item, index) => (
                  <ConsultCard key={index} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleCanadaTour;
