import { useForm } from "react-hook-form";
import {
  CrossModalSvg,
  ResetButtonSvg,
  Star,
} from "../common/SvgContainer/SvgContainer";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import city from "../../assets/images/recomended-attraction/city.png";
import evening from "../../assets/images/recomended-attraction/evening.png";
import hangingBridge from "../../assets/images/recomended-attraction/hangingBride.png";
import sea from "../../assets/images/recomended-attraction/sea.png";
import parse from "html-react-parser";

import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  TrafficLayer,
  useLoadScript,
} from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

// Map container style
const containerStyle = {
  width: "100%",
  height: "600px",
};

const waypoints = [{ lat: 49.2827, lng: -123.1207 }];

const RecomendedAttractionModal = ({ setOpen, modalData }) => {
  const { t } = useTranslation();

  const containerRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = data => {
    console.log(data);
    toast.success("Form Submitted Successfully");
    setOpen(false);
  };

  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [showTraffic, setShowTraffic] = useState(true);

  const mapRef = useRef(null);

  const [activeTab, setactiveTab] = useState("Details");

  console.log(modalData);

  // Load Google Maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyA_G_EhWhTWpRYaE6_kR8txUKUkmZkvNiQ",
    libraries: ["places", "directions"],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const paragraphs = Array.from(container.querySelectorAll("p"));
      const elements = container.querySelectorAll("p, span, strong, h2");

      // Apply font styles & responsive handling
      elements.forEach(el => {
        el.style.fontSize = "1rem";
        el.style.lineHeight = "1.5";
        el.style.fontFamily = "Inter, sans-serif";
        el.style.fontWeight = "500";
        el.style.color = "#004265";
      });

      // Responsive resizing for text-xl
      const resizeHandler = () => {
        elements.forEach(el => {
          el.style.fontSize = window.innerWidth >= 768 ? "1.25rem" : "1rem";
        });
      };

      resizeHandler();
      window.addEventListener("resize", resizeHandler);

      // Special color styling for label vs value
      paragraphs.forEach(p => {
        const text = p.innerText.trim();
        const match = text.match(/^\w+:/);

        if (match) {
          p.style.color = "#004265";
          p.style.fontWeight = "600";
        } else {
          p.style.color = "#9C9EA1";
          p.style.fontWeight = "400";
        }
      });

      // Cleanup
      return () => {
        window.removeEventListener("resize", resizeHandler);
      };
    }, 0); // Use 0 to apply right after render

    return () => clearTimeout(timer);
  }, [modalData?.details, activeTab]);

  return (
    <DialogContent className="w-[340px] sm:w-[400px] md:w-[500px] lg:w-[700px] xl:w-[900px] z-[9999]  3xl:min-w-[1200px] py-6 text-center font-nunito">
      <div className="max-h-[80vh] overflow-y-auto scrollbar-hide px-4 md:px-0">
        <DialogHeader>
          <DialogTitle className="py-3 w-full flex items-center justify-between">
            <div className="flex flex-col gap-y-[6px] ">
              <h2 className="font-fontSpring font-light leading-[150%] text-primary text-xl md:text-2xl tracking-wide">
                {modalData?.place_name}
              </h2>
              <span className="flex flex-row items-center gap-x-1 font-interTight font-normal leading-[150%] md:text-lg text-sm">
                <Star /> 4.3 (243 {t("reviews")})
              </span>
            </div>
            <div
              onClick={() => setOpen(false)}
              className="size-7 cursor-pointer group hover:bg-primary transition-all duration-300 border border-primary rounded-full flex items-center justify-center"
            >
              <CrossModalSvg />
            </div>
          </DialogTitle>
          <DialogDescription>
            <hr className="w-full h-[1px] bg-[#EBEBEB]" />
            <div className="flex flex-col md:gap-y-10 gap-y-0">
              <div className="flex flex-row flex-wrap gap-4">
                {modalData?.images?.map((item, index) => (
                  <img
                    key={item?.id}
                    className={
                      index === 0
                        ? "md:w-full xl:h-[421px] h-[220px] object-cover "
                        : "3xl:w-[275px] w-full md:h-[237px] h-[220px] object-cover "
                    }
                    src={`${imgBaseurl}/${item?.image}`}
                    alt={`Attraction ${item?.id}`}
                  />
                ))}
              </div>
              <div className=" py-6">
                <div className="flex flex-col gap-y-6">
                  <div>
                    {activeTab === "Details" && (
                      <div
                        ref={containerRef}
                        className="details flex flex-col gap-y-6 mx-2 md:mx-0"
                        dangerouslySetInnerHTML={{ __html: modalData?.details }}
                      />
                    )}
                    {activeTab === "Location" && (
                      <div className="w-full md:mt-5">
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          center={waypoints[0]}
                          zoom={11}
                          onLoad={map => (mapRef.current = map)}
                          tilt={45}
                        >
                          {directionsResponse && (
                            <DirectionsRenderer
                              directions={directionsResponse}
                            />
                          )}
                          {showTraffic && <TrafficLayer />}
                        </GoogleMap>
                      </div>
                    )}
                    {activeTab === "Rates" && (
                      <div className="flex md:flex-row flex-col">
                        <div className="w-full rates ">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: modalData?.rates,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </div>
    </DialogContent>
  );
};

export default RecomendedAttractionModal;
