import { useGetAllMenuSubMenuDataQuery } from "@/Redux/features/api/apiSlice";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

// ✅ Funzione di mapping EN → IT per i link del menu (uguale concetto del TopNavbar)
const resolveCategoryRedirectLink = (redirectLink, lang = "en") => {
  if (!redirectLink || typeof redirectLink !== "string") return "#";

  // Rimuove eventuale slash finale
  const clean = redirectLink.replace(/\/$/, "");

  // Se sei in inglese: tieni le route "API style"
  if (lang === "en") {
    return clean;
  }

  // Se sei in italiano: mappa alle route italiane
  switch (clean) {
    // 🗺️ DESTINAZIONI
    case "/destination":
      return "/destinazioni";

    // 🧭 STILI DI VIAGGIO
    case "/travel-style":
      return "/stili-di-viaggio";

    // 🎯 ATTIVITÀ
    case "/activities":
    case "/travel-activities":
      return "/attivita";

    // 📘 GUIDA TURISTICA
    case "/tourist-guide":
      return "/guida-turistica";

    // 🚗 TOUR MEZZI
    case "/tour-mezi":
      return "/tour-mezzi";

    // 💍 VIAGGI DI NOZZE (già corretto)
    case "/viaggi-nozze":
      return "/viaggi-nozze";

    // ✉️ CONTATTO
    case "/contact":
      return "/contatti";

    // DEFAULT → ritorna quello che arriva dall’API
    default:
      return clean;
  }
};

const BottomNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);
  const dropdownRefs = useRef({});
  const timeoutRef = useRef(null);

  const language = useSelector(state => state.language.language);

  const { data, error, isLoading } = useGetAllMenuSubMenuDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleTabMouseEnter = category => {
    clearTimeout(timeoutRef.current);
    setHoveredTab(category);
    setIsHoveringDropdown(false);
  };

  const handleTabMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      if (!isHoveringDropdown) {
        setHoveredTab(null);
      }
    }, 200); // 200ms delay before closing
  };

  const handleDropdownMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsHoveringDropdown(true);
  };

  const handleDropdownMouseLeave = () => {
    setIsHoveringDropdown(false);
    timeoutRef.current = setTimeout(() => {
      setHoveredTab(null);
    }, 200); // 200ms delay before closing
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`fixed w-full hidden 2xl:block z-10 transition-all duration-300 ${
        isScrolled
          ? "bg-primary text-black shadow-lg"
          : "bg-black/10 backdrop-blur-[10px]"
      }`}
    >
      <div className="container mx-auto py-4 flex items-center justify-between px-32">
        {data?.data?.map(tab => (
          <div key={tab?.category} className="relative">
            <NavLink
              to={resolveCategoryRedirectLink(tab?.redirectLink, language)}
              onMouseEnter={() => handleTabMouseEnter(tab?.category)}
              onMouseLeave={handleTabMouseLeave}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "text-[#7BD1FF] opacity-100"
                    : "text-white opacity-85"
                } font-inter relative uppercase font-semibold hover:opacity-100 transition-all duration-300`
              }
            >
              {tab?.category}
            </NavLink>

            {hoveredTab === tab?.category && tab?.subCatgoryArr?.length > 0 && (
              <div
                ref={el => (dropdownRefs.current[tab?.category] = el)}
                className="absolute left-1/2 max-w-[600px] h-auto transform -translate-x-1/2 z-[99999999] bg-white text-black text-sm p-2 rounded mt-2 whitespace-nowrap flex flex-col ease-in-out duration-300 shadow-md"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >

				{tab?.subCatgoryArr?.map((item, index) => {
				  // 1️⃣ URL base dall’API, senza slash finale
				  let baseUrl = item.url?.replace(/\/$/, "") || "";

				  // 2️⃣ Categorie che DEVONO usare SOLO lo slug → /<slug>
				  //    (destination, travel-style, attività, road-tour, viaggi-nozze)
				  const slugResolverCategories = [
					"destination-details",
					"travel-styles-details",
					"activity-details",
					"road-tour-details",
					"/destination",
					"/travel-style",
					"/viaggi-nozze",    // 👈 qui forziamo viaggi di nozze come SOLO slug
				  ];

				  const forceSlugResolver = slugResolverCategories.some(key =>
					baseUrl.includes(key)
				  );

				  let linkUrl = "/";

				  if (forceSlugResolver && item.slug) {
					// Es:
					//  - /alaska-destination
					//  - /luna-di-miele
					//  - /honeymoon
					linkUrl = `/${item.slug}`;
				  } else {
					// 3️⃣ Solo qui gestiamo le traduzioni del base path (EN ↔ IT)
					//    (tourist-guide, activities, ecc.)
					if (language === "it") {
					  const basePathTranslations = {
						"/tourist-guide": "/guida-turistica",
						"/activities": "/attivita",
						"/travel-activities": "/attivita",
						"/tour-mezi": "/tour-mezzi",
						// destination-details, travel-styles-details, ecc.
						// NON servono qui perché sono gestiti da forceSlugResolver
					  };

					  const matchedKey = Object.keys(basePathTranslations).find(key =>
						baseUrl.startsWith(key)
					  );

					  if (matchedKey) {
						baseUrl = baseUrl.replace(matchedKey, basePathTranslations[matchedKey]);
					  }
					}

					// 4️⃣ Montiamo la URL "normale" con base + slug (per tourist-guide ecc.)
					if (item.slug) {
					  // Es:
					  //  - EN: /tourist-guide/1/alaska-destination
					  //  - IT: /guida-turistica/1/destinazione-alaska
					  linkUrl = `${baseUrl}/${item.slug}`;
					} else {
					  linkUrl = baseUrl || "/";
					}
				  }

				  return (
					<div key={item.id}>
					  <Link
						to={linkUrl}
						className="m-3 text-text-gray text-base font-inter font-normal leading-[150%] hover:text-black ease-in-out duration-300"
					  >
						{item?.name}
					  </Link>
					  <hr
						className={`${
						  index === tab.subCatgoryArr.length - 1 ? "opacity-0" : "opacity-100"
						} bg-[#00000014] my-3`}
					  />
					</div>
				  );
				})}

						  
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
