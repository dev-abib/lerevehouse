/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LocationLuxurySvg } from "../SvgContainer/SvgContainer";
import { useGetAccomadationDetailsQuery } from "@/Redux/features/api/apiSlice";

const LuxuryCard = ({ item }) => {
  const imgBaseurl = import.meta.env.VITE_SERVER_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const modalRef = useRef(null);

  const { data, isFetching } = useGetAccomadationDetailsQuery(selectedId, {
    skip: !selectedId,
  });

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false);
        setSelectedId(null);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setSelectedId(item.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const handleDestinationMap = address => {
    const location = `https://www.google.com/maps?q=${address}`;
    window.open(location, "_blank");
  };

  return (
    <>
      <Link
        className="group block cursor-pointer"
        onClick={e => {
          e.preventDefault();
          handleOpenModal();
        }}
      >
        <div className="w-full h-[200px] xl:h-72 overflow-hidden rounded-lg">
          <img
            className="h-full w-full object-cover group-hover:scale-110 transition-all duration-300"
            src={`${imgBaseurl}/${item?.image}`}
            alt={item?.image_alt_txt || "Image"}
          />
        </div>
        <div className="mt-4 font-interTight">
          <div className="mt-2 xl:mt-3 space-y-1 xl:space-y-2">
            <div
              onClick={e => {
                e.stopPropagation();
                handleDestinationMap(item?.location);
              }}
              className="flex items-center gap-2"
            >
              <LocationLuxurySvg />
              <span className=" font-medium text-sm xl:text-base text-primary">
                {item?.location}
              </span>
            </div>
            <h4
              className="text-lg xl:text-xl font-semibold"
              onClick={e => {
                e.stopPropagation();
                handleDestinationMap(item?.name);
              }}
            >
              {item?.name}
            </h4>
            <p className="text-[#565656]">{item?.description}</p>
          </div>
        </div>
      </Link>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl w-full max-w-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-4 text-gray-600 hover:text-black text-2xl font-bold z-10"
            >
              &times;
            </button>

            {isFetching ? (
              <div className="text-center py-10">Loading...</div>
            ) : data?.data ? (
              <>
                {/* Image */}
                <img
                  src={`${imgBaseurl}/${item?.image}`}
                  alt={data.data.image_alt_txt || "Accommodation image"}
                  className="w-full h-60 object-cover"
                />

                {/* Content */}
                <div className="p-6 space-y-3 font-interTight">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {data.data.meta_title}
                  </h2>
                  <p className="text-gray-600">{data.data.meta_description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <p>
                      <strong>Rooms:</strong> {data.data.number_of_rooms}
                    </p>
                    <p>
                      <strong>Guests:</strong> {data.data.max_guests}
                    </p>
                    
                    <p>
                      <strong>WiFi:</strong> {data.data.has_wifi ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Parking:</strong>{" "}
                      {data.data.has_parking ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Air Conditioning:</strong>{" "}
                      {data.data.has_air_conditioning ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Pet Friendly:</strong>{" "}
                      {data.data.is_pet_friendly ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Facilities:</strong> {data.data.facilities}
                    </p>
                    <p className="col-span-2">
                      <strong>Policies:</strong> {data.data.policies}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-red-500 text-center p-6">
                Failed to load data
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LuxuryCard;
