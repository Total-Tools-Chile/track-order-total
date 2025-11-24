import { useEffect } from "react";
import { Carousel } from "antd";
import { promos } from "../config/promos";

const PromoSlider = () => {
  useEffect(() => {
    if (promos[0]?.src) {
      // Compatibilidad antigua si existe 'src'
      const img = new Image();
      img.src = promos[0].src; // preload primer slide (legacy)
    }
    // Preload de imágenes desktop y móvil del primer slide si existen
    if (promos[0]?.srcDesktop) {
      const imgD = new Image();
      imgD.src = promos[0].srcDesktop;
    }
    if (promos[0]?.srcMobile) {
      const imgM = new Image();
      imgM.src = promos[0].srcMobile;
    }
  }, []);

  return (
    <div style={{ margin: "0 10px", marginTop: "1rem" }}>
      <Carousel autoplay dots draggable>
        {promos.map((p, idx) => {
          const desktop = p.srcDesktop || p.src;
          const mobile = p.srcMobile || p.src || p.srcDesktop;
          return (
            <a key={idx} href={p.href} target="_blank" rel="noreferrer">
              {/* Lazy load + responsive por dispositivo */}
              <picture>
                {mobile && (
                  <source media="(max-width: 768px)" srcSet={mobile} />
                )}
                <img
                  src={desktop}
                  alt={p.alt}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 8,
                    objectFit: "cover"
                  }}
                />
              </picture>
            </a>
          );
        })}
      </Carousel>
    </div>
  );
};

export default PromoSlider;
