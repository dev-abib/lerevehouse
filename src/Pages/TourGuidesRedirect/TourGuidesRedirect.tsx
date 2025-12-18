// src/Pages/TourGuidesRedirect/TourGuidesRedirect.tsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TourGuidesRedirect = () => {
  const navigate = useNavigate();
  const { id, slug } = useParams();

  useEffect(() => {
    if (id && slug) {
      // qui manca destinationSlug → lo ricaveremo dopo dallo switch lingua,
      // per ora fai un redirect “povero”
      navigate(`/tour-guides/${id}/alaska-destination/${slug}`, { replace: true });
      // oppure semplicemente resta su 2 segmenti se non vuoi forzare la migrazione ora
      // navigate(`/tour-guides/${id}/${slug}`, { replace: true });
    }
  }, [id, slug, navigate]);

  return null;
};

export default TourGuidesRedirect;
