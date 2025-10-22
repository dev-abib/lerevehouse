import { Slice } from "lucide-react";
import imageOne from "../../assets/images/explore-travel1.png";
import imageTwo from "../../assets/images/explore-travel2.png";
import imageThree from "../../assets/images/explore-travel3.png";
import imageFour from "../../assets/images/explore-travel4.png";
import imageFive from "../../assets/images/explore-travel5.png";
import imageSix from "../../assets/images/explore-travel6.png";
import TravelExploreCard from "../TravelStyles/TravelExploreCard";
import { useTranslation } from "react-i18next";

const FeaturedTravels = ({
  isHoneyMoon,
  data,
  title,
  isTravelStyleRedirect,
}) => {
  const { t } = useTranslation();

  return (
    <section className="py-10 lg:py-20 2xl:py-[120px] xl:px-5 2xl:px-14">
      <div className="container">
        <div className="text-center mb-10 lg:mb-20 2xl:mb-[113px]">
          <h3 className="title--xxl">
            {isHoneyMoon ? title : t("browseThingss.featuredTitle")}
          </h3>
        </div>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {isHoneyMoon
            ? data?.map(item => (
                <TravelExploreCard
                  travelMode={isHoneyMoon  ? "honey_moon" : "travel_details"}
                  key={item.id}
                  item={item}
                  isTravelStyleRedirect={isTravelStyleRedirect}
                />
              ))
            : data
                ?.slice(0, 9)
                ?.map(item => (
                  <TravelExploreCard
                    key={item.id}
                    travelMode={isHoneyMoon ? "honey_moon" : "travel_details"}
                    item={item}
                  />
                ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTravels;
