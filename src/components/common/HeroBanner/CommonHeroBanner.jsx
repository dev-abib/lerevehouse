/* eslint-disable react/prop-types */
import { TourListDetailsClockSvg } from "../SvgContainer/SvgContainer";
import { decode } from "he";

const CommonHeroBanner = ({
  bg,
  title,
  italic,
  duration,
  uppercaseTitle,
  uppercaseItalic,
  subTittle,
  subSubTittle,
  isDangerousHtml,
  altTxt,
}) => {
  return (
    <section className="relative h-[350px] sm:h-[400px] xl:h-[600px] mt-20 xl:mt-24 flex flex-col gap-5 lg:gap-10 items-center justify-center overflow-hidden px-8 xl:px-0">
      {/* Background image */}
      <img
        src={bg}
        alt={altTxt}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col max-w-[932px] items-center justify-center gap-y-2 text-white">
        {subSubTittle &&
          (isDangerousHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: subSubTittle }}
              className="text-[24px] font-medium leading-[150%] tracking-[1px]"
            ></div>
          ) : (
            <span className="text-[24px] font-editorsNoteNormal font-medium leading-[150%] tracking-[1px]">
              {subSubTittle}
            </span>
          ))}

        <h1 className="text-2xl md:text-4xl xl:text-6xl text-center font-editorsNoteNormal font-light xl:leading-[102.4px]">
          <span
            className={`${
              uppercaseTitle ? "uppercase" : "capitalize"
            } text-center`}
          >
            {title && title.toLowerCase()}
          </span>
          {italic && (
            <span
              className={`font-editorsNoteItalic ml-4 ${
                uppercaseItalic ? "uppercase" : "capitalize"
              }`}
            >
              {italic}
            </span>
          )}
        </h1>

        {subTittle &&
          (isDangerousHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: subTittle }}
              className="text-center text-base xl:text-2xl font-medium md:leading-[150%]"
            ></div>
          ) : (
            <span className="text-center font-editorsNoteNormal  text-base xl:text-2xl font-medium md:leading-[150%]">
              {subTittle}
            </span>
          ))}
      </div>

      {duration && (
        <div className="relative z-10 bg-white px-2 lg:px-5 py-2 text-sm lg:text-base text-primary font-interTight font-semibold flex items-center gap-3 mt-3">
          <TourListDetailsClockSvg />
          <span>{duration}</span>
        </div>
      )}
    </section>
  );
};

export default CommonHeroBanner;
