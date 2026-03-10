import { useEffect } from "react";
import { Card, Carousel, Typography } from "antd";
import { promos } from "../config/promos";

const { Text, Title } = Typography;

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
    <Card className="tracking-panel tracking-panel--compact">
      <div className="tracking-panel__header">
        <div>
          <Text className="tracking-eyebrow">Promociones vigentes</Text>
          <Title level={4} className="tracking-panel__title">
            Aprovecha mientras llega tu pedido
          </Title>
        </div>
      </div>
      <Carousel autoplay dots draggable className="tracking-promo-carousel">
        {promos.map((p, idx) => {
          const desktop = p.srcDesktop || p.src;
          const mobile = p.srcMobile || p.src || p.srcDesktop;
          return (
            <a
              key={idx}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="tracking-promo-slide"
            >
              <picture>
                {mobile && (
                  <source media="(max-width: 768px)" srcSet={mobile} />
                )}
                <img
                  src={desktop}
                  alt={p.alt}
                  loading="lazy"
                  className="tracking-promo-slide__image"
                />
              </picture>
            </a>
          );
        })}
      </Carousel>
    </Card>
  );
};

export default PromoSlider;
