import React, { useEffect, useState, useMemo } from "react";
import CommonHeroBanner from "@/components/common/HeroBanner/CommonHeroBanner";
import TourAutoTabSection from "../TourAutoCanada/Sections/TourAutoTabSection/TourAutoTabSection";
import TestModal from "@/components/Modals/TestModal";
import { Modal } from "@/components/Modals/Modal";
import {
  useGetTransportationPageDetailsDataQuery,
  useMetaDetailsDataMutation,
  useGetAllMenuSubMenuDataQuery, // ⬅️ AGGIUNTO
} from "@/Redux/features/api/apiSlice";
import { useParams } from "react-router-dom";
import HelmetComponent from "@/components/Helmet/Helmet";
import { useTranslation } from "react-i18next";
import { InfinitySpin } from "react-loader-spinner"; // ⬅️ AGGIUNTO
import ErrorPage from "@/Pages/ErrroPage/ErrorPage";  // ⬅️ AGGIUNTO

const TourWithCar = () => {
  const { t } = useTranslation();
  const [metaDetailsData] = useMetaDetailsDataMutation();
  const [metaData, setMetaData] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // 👇 ARRIVI QUI SIA DA:
  // - /road-tour-details/:id
  // - /road-tour-details/:id/:slug
  // - /:slug  (es. /self-drive-tour-in-canada -> SlugResolver -> TourWithCar)
  const { id: routeId, slug } = useParams();

  // ---------- MENU: per risolvere slug → id (caso /self-drive-tour-in-canada) ----------
  const {
    data: menuData,
    isLoading: isMenuLoading,
    error: menuError,
  } = useGetAllMenuSubMenuDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // id numerico? (vecchie route) es. "1"
  const isNumericId = routeId && /^\d+$/.test(routeId);

  // identifier viene calcolato in useMemo per NON violare le regole degli hook
  const identifier = useMemo(() => {
    // 1) se ho id numerico dalla route → uso quello (vecchie URL)
    if (isNumericId) {
      return routeId;
    }

    // 2) se arrivo da /self-drive-tour-in-canada → devo mappare slug → id
    if (slug && menuData?.data) {
      const transportationCategory = menuData.data.find(
        cat =>
          cat.redirectLink === "/tour-mezi" ||
          (cat.category || "").toLowerCase().includes("transportation")
      );

      const match = transportationCategory?.subCatgoryArr?.find(
        item => item.slug === slug
      );

      if (match?.id) {
        return String(match.id);
      }
    }

    // 3) non trovato
    return null;
  }, [isNumericId, routeId, slug, menuData]);

  // ---------- META ----------
  useEffect(() => {
    metaDetailsData("transportation_details")
      .unwrap()
      .then(res => setMetaData(res?.data))
      .catch(console.error);
  }, [metaDetailsData]);

  // ---------- QUERY DETTAGLIO ROAD TOUR ----------
  const {
    data,
    error,
    isLoading,
  } = useGetTransportationPageDetailsDataQuery(identifier || "default", {
    skip: !identifier, // ⬅️ NON chiama l'API finché non abbiamo un id valido
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const imgBaseUrl = import.meta.env.VITE_SERVER_URL;
  const details = data?.data?.transportations_details;

  const priceArray = [
    data?.data?.transportation_prices?.single,
    data?.data?.transportation_prices?.double,
    data?.data?.transportation_prices?.triple,
    data?.data?.transportation_prices?.quadruple,
  ];

  useEffect(() => {
    if (data?.data?.transportation_mediums?.[0]?.id) {
      setSelectedVehicle(data.data.transportation_mediums[0].id);
    }
  }, [data]);

  // ---------- RETURN CONDIZIONALI (DOPO TUTTI GLI HOOK) ----------

  // Se ancora non abbiamo capito che tour mostrare
  if (!identifier) {
    // se stiamo ancora caricando il menu, mostra loader
    if (isMenuLoading) {
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
    // menu finito ma nessun match → 404
    return <ErrorPage />;
  }

  // loading dati road tour
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

  // se per qualche motivo l'API non ritorna data
  if (!data?.data) {
    return <ErrorPage />;
  }

  // ---------- UI (la tua, invariata) ----------
  return (
    <HelmetComponent
      title={metaData?.title}
      description={metaData?.description}
    >
      <Modal open={open} setOpen={setOpen}>
        <TestModal setOpen={setOpen} />
      </Modal>

      <section className="mt-10">
        <CommonHeroBanner
          bg={`${imgBaseUrl}/${data?.data?.image}`}
          title={data?.data?.title}
          altTxt={data?.data?.image_alt_txt}
        />

        <div className="flex flex-col xl:gap-y-[112px] gap-y-10 py-4 container">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col md:gap-y-[60px] gap-y-8">
              <div className="flex flex-col xl:flex-row md:justify-between justify-center items-center gap-5 xl:gap-0">
                {["length", "duration", "startingFrom"].map((key, idx) => (
                  <div
                    key={idx}
                    className="flex flex-row 2xl:gap-x-[197.1px] items-center"
                  >
                    <div className="flex flex-col 2xl:gap-y-3 items-center">
                      <h4 className="text-[#004265] font-interTight text-base leading-[160%] font-semibold">
                        {t(`transport.${key}`)}
                      </h4>
                      <span className="text-[#565656] font-interTight text-base leading-[160%] font-semibold">
                        {details?.[key]}
                      </span>
                    </div>
                    <span className="hidden 2xl:block w-[1px] h-[64px] bg-[#0000001F]" />
                  </div>
                ))}
                <button
                  onClick={() => setOpen(true)}
                  className="xl:px-[61px] px-8 xl:py-5 py-3 rounded-[5px] bg-[#1687C7] text-sm md:text-xs font-medium leading-[120%] font-interTight text-white border border-transparent transition duration-500 hover:bg-transparent hover:border-[#1687C7] hover:text-[#1687C7]"
                >
                  {t("transport.makeAnEnquiry")}
                </button>
              </div>

              <div className="flex flex-col md:gap-y-6 gap-y-3">
                <div className="flex flex-col gap-y-2">
                  <h2 className="text-[#004265] font-fontSpring text-3xl 2xl:text-[48px] leading-[120%] font-light">
                    {t("transport.bookYour", { title: data?.data?.title })}
                  </h2>
                  <span className="text-[#004265] font-interTight text-xl leading-[150%] font-medium">
                    {details?.title}
                  </span>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: details?.description }}
                  className="text-[#565656] max-w-[1328px] font-interTight text-sm md:text-lg md:leading-[150%] leading-6 font-normal"
                />
              </div>

              <div className="flex flex-col gap-y-6 w-full items-center">
                <span className="text-[#004265] text-lg font-medium leading-[120%]">
                  {t("transport.prices")}
                </span>
                <hr className="w-full h-[2px] bg-[#004265] rounded-[12px]" />
                <h5 className="text-[#004265] font-fontSpring text-4xl md:text-[48px] font-light leading-[120%]">
                  {t("transport.tourPrices")}
                </h5>

                <div className="flex flex-col w-full relative items-center">
                  <div className="bg-RgbaBlue w-full py-3 flex flex-row gap-x-6">
                    <div className="lg:w-[438px]" />
                    <div className="flex flex-row justify-around w-full">
                      {["single", "double", "triple", "quadruple"].map(
                        (key, idx) => (
                          <span
                            key={idx}
                            className="max-w-[267px] capitalize text-[#252525] font-interTight text-[18px] leading-[120%] font-medium"
                          >
                            {t(`transport.${key}`)}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="border-[2px] border-RgbaBlue w-full py-3 flex md:flex-row flex-col px-2 md:px-0">
                    <div className="lg:w-[428px] md:w-[80%] flex items-center lg:justify-center">
                      <h4 className="text-[#004265] font-interTight text-base md:text-[22px] 2xl:text-[32px] leading-[120%] font-medium hidden lg:block">
                        {t("transport.startingFrom")}
                      </h4>
                    </div>
                    <div className="flex justify-around w-full">
                      {priceArray.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[#252525] font-interTight text-base md:text-[22px] 2xl:text-[32px] leading-[120%] font-medium"
                        >
                          € {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-5">
                  {data?.data.transportation_mediums?.map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedVehicle(item.id)}
                        className={`flex py-2 flex-col w-full max-w-[500px] items-center gap-y-6 cursor-pointer transition border ${
                          item.id === selectedVehicle
                            ? "border-[#1687C7]"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={`${imgBaseUrl}/${item?.image}`}
                          className="w-full h-[192px] object-cover"
                          alt={item?.image_alt_txt}
                        />
                        <div className="flex flex-col gap-y-3 items-center">
                          <h2 className="text-[#1687C7] text-2xl md:text-[32px] font-interTight">
                            {item?.name}
                          </h2>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item?.description,
                            }}
                            className="text-[#565656] text-center px-2 text-base font-interTight"
                          ></div>
                          <h4 className="text-[#004265] text-xl md:text-[32px] font-interTight">
                            € {item?.price}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[#565656] text-sm md:text-[16px] leading-[150%] text-center font-interTight max-w-[502px]">
                  <div
                    dangerouslySetInnerHTML={{ __html: details?.subtitle }}
                  />
                </div>

                <div className="flex flex-col xl:flex-row w-full gap-8 bg-RgbaBlue p-6">
                  <div className="flex flex-col gap-3">
                    <h4 className="text-[#004265] text-[16px] font-bold font-interTight">
                      {t("transport.whatsIncluded")}
                    </h4>
                    <div
                      dangerouslySetInnerHTML={{ __html: details?.included }}
                      className="text-[#565656] text-sm md:text-[16px] font-interTight"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-[#004265] text-[16px] font-bold font-interTight">
                      {t("transport.whatsNotIncluded")}
                    </h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: details?.not_included,
                      }}
                      className="text-[#565656] text-sm md:text-[16px] font-interTight"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row w-full justify-between items-center gap-6">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: details?.short_description,
                    }}
                    className="text-[#565656] text-sm md:text-[16px] font-interTight w-full max-w-4xl"
                  />
                  <button
                    onClick={() => setOpen(true)}
                    className="w-full md:w-auto px-6 py-4 rounded-[5px] bg-[#1687C7] text-xs font-medium text-white border border-transparent hover:bg-transparent hover:border-[#1687C7] hover:text-[#1687C7]"
                  >
                    {t("transport.makeAnEnquiry")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <TourAutoTabSection data={data?.data?.transportation_ways} />
        </div>
      </section>
    </HelmetComponent>
  );
};

export default TourWithCar;
