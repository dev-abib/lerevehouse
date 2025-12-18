/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

const SingleDestinationCard = ({
  bg,
  title,
  height,
  id,
  isTravelGuide = false,
  altTxt,
  subTittle,
  slug,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isTravelGuide && id && slug) {
      // GUIDA TURISTICA → es: /tourist-guide/1/alaska
      navigate(`/tourist-guide/${id}/${slug}`);
    }  else if (slug) {
      // fallback di sicurezza, se mai servisse
      navigate(`/${slug}`);
    }
	  else if (id) {
      // uso "vecchio" comportamento per le altre parti del sito
      navigate(`/destination-details/${id}`);
    } 
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group cursor-pointer w-full overflow-hidden ${
        height === "full"
          ? "h-[250px] 3xl:h-[650px]"
          : "h-[250px] 3xl:h-[450px]"
      }`}
    >
      <img
        src={bg}
        alt={altTxt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-55 transition-all duration-500" />
      <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
        <div className="flex px-2 flex-col gap-y-2 items-center">
          <p className="text-white text-2xl 3xl:text-4xl font-semibold font-editorsNoteNormal transition-all duration-500 group-hover:scale-105 drop-shadow-md">
            {title}
          </p>
          {subTittle && (
            <p className="text-white text-base 3xl:text-lg font-light opacity-90 transition-all duration-500 group-hover:scale-[1.03] drop-shadow">
              {subTittle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleDestinationCard;
