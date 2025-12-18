import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  DropDown,
  Location,
  Minus,
  Plus,
} from "../common/SvgContainer/SvgContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItinerary, removeItinerary } from "@/Redux/features/itenariesSlice";
import RecomendedAttractionModal from "../Modals/RecomendedAttractionModal";
import { Modal } from "../Modals/Modal";
import StartYourJourney from "../Modals/StartYourJourney";
import LuxuryCard from "../common/Cards/LuxuryCard";
import { useTranslation } from "react-i18next";

const imgBaseurl = import.meta.env.VITE_SERVER_URL;

const ItenaryIdeaDetails = ({ itenariesData }) => {
  const { t } = useTranslation();
  const [counters, setCounters] = useState({});
  const [openItems, setOpenItems] = useState(["item-0"]);
  const [open, setOpen] = useState(false);
  const [recommendedOpen, setRecommendedOpen] = useState(false);
  const [recomendedAttractionData, setRecomendedAttractionData] =
    useState(null);

  const navigate = useNavigate();
  const { id: tripId } = useParams();
  const dispatch = useDispatch();
  const itineraries = useSelector(state => state.itineraries);

  useEffect(() => {
    const initialCounters = {};
    itineraries.forEach(item => {
      if (item.tripId === tripId) {
        initialCounters[item.id] = item.dayCount || 1;
      }
    });
    setCounters(initialCounters);
  }, [itineraries, tripId]);

  const handleAddItinerary = faq => {
    const itinerary = {
      id: faq.id,
      tripId,
      title: faq.title,
      place_name: faq.place_name,
      sub_title: faq.sub_title,
      image: faq.image,
    };
    dispatch(addItinerary(itinerary));
    setCounters(prev => ({
      ...prev,
      [faq.id]: (prev[faq.id] || 0) + 1,
    }));
  };

  const handleRemoveItinerary = faqId => {
    dispatch(removeItinerary(faqId));
    setCounters(prev => {
      const current = prev[faqId] || 0;
      const newCount = Math.max(current - 1, 0);
      return { ...prev, [faqId]: newCount };
    });
  };

  const expandAll = () => {
    const allItems =
      itenariesData?.allItenareies?.map((_, index) => `item-${index}`) || [];
    setOpenItems(allItems);
  };

  const closeAll = () => {
    setOpenItems([]);
  };
  
  

  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        <RecomendedAttractionModal
          setOpen={setOpen}
          modalData={recomendedAttractionData}
        />
      </Modal>

      <Modal open={recommendedOpen} setOpen={setRecommendedOpen}>
        <StartYourJourney setOpen={setRecommendedOpen} />
      </Modal>

      <section
        id="itinerary-plan"
        className="flex flex-col z-[0] my-14 gap-y-5 lg:gap-y-10"
      >
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-4 xl:flex-row justify-between items-center">
            <h3 className="text-primary text-[34px] flex-shrink-0 font-normal leading-[120%] font-editorsNoteNormal">
              {t("itinerary.title")}
            </h3>
            <div className="flex flex-row w-full justify-end gap-x-4">
              <span
                onClick={closeAll}
                className="text-2xl font-normal text-[#004265] leading-[120%] font-editorsNoteNormal cursor-pointer"
              >
                {t("itinerary.closeAll")}
              </span>
              <span
                onClick={expandAll}
                className="text-2xl font-normal text-[#004265] leading-[120%] font-editorsNoteNormal cursor-pointer"
              >
                {t("itinerary.expandAll")}
              </span>
            </div>
          </div>
          <span className="text-text-gray text-base lg:text-xl leading-[150%] font-medium">
            {itenariesData?.itenareiesSubTittle}
          </span>
        </div>

        <div className="w-full z-[0] font-interTight">
          <Accordion
            type="multiple"
            className="w-full flex flex-col gap-y-4 lg:gap-y-8"
            value={openItems}
            onValueChange={setOpenItems}
          >
            {itenariesData?.allItenareies?.map((faq, index) => (
              <AccordionItem
                className="border-[1px] border-solid border-[#0000001F]"
                key={`${tripId}-${faq.id}`}
                value={`item-${index}`}
              >
                <AccordionTrigger className="text-xl w-full text-[#3E3E3E] hover:no-underline">
                  <div className="flex flex-row w-full justify-between p-3">
                    <div className="flex flex-row gap-x-2 items-center">
                      <div className="text-sm xl:text-xl font-normal leading-[123%] whitespace-nowrap px-4 py-2 text-primary bg-[#F4F4F4]">
                        {faq?.day}
                      </div>
                      <span className="text-sm xl:text-lg text-primary font-medium leading-[150%]">
                        {faq?.title}
                      </span>
                    </div>
                    <div className="flex items-center cursor-pointer justify-center">
                      <DropDown />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-lg text-[#3E3E3E]">
                  <div className="flex p-3 lg:p-6 flex-col gap-y-6">
                    <div
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imgBaseurl}/${faq?.image})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                      className="w-full h-[250px] lg:h-[400px] relative"
                    >
                      <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-between">
                        <div className="w-full flex justify-end">
                          <div className="flex flex-col gap-y-2">
                            <div className="h-10 lg:h-[56px] w-[168px] flex flex-row bg-white border-[1px] border-solid">
                              <div
                                onClick={() => handleAddItinerary(faq)}
                                className="h-full w-[56px] bg-offWhite flex items-center justify-center cursor-pointer"
                              >
                                <Plus />
                              </div>
                              <div className="h-full w-[56px] bg-white flex items-center justify-center text-text-gray text-base font-normal leading-[150%]">
                                {counters[faq.id] || 0}
                              </div>
                              <div
                                onClick={() => handleRemoveItinerary(faq.id)}
                                className="h-full w-[56px] bg-offWhite flex items-center justify-center cursor-pointer"
                              >
                                <Minus />
                              </div>
                            </div>
                            <div
                              onClick={() => setRecommendedOpen(true)}
                              className="h-10 lg:h-[56px] w-[168px] flex flex-row items-center justify-center bg-white border-[1px] border-solid cursor-pointer text-[#004265] font-interTight text-base xl:text-xl font-normal leading-[150%]"
                            >
                              {t("itinerary.wishlist")}
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-row items-end justify-between">
                          <div className="p-4 xl:p-8 flex flex-col gap-y-3">
                            <h3 className="text-[24px] xl:text-[32px] leading-[120%] text-white font-interTight font-light">
                              {faq?.place_name}
                            </h3>
                            <span className="leading-[120%] text-base xl:text-lg font-light text-white font-interTight">
                              {faq?.sub_title}
                            </span>
                          </div>
                          <div
                            onClick={() =>
                              navigate(`/tour-guide-deatils/${faq.id}`)
                            }
                            className="bg-white py-2 lg:py-4 px-2 whitespace-nowrap lg:px-8 border-[1px] flex flex-row items-center cursor-pointer gap-x-1 border-solid h-10 lg:h-[59px] text-primary leading-[150%] font-normal text-sm lg:text-lg"
                          >
                            {t("itinerary.travelGuide")}
                            <ArrowLeft />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <span className="flex flex-row items-center gap-x-2 text-primary font-medium text-base lg:text-lg">
                        {t("itinerary.recommendedAttraction")} <Location />
                      </span>
                      <div className="flex flex-col flex-wrap cursor-pointer xl:flex-row gap-y-3 3xl:gap-y-4 xl:justify-between 3xl:gap-x-4">
                        {faq?.recommended_attractions?.map((item, idx) => {
                          return (
                            <div
                              key={`${tripId}-${faq.id}-${idx}`}
                              className="p-3 flex flex-col gap-y-3 bg-white shadow-primaryShadow"
                              onClick={() => {
                                setOpen(true);
                                setRecomendedAttractionData(item);
                              }}
                            >
                              <img
                                className="w-full xl:w-[270px] 2xl:w-[350px] 3xl:w-[450px] 4xl:w-[464px] h-[200px] 2xl:h-[243px] object-cover "
                                src={`${imgBaseurl}/${item?.image}`}
                                alt={item?.image_alt_txt}
                              />
                              <div className="flex flex-col items-center justify-center h-[30px]">
                                <span className="text-base lg:text-xl text-primary leading-[150%]">
                                  {item?.place_name}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {faq?.accommodations && faq.accommodations.length > 0 && (
                      <div className="flex flex-col gap-y-2 mt-6">
                        {/* 🔵 TITOLO */}
                        <span className="flex flex-row items-center gap-x-2 text-primary font-medium text-base lg:text-lg">
                          {t("itinerary.whereToStay", "Where to stay")}
                        </span>

                        🔵 LISTA ACCOMMODATIONS
                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                          {faq.accommodations.map(acc => (
                            <LuxuryCard key={acc.id} item={acc} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
};

export default ItenaryIdeaDetails;
