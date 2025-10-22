const HeroSlideImg = ({ imgUrl }) => {
  const imgBaseurl = import.meta.env.VITE_SERVER_URL;

  return (
    <>
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden text-black">
        {/* Background Video */}
        <img
          src={`${imgBaseurl}/${imgUrl}`}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          alt="not found"
        />

        {/* Linear Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00426533] to-[#00426533] z-10"></div>
      </div>
    </>
  );
};

export default HeroSlideImg;
