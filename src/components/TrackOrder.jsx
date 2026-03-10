import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Alert, Col, Layout, Row } from "antd";
import CustomerInfo from "./CustomerInfo";
import TimeLineOrder from "./TimeLineOrder";

import TimeLineTracker from "./TimeLineTracker";
import ProductsList from "./ListOfProducts";
import { FloatingWhatsApp } from "./WhatsAppButton/FloatingWhatsApp";
import InfoDestiny from "./InfoDestiny";
import FAQ from "./FAQ";
import StatusSummary from "./StatusSummary";
import SupportHelp from "./SupportHelp";
import PromoSlider from "./PromoSlider";

const { Content, Footer } = Layout;

// Dentro de tu componente o donde necesites acceder a las variables de entorno
const API_BASE = (() => {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL || "").trim();
  // Si no es una URL http/https válida, forzamos el backend correcto
  if (/^https?:\/\//i.test(fromEnv)) {
    // normaliza removiendo slashes finales duplicados
    return fromEnv.replace(/\/+$/, "");
  }
  return "http://localhost:4444";
})();
const CHX_USER_ID =
  (import.meta.env.VITE_CHX_USER_ID || "").trim() || "6414b5c318ef9e551c2bde68";
const BX_USER_ID =
  (import.meta.env.VITE_BX_USER_ID || "").trim() || "6414b5c318ef9e551c2bde68";
const SHOPIFY_USER_ID =
  (import.meta.env.VITE_SHOPIFY_USER_ID || "").trim() ||
  "6414b5c318ef9e551c2bde68";
// Desde ahora, todas las llamadas pasan por el backend (fly.dev). No usamos token ni userId en el cliente.

const getODT = (order) => {
  if (!order || typeof order !== "object") return "";
  return (
    order.ODT ||
    order.odt ||
    order.transportOrderNumber ||
    order.trackingNumber ||
    order.codigo ||
    ""
  );
};

const getShopifyId = (order) => {
  if (!order || typeof order !== "object") return "";
  return (
    order.idShop ||
    order.id_shop ||
    order.shopifyId ||
    order.shopify_id ||
    order.orderIdShopify ||
    ""
  );
};

const pickOrderFromResponse = (raw, wantedOdt) => {
  try {
    if (!raw) return null;
    if (Array.isArray(raw)) {
      const byMatch =
        raw.find(
          (it) =>
            getODT(it) && String(getODT(it)).trim() === String(wantedOdt).trim()
        ) || raw[0];
      return byMatch || null;
    }
    if (typeof raw === "object") return raw;
    return null;
  } catch {
    return null;
  }
};

const toSentenceCase = (value = "") => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  if (!normalized) return "";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const normalizeBluexpressTracking = (bxResponse) => {
  try {
    const frontend = bxResponse?.frontend || null;
    const data = bxResponse?.data || null;
    const packages = Array.isArray(data?.packages) ? data.packages : [];

    const events = packages
      .flatMap((pkg) =>
        (Array.isArray(pkg?.trackings) ? pkg.trackings : []).map((tracking) => ({
          key: `${pkg?.packageId || "pkg"}-${tracking?.trackingId || "evt"}`,
          title: toSentenceCase(
            tracking?.eventCodeDesc ||
              tracking?.evetCodeDesc ||
              tracking?.eventTypeDesc ||
              frontend?.statusDescription ||
              frontend?.stepTitle ||
              "Evento registrado"
          ),
          date: tracking?.eventDate || tracking?.creationDate || "",
          location: tracking?.location || data?.deliveryAddress?.fullAddress || "",
          statusCode: tracking?.eventCode || frontend?.statusCode || "",
          packageId: pkg?.packageId || ""
        }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      provider: "bluexpress",
      frontend,
      raw: data,
      events
    };
  } catch (error) {
    console.error("Normalize Bluexpress error:", error);
    return {
      provider: "bluexpress",
      frontend: bxResponse?.frontend || null,
      raw: bxResponse?.data || null,
      events: []
    };
  }
};

function TrackOrder() {
  const { orderId } = useParams(); // Extrae el ID del pedido de la URL
  const [orderDetails, setOrderDetails] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [shopifyDetails, setShopifyDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch initial order details
  useEffect(() => {
    const url = `${API_BASE}/shopsale/v1/order-pullman-track?ODT=${encodeURIComponent(
      orderId
    )}`;
    fetch(url)
      .then(async (response) => {
        const text = await response.text();
        try {
          return text ? JSON.parse(text) : null;
        } catch (e) {
          console.error("Respuesta no JSON de order-pullman-track:", text);
          return null;
        }
      })
      .then((data) => {
        const picked = pickOrderFromResponse(data, orderId);
        if (!picked) {
          setErrorMessage(
            `No se encontró una orden para el ODT ${orderId}. Verifica el número.`
          );
          setOrderDetails(null);
          return;
        }
        setErrorMessage("");
        setOrderDetails(picked);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        setErrorMessage(
          "No pudimos obtener la orden. Intenta nuevamente en unos minutos."
        );
      });
  }, [orderId]); // Only depends on orderId

  // Fetch tracking and shopify details once orderDetails is available
  useEffect(() => {
    if (orderDetails) {
      const isChilexpressOrder = (order) => {
        const carrierLike =
          (order?.carrier ||
            order?.empresa ||
            order?.courier ||
            order?.shippingCompany ||
            order?.transportCompany ||
            order?.carrierName ||
            order?.empresaEnvio ||
            order?.servicio ||
            order?.serviceName ||
            "") + "";
        return carrierLike.toLowerCase().includes("chilexpress");
      };

      const isBluexpressOrder = (order) => {
        const carrierLike =
          (order?.carrier ||
            order?.empresa ||
            order?.courier ||
            order?.shippingCompany ||
            order?.transportCompany ||
            order?.carrierName ||
            order?.empresaEnvio ||
            order?.servicio ||
            order?.serviceName ||
            "") + "";
        const s = carrierLike.toLowerCase();
        return (
          s.includes("bluexpress") ||
          s.includes("blue express") ||
          s.includes("bluex")
        );
      };

      const buildChilexpressUrl = () =>
        `${API_BASE}/shopsale/v1/chilexpress/${CHX_USER_ID}/tracking`;

      const buildChilexpressRequestOptions = (odt) => {
        const transportOrderNumber =
          Number(odt) || (typeof odt === "string" ? odt : "");
        // RUT fijo definido por backend
        const rutNum = 76338734;
        return {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            transportOrderNumber,
            rut: rutNum,
            showTrackingEvents: 1
          }),
          redirect: "follow"
        };
      };

      const load = async () => {
        try {
          const odt = getODT(orderDetails) || orderId;
          if (!odt) {
            setErrorMessage(
              "La orden no contiene ODT válido para consultar tracking."
            );
            return;
          }
          if (isBluexpressOrder(orderDetails)) {
            const bxUrl = `${API_BASE}/shopsale/v1/public/bluexpress/${BX_USER_ID}/tracking/${encodeURIComponent(
              odt
            )}`;
            const bxResp = await fetch(bxUrl);
            if (!bxResp.ok) throw new Error(`Bluexpress status ${bxResp.status}`);
            const bx = await bxResp.json();
            setTrackingInfo(normalizeBluexpressTracking(bx));
            return;
          }
          if (isChilexpressOrder(orderDetails)) {
            // Ir directo a Chilexpress usando el ODT encontrado en Mongo
            const chxUrl = buildChilexpressUrl();
            const chxResp = await fetch(
              chxUrl,
              buildChilexpressRequestOptions(odt)
            );
            if (!chxResp.ok)
              throw new Error(`Chilexpress status ${chxResp.status}`);
            const chx = await chxResp.json();
            const normalized = normalizeChilexpressTracking(chx);
            setTrackingInfo(normalized);
          } else {
            // Pullman por defecto
            const resp = await fetch(
              `${API_BASE}/shopsale/v1/pullman/tracking/${encodeURIComponent(
                odt
              )}?codigoComercio=INTTOTAL2023`
            );
            if (!resp.ok) {
              throw new Error(`Pullman status ${resp.status}`);
            }
            const data = await resp.json();
            const hasPullman =
              Array.isArray(data?.Seguimiento) && data.Seguimiento.length > 0;
            if (hasPullman) {
              setTrackingInfo(data.Seguimiento);
            } else if (isChilexpressOrder(orderDetails)) {
              // Fallback por falta de eventos
              try {
                const chxUrl = buildChilexpressUrl();
                const chxResp = await fetch(
                  chxUrl,
                  buildChilexpressRequestOptions(odt)
                );
                if (!chxResp.ok)
                  throw new Error(`Chilexpress status ${chxResp.status}`);
                const chx = await chxResp.json();
                const normalized = normalizeChilexpressTracking(chx);
                setTrackingInfo(normalized);
              } catch (err) {
                console.error("Fallback Chilexpress error:", err);
              }
            }
          }
        } catch (error) {
          console.error("Pullman tracking error:", error);
          // Fallback inmediato si Pullman arrojó error y la orden es de Chilexpress
          if (isChilexpressOrder(orderDetails)) {
            try {
              const odt = getODT(orderDetails) || orderId;
              const chxUrl = buildChilexpressUrl();
              const chxResp = await fetch(
                chxUrl,
                buildChilexpressRequestOptions(odt)
              );
              if (!chxResp.ok)
                throw new Error(`Chilexpress status ${chxResp.status}`);
              const chx = await chxResp.json();
              const normalized = normalizeChilexpressTracking(chx);
              setTrackingInfo(normalized);
            } catch (err) {
              console.error("Fallback Chilexpress error:", err);
            }
          }
        } finally {
          const shopId = getShopifyId(orderDetails);
          if (shopId) {
            try {
              // Consultar pedido Shopify vía backend usando idShop de la orden
              const shopifyUrl = `${API_BASE}/shopsale/v1/shopify/${SHOPIFY_USER_ID}/orders?orderId=${encodeURIComponent(
                shopId
              )}`;
              const response = await fetch(shopifyUrl, { method: "GET" });
              if (!response.ok) {
                console.error(`Shopify status ${response.status}`);
              } else {
                const data = await response.json();
                const normalized = normalizeShopifyOrder(data);
                if (normalized) setShopifyDetails(normalized);
              }
            } catch (e) {
              console.error("Error fetching Shopify data:", e);
            }
          }
        }
      };

      load();
    }
  }, [orderDetails, orderId]);

  // Adapta respuesta Chilexpress al formato esperado por el UI (ULTIMO_ESTADO, FECHA, ULTIMA_AGENCIA)
  const normalizeChilexpressTracking = (chxResponse) => {
    try {
      const data = chxResponse?.data;
      const events = Array.isArray(data?.trackingEvents)
        ? data.trackingEvents
        : [];

      const mapDescriptionToEstado = (desc = "") => {
        const d = desc.toUpperCase();
        if (d.includes("ENTREGADA")) return "Entregado";
        if (d.includes("RUTA AL") || d.includes("RUTA AL  DESTINATARIO"))
          return "En reparto";
        if (d.includes("DISPONIBLE EN OFICINA"))
          return "Recepcionado en lugar de entrega";
        if (
          d.includes("RECEPCION TRANSFERENCIA") ||
          d.includes("TRANSFERENCIA")
        )
          return "En Viaje entre regiones";
        if (d.includes("RETIRO DESDE PDT")) return "En proceso de despacho";
        if (d.includes("RECEPCIONADA")) return "Recepcionado en Agencia";
        // Estado genérico si no calza con ninguno -> que compute "Enviada"
        return "En proceso de despacho";
      };

      const normalizedFromEvents = events.map((evt) => {
        const estado = mapDescriptionToEstado(evt?.description);
        const fecha =
          evt?.eventDateTime ||
          `${evt?.eventDate} ${evt?.eventHour || ""}`.trim();
        return {
          ULTIMO_ESTADO: estado,
          FECHA: fecha,
          ULTIMA_AGENCIA: evt?.location || ""
        };
      });

      if (normalizedFromEvents.length > 0) return normalizedFromEvents;

      // Si no hay eventos aún (pre-recepción), generar un placeholder con datos de la orden
      const location =
        data?.transportOrderData?.locationStatus ||
        data?.addressData?.originCoverageCode ||
        "";
      // Sin eventos => mostrar como "Procesada" en el UI (usando estado que mapea a esa etapa)
      const estadoFallback = "Clasificado en Bodega";
      return [
        {
          ULTIMO_ESTADO: estadoFallback,
          FECHA: "",
          ULTIMA_AGENCIA: location
        }
      ];
    } catch (e) {
      console.error("Normalize Chilexpress error:", e);
      return [];
    }
  };

  // Normaliza la respuesta del nuevo endpoint Shopify al formato esperado por el UI
  const normalizeShopifyOrder = (shopifyResponse) => {
    try {
      const order = shopifyResponse?.data?.order;
      if (!order) return null;

      // Mapear lineItems de edges a arreglo similar al usado actualmente
      const edges = order?.lineItems?.edges || [];
      const lineItems = edges.map((edge) => {
        const node = edge?.node || {};
        const variantGid = node?.variant?.id || "";
        // Extraer el ID numérico del GID: gid://shopify/ProductVariant/41000787017898
        const variantId = (() => {
          const parts = variantGid.split("/");
          return parts[parts.length - 1] || "";
        })();
        return {
          name: node?.title || "",
          price: node?.variant?.price || "0",
          quantity: node?.quantity || 0,
          total_discount: "0",
          variant_id: variantId
        };
      });

      // Shipping address al formato previo
      const shippingAddress = order?.shippingAddress || {};
      const shipping_address = {
        province: shippingAddress?.province || "",
        city: shippingAddress?.city || ""
      };

      // Mapear customAttributes -> note_attributes esperadas por InfoDestiny
      const note_attributes = Array.isArray(order?.customAttributes)
        ? order.customAttributes.map((attr) => ({
            name: attr?.key || "",
            value: attr?.value || ""
          }))
        : [];

      return {
        order: {
          line_items: lineItems,
          shipping_address,
          note_attributes
        },
        qtyProducts: lineItems.reduce(
          (acc, it) => acc + (Number(it.quantity) || 0),
          0
        )
      };
    } catch (e) {
      console.error("Normalize Shopify error:", e);
      return null;
    }
  };

  return (
    <Layout className="tracking-shell">
      <Content className="tracking-shell__content">
        {errorMessage && (
          <Alert
            message="No pudimos recuperar la orden"
            description={errorMessage}
            type="error"
            showIcon
            className="tracking-alert"
          />
        )}

        <CustomerInfo orderDetails={orderDetails} />
        <StatusSummary trackingData={trackingInfo} />
        <TimeLineOrder trackingData={trackingInfo} />

        <Row gutter={[20, 20]} className="tracking-grid">
          <Col xs={24} xl={15}>
            <div className="tracking-stack">
              <TimeLineTracker trackingData={trackingInfo} />
              <InfoDestiny client={shopifyDetails} />
              <PromoSlider />
            </div>
          </Col>
          <Col xs={24} xl={9}>
            <div className="tracking-stack">
              <ProductsList lineItems={shopifyDetails?.order?.line_items} />
              <SupportHelp carrierName={orderDetails?.carrier} />
              <FAQ />
            </div>
          </Col>
        </Row>
      </Content>
      <FloatingWhatsApp />
      <Footer className="tracking-footer">
        <div className="tracking-footer__inner">
          <div className="tracking-footer__copy">
            © {new Date().getFullYear()} Herramientas Total. Todos los derechos
            reservados.
          </div>
        </div>
      </Footer>
    </Layout>
  );
}

export default TrackOrder;
