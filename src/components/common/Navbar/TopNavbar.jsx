import logo from "@/assets/images/logo.jfif";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  EarthSvgNavbar,
  EmailSvgNavbar,
  LocationSvgNavbar,
  PhoneSvgNavbar,
  SearchSvgNavbar,
} from "../SvgContainer/SvgContainer";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useGetAllMenuSubMenuDataQuery,
  useGetOfficeDataQuery,
  useGetPhoneNumbersQuery,
} from "@/Redux/features/api/apiSlice";
import { InfinitySpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "@/Redux/features/languageSlice";
import { useTranslation } from "react-i18next";

// Mappa i redirectLink dell'API verso le route giuste per lingua
const resolveCategoryRedirectLink = (redirectLink, lang = "en") => {
  if (!redirectLink || typeof redirectLink !== "string") return "#";

  const clean = redirectLink.replace(/\/$/, "");

  // Se sei in inglese: tieni le route "API style"
  if (lang === "en") {
    return clean;
  }

  // Se sei in italiano: mappa alle route italiane
  switch (clean) {
    case "/destination":
      return "/destinazioni";

    case "/travel-style":
      return "/stili-di-viaggio";

    case "/activities":
    case "/travel-activities":
      return "/attivita";

    case "/tourist-guide":
      return "/guida-turistica";

    case "/tour-mezi":
      return "/tour-mezzi";

    case "/viaggi-nozze":
      return "/viaggi-nozze";

    case "/contact":
      return "/contatti";

    default:
      return clean;
  }
};

const TopNavbar = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const sideBarRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const language = useSelector(state => state.language.language);

  const location = useLocation();
  const API_BASE = "https://admin.lerevetravel.com/api";

  const {
    data: officeData,
    error: officeError,
    isLoading: isOfficeLoading,
  } = useGetOfficeDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { data, error, isLoading } = useGetAllMenuSubMenuDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: phoneNumberData,
    error: phoneNumberError,
    isLoading: isPhoneNumberLoading,
  } = useGetPhoneNumbersQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  console.log(phoneNumberData);

  useEffect(() => {
    const handleClickOutside = event => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        setIsSideBarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle loading state
  if (isOfficeLoading) {
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

  const handlMapOpen = () => {
    const location = `https://www.google.com/maps?q=${officeData?.data[0]?.address}`;
    window.open(location, "_blank");
  };

  const topNavLinks = [
    {
      title: t("navbar.search"),
      svg: <SearchSvgNavbar />,
    },
    // {
    //   title: t("navbar.contact"),
    //   svg: <EmailSvgNavbar />,
    // },
  ];
  const flattenActivitySubcategories = json => {
    const activityCategories = json?.data?.activity_category || [];
    return activityCategories.flatMap(cat => cat.activity_sub_category || []);
  };

  const handleLanguageToggle = async () => {
    const currentLang = language || localStorage.getItem("lan") || "en";
    const nextLang = currentLang === "en" ? "it" : "en";

    const currentPath = location.pathname;
    let targetPath = currentPath; // fallback

    if (currentPath === "/viaggi-nozze") {
      dispatch(setLanguage(nextLang));
      return; // fermiamo tutto, restiamo sulla stessa URL
    }

    // 🔁 Mappa pagine statiche IT/EN senza usare l'API
    const staticPathTranslations = {
      "/destination": { en: "/destination", it: "/destinazioni" },
      "/destinazioni": { en: "/destination", it: "/destinazioni" },

      "/travel-style": { en: "/travel-style", it: "/stili-di-viaggio" },
      "/stili-di-viaggio": { en: "/travel-style", it: "/stili-di-viaggio" },

      "/activities": { en: "/activities", it: "/attivita" },
      "/attivita": { en: "/activities", it: "/attivita" },

      "/tourist-guide": { en: "/tourist-guide", it: "/guida-turistica" },
      "/guida-turistica": { en: "/tourist-guide", it: "/guida-turistica" },

      "/tour-mezi": { en: "/tour-mezi", it: "/tour-mezzi" },
      "/tour-mezzi": { en: "/tour-mezi", it: "/tour-mezzi" },

      "/viaggi-nozze": { en: "/viaggi-nozze", it: "/viaggi-nozze" },

      "/contact": { en: "/contact", it: "/contatti" },
      "/contatti": { en: "/contact", it: "/contatti" },
    };

    const staticEntry = staticPathTranslations[currentPath];

    if (staticEntry) {
      const newPath = staticEntry[nextLang] || currentPath;

      // aggiorno lingua
      dispatch(setLanguage(nextLang));

      // vado direttamente sulla nuova URL e STOP
      const origin = window.location.origin;
      window.location.href = origin + newPath;
      return;
    }

    console.log("========== LANGUAGE SWITCH ==========");
    console.log("Current lang:", currentLang);
    console.log("Next lang:", nextLang);
    console.log("Current path:", currentPath);

    // --- CASE 1: /slug (destination, travel-style) ---
    const slugMatch = currentPath.match(/^\/([^\/]+)\/?$/);

    // --- CASE 2: /activity-details/:id/:slug ---
    const activityMatch = currentPath.match(
      /^\/activity-details\/(\d+)\/([^\/]+)\/?$/
    );

    // --- CASE 3: /tourist-guide/:id/:slug ---
    const touristGuideMatchEn = currentPath.match(
      /^\/tourist-guide\/(\d+)\/([^\/]+)\/?$/
    );
    const touristGuideMatchIt = currentPath.match(
      /^\/guida-turistica\/(\d+)\/([^\/]+)\/?$/
    );

    // se combacia una delle due, considero il path come "tourist-guide detail"
    const touristGuideMatch = touristGuideMatchEn || touristGuideMatchIt;

    // --- CASE X: SingleCanadaTour → /tour-guides/:id/:destinationSlug/:slug
    const singleTourMatchEn = currentPath.match(
      /^\/tour-guides\/(\d+)\/([^\/]+)\/([^\/]+)\/?$/
    );

    // --- CASE X ITA: /guida-turistica/:id/:destinationSlug/:slug
    const singleTourMatchIt = currentPath.match(
      /^\/guida-turistica\/(\d+)\/([^\/]+)\/([^\/]+)\/?$/
    );

    const singleTourMatch = singleTourMatchEn || singleTourMatchIt;

    // --- CASE 4: /road-tour-details/:id/:slug ---
    const roadTourMatch = currentPath.match(
      /^\/road-tour-details\/(\d+)\/([^\/]+)\/?$/
    );
    const doubleSlugMatch = currentPath.match(/^\/([^\/]+)\/([^\/]+)\/?$/);
    // --- CASE X: /tour-guides/:id/:slug ---
    const tourGuidesMatch = currentPath.match(
      /^\/tour-guides\/(\d+)\/([^\/]+)\/?$/
    );

    try {
      // 1️⃣ prendo menu lingua corrente e nuova
      const [currentRes, nextRes] = await Promise.all([
        fetch(`${API_BASE}/all-menu-with-sub-menus?lan=${currentLang}`),
        fetch(`${API_BASE}/all-menu-with-sub-menus?lan=${nextLang}`),
      ]);

      const currentJson = await currentRes.json();
      const nextJson = await nextRes.json();

      const flatten = data =>
        (data || []).flatMap(cat =>
          (cat.subCatgoryArr || []).map(item => ({
            ...item,
            parent: cat,
          }))
        );

      const currentItems = flatten(currentJson.data);
      const nextItems = flatten(nextJson.data);

      console.log("Current items:", currentItems);
      console.log("Next items:", nextItems);

      // ============================================================
      //  CASE 1: DESTINATION / TRAVEL STYLE → /slug
      // ============================================================
      // --- CASE 1: /slug (destination, travel-style, activities category, tour-mezi category) ---
      if (slugMatch) {
        const currentSlug = slugMatch[1];
        console.log("Slug match:", currentSlug);

        const currentItem = currentItems.find(i => i.slug === currentSlug);
        console.log("Current item (slug):", currentItem);

        if (currentItem) {
          const id = currentItem.id;
          const parentLink = currentItem.parent?.redirectLink || "";

          const isDestination = parentLink === "/destination";
          const isTravelStyle = parentLink === "/travel-style";

          // 👇 qui includo entrambe le versioni che usi in giro
          const isActivityCat =
            parentLink === "/activities" || parentLink === "/travel-activities";

          const isTourMeziCat = parentLink === "/tour-mezi";

          if (
            isDestination ||
            isTravelStyle ||
            isActivityCat ||
            isTourMeziCat
          ) {
            // 👇 filtro ANCHE per parentLink, così non passo da activities → destination
            const nextItem = nextItems.find(
              i => i.id === id && i.parent?.redirectLink === parentLink
            );
            console.log("Next item (slug):", nextItem);

            if (nextItem?.slug) {
              targetPath = `/${nextItem.slug}`;
            }
          }
        }
      }

      // ============================================================
      //  CASE 2: ACTIVITY → /activity-details/:id/:slug
      // ============================================================
      else if (activityMatch) {
        const id = Number(activityMatch[1]);
        const currentSlug = activityMatch[2];

        console.log("Activity match: id =", id, "slug =", currentSlug);

        const currentItem = currentItems.find(
          i => i.id === id && i.parent?.redirectLink === "/activities"
        );
        console.log("Current activity:", currentItem);

        if (currentItem) {
          const nextItem = nextItems.find(
            i => i.id === id && i.parent?.redirectLink === "/activities"
          );
          console.log("Next activity:", nextItem);

          if (nextItem?.slug) {
            targetPath = `/activity-details/${id}/${nextItem.slug}`;
          }
        }
      }

      // ============================================================
      //  CASE 3: TOURIST GUIDE → /tourist-guide/:id/:slug
      // ============================================================
      else if (touristGuideMatch) {
        const id = Number(touristGuideMatch[1]);
        const currentSlug = touristGuideMatch[2];

        console.log("Tourist-guide match: id =", id, "slug =", currentSlug);

        // cerchiamo l'item corrente per slug e categoria tourist-guide
        const currentItem = currentItems.find(
          i =>
            i.slug === currentSlug &&
            i.parent?.redirectLink === "/tourist-guide"
        );
        console.log("Current tourist-guide item:", currentItem);

        if (currentItem) {
          const currentId = currentItem.id;

          // cerchiamo lo stesso ID nella lingua nuova, sempre nella categoria tourist-guide
          const nextItem = nextItems.find(
            i =>
              i.id === currentId && i.parent?.redirectLink === "/tourist-guide"
          );
          console.log("Next tourist-guide item:", nextItem);

          if (nextItem?.slug) {
            // base path dipende dalla lingua di DESTINAZIONE
            const basePath =
              nextLang === "en" ? "/tourist-guide" : "/guida-turistica";

            targetPath = `${basePath}/${currentId}/${nextItem.slug}`;
          }
        } else {
          console.warn(
            "Nessun currentItem trovato per tourist-guide con slug:",
            currentSlug
          );
        }
      }

      // ============================================================
      //  CASE 4: ROAD TOUR → /road-tour-details/:id/:slug
      //  (categoria "transportation" con redirectLink "/tour-mezi")
      // ============================================================
      // ============================================================
      //  CASE 4: ROAD TOUR → /road-tour-details/:id/:slug
      //  (categoria "transportation" con redirectLink "/tour-mezi")
      // ============================================================
      else if (roadTourMatch) {
        const idFromUrl = Number(roadTourMatch[1]);
        const currentSlug = roadTourMatch[2];

        console.log("Road-tour match: id =", idFromUrl, "slug =", currentSlug);

        // 1️⃣ prima provo a trovare per slug + categoria
        let currentItem = currentItems.find(
          i => i.slug === currentSlug && i.parent?.redirectLink === "/tour-mezi"
        );

        // fallback: se lo slug non combacia, provo con l'id
        if (!currentItem) {
          currentItem = currentItems.find(
            i => i.id === idFromUrl && i.parent?.redirectLink === "/tour-mezi"
          );
        }

        console.log("Current road-tour item:", currentItem);

        if (currentItem) {
          const id = currentItem.id;

          const nextItem = nextItems.find(
            i => i.id === id && i.parent?.redirectLink === "/tour-mezi"
          );

          console.log("Next road-tour item:", nextItem);

          if (nextItem?.slug) {
            targetPath = `/road-tour-details/${id}/${nextItem.slug}`;
          }
        } else {
          console.warn(
            "Nessun currentItem trovato per road-tour con slug:",
            currentSlug
          );
        }
      }

      // ============================================================
      //  CASE X: SINGLE CANADA TOUR (GUIDA) → /tour-guides|guida-turistica/:id/:destSlug/:slug
      // ============================================================
      else if (singleTourMatch) {
        const guideId = Number(singleTourMatch[1]);
        const currentDestSlug = singleTourMatch[2]; // alaska-destination / destinazione-alaska
        const currentGuideSlug = singleTourMatch[3]; // the-boundless-north / il-nord-senza-confini

        console.log("SingleCanadaTour match:", {
          guideId,
          currentDestSlug,
          currentGuideSlug,
        });

        let nextDestSlug = currentDestSlug;
        let nextGuideSlug = currentGuideSlug;

        try {
          // 1️⃣ prendo dettagli guida in entrambe le lingue
          const [currentGuideRes, nextGuideRes] = await Promise.all([
            fetch(
              `${API_BASE}/tourist-guide-details/${guideId}?lan=${currentLang}`
            ),
            fetch(
              `${API_BASE}/tourist-guide-details/${guideId}?lan=${nextLang}`
            ),
          ]);

          const currentGuideJson = await currentGuideRes.json();
          const nextGuideJson = await nextGuideRes.json();

          const currentGuideData = currentGuideJson?.data;
          const nextGuideData = nextGuideJson?.data;

          console.log("tourist-guide current:", currentGuideData);
          console.log("tourist-guide next:", nextGuideData);

          // 2️⃣ slug guida nella lingua target
          if (nextGuideData?.slug) {
            nextGuideSlug = nextGuideData.slug; // "the-boundless-north" / "il-nord-senza-confini"
          }

          // 3️⃣ slug destinazione nella lingua target
          const destinationId = currentGuideData?.destination_id;

          if (destinationId) {
            const destNextRes = await fetch(
              `${API_BASE}/destination-details/${destinationId}?lan=${nextLang}`
            );
            const destNextJson = await destNextRes.json();
            const destNextData = destNextJson?.data;

            const destDetailsNext = destNextData?.destination_details;
            if (destDetailsNext?.slug) {
              nextDestSlug = destDetailsNext.slug; // "alaska-destination" / "destinazione-alaska"
            }
          }
        } catch (err) {
          console.error("Errore mapping SingleCanadaTour:", err);
          // in caso di errore uso comunque gli slug correnti
        }

        // 4️⃣ base path dipende dalla lingua di arrivo
        const basePath =
          nextLang === "en" ? "/tour-guides" : "/guida-turistica";

        targetPath = `${basePath}/${guideId}/${nextDestSlug}/${nextGuideSlug}`;
      }

      // ============================================================
      //  CASE X: TOUR GUIDES → /tour-guides/:id/:slug
      //  es: /tour-guides/1/the-boundless-north
      //      /tour-guides/1/il-nord-senza-confini
      // ============================================================
      else if (tourGuidesMatch) {
        const idFromUrl = Number(tourGuidesMatch[1]);
        const currentSlug = tourGuidesMatch[2];

        console.log(
          "Tour-guides match: id =",
          idFromUrl,
          "slug =",
          currentSlug
        );

        let translatedSlug = currentSlug;

        try {
          // prendo i dettagli della stessa guida in entrambe le lingue
          const [currentGuideRes, nextGuideRes] = await Promise.all([
            fetch(
              `${API_BASE}/tourist-guide-details/${idFromUrl}?lan=${currentLang}`
            ),
            fetch(
              `${API_BASE}/tourist-guide-details/${idFromUrl}?lan=${nextLang}`
            ),
          ]);

          const currentGuideJson = await currentGuideRes.json();
          const nextGuideJson = await nextGuideRes.json();

          const currentData = currentGuideJson?.data;
          const nextData = nextGuideJson?.data;

          console.log("tourist-guide currentData:", currentData);
          console.log("tourist-guide nextData:", nextData);

          // opzionale: controllo che lo slug attuale combaci
          if (
            !currentData ||
            (currentData.slug && currentData.slug !== currentSlug)
          ) {
            console.warn(
              "Slug corrente non combacia con quello dell'API, uso comunque quello target se esiste"
            );
          }

          if (nextData?.slug) {
            translatedSlug = nextData.slug; // 👈 es. "il-nord-senza-confini" / "the-boundless-north"
          }
        } catch (err) {
          console.error("Errore nel mapping tour-guides:", err);
          // in caso di errore lascio translatedSlug = currentSlug
        }

        // Il base path è lo stesso in EN/IT: /tour-guides
        targetPath = `/tour-guides/${idFromUrl}/${translatedSlug}`;
      }

      // ============================================================
      //  CASE 5: SEO → /<catSlug>/<detailSlug>
      //  - Attività: /hiking-trekking/the-best-diving-spots-in-vancouver
      //  - Destinazioni: /alaska-destination/classic-tour-alaska-8
      // ============================================================
      else if (doubleSlugMatch) {
        const categorySlugFromUrl = doubleSlugMatch[1]; // es. escursionismo-trekking, alaska-destination
        const detailSlugFromUrl = doubleSlugMatch[2]; // es. i-migliori-luoghi-..., classic-tour-alaska-8

        console.log(
          "Double slug match:",
          categorySlugFromUrl,
          detailSlugFromUrl
        );

        // 1️⃣ Trovo la categoria corrente NEI MENU (currentLang)
        const currentCat = currentItems.find(
          i =>
            i.slug === categorySlugFromUrl &&
            (i.parent?.redirectLink === "/activities" ||
              i.parent?.redirectLink === "/destination")
        );

        if (!currentCat) {
          console.warn(
            "Nessuna categoria trovata per doubleSlugMatch nel menu corrente"
          );
          // non tocco targetPath, rimani dove sei
        } else {
          const parentLink = currentCat.parent?.redirectLink;

          // 2️⃣ Trovo la stessa categoria nella lingua target (stesso id, stesso parentLink)
          const nextCat = nextItems.find(
            i => i.id === currentCat.id && i.parent?.redirectLink === parentLink
          );

          if (!nextCat) {
            console.warn(
              "Nessuna categoria corrispondente trovata per la lingua target"
            );
            // non tocco targetPath
          } else {
            let translatedDetailSlug = detailSlugFromUrl;

            try {
              // ======================================================
              //  ATTIVITÀ SEO  (/activities)
              // ======================================================
              if (parentLink === "/activities") {
                const activityId = currentCat.id; // es. 1 per escursionismo-trekking

                // chiamo le API dei dettagli attività per entrambe le lingue
                const [currentDetailRes, nextDetailRes] = await Promise.all([
                  fetch(
                    `${API_BASE}/activity-details/${activityId}?lan=${currentLang}`
                  ),
                  fetch(
                    `${API_BASE}/activity-details/${activityId}?lan=${nextLang}`
                  ),
                ]);

                const currentDetailJson = await currentDetailRes.json();
                const nextDetailJson = await nextDetailRes.json();

                const currentSubs =
                  flattenActivitySubcategories(currentDetailJson);
                const nextSubs = flattenActivitySubcategories(nextDetailJson);

                // trovo il sotto-articolo attuale in base allo slug della URL corrente
                const currentSub = currentSubs.find(
                  sub => sub.slug === detailSlugFromUrl
                );

                console.log("currentSub (activity SEO):", currentSub);

                if (currentSub) {
                  // cerco lo stesso ID nella lingua target
                  const nextSub = nextSubs.find(
                    sub => sub.id === currentSub.id
                  );
                  console.log("nextSub (activity SEO):", nextSub);

                  if (nextSub?.slug) {
                    translatedDetailSlug = nextSub.slug; // 👈 slug giusto per EN/IT
                  }
                }
              }

              // ======================================================
              //  DESTINAZIONI + TOUR  (/destination)
              // ======================================================
              else if (parentLink === "/destination") {
                const destinationId = currentCat.id; // es. 1 per Alaska

                // QUI devi usare la TUA API reale di destinazione (simile a activity-details)
                const [currentDestRes, nextDestRes] = await Promise.all([
                  fetch(
                    `${API_BASE}/destination-details/${destinationId}?lan=${currentLang}`
                  ),
                  fetch(
                    `${API_BASE}/destination-details/${destinationId}?lan=${nextLang}`
                  ),
                ]);

                const currentDestJson = await currentDestRes.json();
                const nextDestJson = await nextDestRes.json();

                // 👇 USA il campo giusto: trip_packages
                const getTripPackages = json => json?.data?.trip_packages || [];

                const currentTrips = getTripPackages(currentDestJson);
                const nextTrips = getTripPackages(nextDestJson);

                // trovo il pacchetto corrente in base allo slug della URL
                const currentTrip = currentTrips.find(
                  t => t.slug === detailSlugFromUrl
                );
                console.log("currentTrip:", currentTrip);

                if (currentTrip) {
                  // cerco lo stesso ID nella lingua target
                  const nextTrip = nextTrips.find(t => t.id === currentTrip.id);
                  console.log("nextTrip:", nextTrip);

                  if (nextTrip?.slug) {
                    translatedDetailSlug = nextTrip.slug; // es. "tour-classic-alaska-8"
                  }
                }
              }
            } catch (err) {
              console.error("Errore nel mapping SEO / destinazioni:", err);
              // in caso di errore lascio translatedDetailSlug = detailSlugFromUrl
            }

            // 3️⃣ Ricostruisco la URL finale con:
            // - categoria tradotta (nextCat.slug)
            // - dettaglio tradotto (translatedDetailSlug)
            targetPath = `/${nextCat.slug}/${translatedDetailSlug}`;
          }
        }
      }
    } catch (err) {
      console.error("Errore cambio lingua/slug:", err);
      // se fallisce qualcosa, rimaniamo su currentPath
    }

    console.log("FINAL targetPath:", targetPath);
    console.log("====================================");

    // 2️⃣ aggiorno lingua (Redux + i18n + localStorage)
    dispatch(setLanguage(nextLang));

    // 3️⃣ navigo alla nuova URL (reload naturale)
    const origin = window.location.origin;
    window.location.href = origin + targetPath;
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto flex px-2 2xl:my-0 2xl:px-0 w-full items-center justify-between h-24 xl:gap-40">
        <Link to="/" className="h-20 w-56 inline-block flex-shrink-0">
          <img className="h-full w-full object-contain" src={logo} alt="Logo" />
        </Link>

        {/* Desktop info */}
        <div className="hidden 2xl:flex items-center h-full w-full gap-10">
          <div className="border-x border-primary h-full px-8 flex items-center justify-center w-full">
            <div className="flex items-center justify-between gap-3 text-text-black w-full">
              <Link
                to={`tel:${phoneNumberData?.data?.phone}`}
                className="flex items-center gap-2"
              >
                <span className="font-bold min-w-[109px] text-sm font-interTight">
                  {phoneNumberData?.data?.email}
                </span>
              </Link>
              <Link
                to={`tel:${phoneNumberData?.data?.phone}`}
                className="flex items-center gap-2"
              >
                <span className="font-bold min-w-[109px] text-sm font-interTight">
                  {phoneNumberData?.data?.telephone}
                </span>
              </Link>

              <Link
                to={`tel:${phoneNumberData?.data?.phone}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="font-bold min-w-[109px] text-sm font-interTight">
                  {phoneNumberData?.data?.phone}
                </span>
              </Link>
            </div>
          </div>

          {/* NavLinks */}
          <div className="pr-8 border-r border-primary h-full flex items-center justify-center">
            <ul className="flex items-center gap-8">
              {topNavLinks.map(item => (
                <li key={item?.title}>
                  <div
                    onClick={e => {
                      if (item?.title === "Contact") {
                        e.preventDefault();
                        window.location.href = `mailto:${officeData?.data[0]?.email}`;
                      } else if (
                        item.title === "Search" ||
                        item.title === "Cerca"
                      ) {
                        navigate("/search");
                      }
                    }}
                    className="flex items-center cursor-pointer gap-2"
                  >
                    <div className="text-primary font-inter text-base font-medium">
                      {item.svg}
                    </div>
                    <p className="font-interTight text-sm text-text-gray">
                      {item.title}
                    </p>
                  </div>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLanguageToggle}
                  className="flex items-center gap-2"
                >
                  <div className="text-primary font-inter text-base font-medium">
                    <EarthSvgNavbar />
                  </div>
                  <p className="font-interTight text-sm text-text-gray uppercase   ">
                    {language}
                  </p>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile info */}
        <div className="flex px-2 2xl:hidden flex-col">
          {!isSideBarOpen && (
            <RxHamburgerMenu
              onClick={() => setIsSideBarOpen(true)}
              className="w-8 h-8 cursor-pointer"
            />
          )}

          <AnimatePresence>
            {isSideBarOpen && (
              <motion.div
                className="fixed inset-0 w-screen h-screen bg-black bg-opacity-50 backdrop-blur-md flex !z-[999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  ref={sideBarRef}
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="w-[280px] !z-[999] py-8 bg-white border-r-[1px] border-solid border-gray-200 top-0 left-0 flex flex-col items-start justify-start h-full gap-y-8"
                >
                  <img
                    onClick={() => {}}
                    className="h-[70px] w-[220px] object-contain"
                    src={logo}
                    alt="Logo"
                  />
                  <div className="flex flex-col gap-y-8">
                    <div className="flex flex-col px-5 gap-y-5 w-full">
                      {data?.data?.map(tab => (
                        <NavLink
                          to={resolveCategoryRedirectLink(
                            tab?.redirectLink,
                            language
                          )}
                          key={tab?.category}
                          onClick={() => setIsSideBarOpen(false)}
                          className={({ isActive }) =>
                            `${
                              isActive
                                ? "text-[#7BD1FF] opacity-100"
                                : "text-text-black opacity-65"
                            } font-inter uppercase font-semibold text-sm hover:opacity-100 transition-all duration-300`
                          }
                        >
                          {tab?.category}
                        </NavLink>
                      ))}
                    </div>
                    <div className="flex flex-col gap-y-5">
                      <ul className="flex items-center gap-4 px-5">
                        {topNavLinks.map(item => (
                          <li key={item.title}>
                            <Link className="flex items-center gap-2">
                              <div className="text-primary font-inter text-base font-medium">
                                {item.svg}
                              </div>
                              <p className="font-interTight text-sm text-text-gray">
                                {item.title}
                              </p>
                            </Link>
                          </li>
                        ))}
                        <li>
                          <button
                            onClick={handleLanguageToggle}
                            className="flex items-center gap-2"
                          >
                            <div className="text-primary font-inter text-base font-medium">
                              <EarthSvgNavbar />
                            </div>
                            <p className="font-interTight text-sm text-text-gray uppercase  ">
                              {language}
                            </p>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
//
