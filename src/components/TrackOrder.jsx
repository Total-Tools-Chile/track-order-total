import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CustomerInfo from "./CustomerInfo";
import TimeLineOrder from "./TimeLineOrder";
import { Layout } from "antd";

import TimeLineTracker from "./TimeLineTracker";
import ProductsList from "./ListOfProducts";
import { FloatingWhatsApp } from "./WhatsAppButton/FloatingWhatsApp";
import InfoDestiny from "./InfoDestiny";
import FAQ from "./FAQ";
import StatusSummary from "./StatusSummary";
import SupportHelp from "./SupportHelp";
import PromoSlider from "./PromoSlider";

// Dentro de tu componente o donde necesites acceder a las variables de entorno
const API_BASE = (() => {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL || "").trim();
  // Si no es una URL http/https válida, forzamos el backend correcto
  if (/^https?:\/\//i.test(fromEnv)) {
    // normaliza removiendo slashes finales duplicados
    return fromEnv.replace(/\/+$/, "");
  }
  return "https://shopy-sale-v2.fly.dev";
})();
const CHX_USER_ID =
  (import.meta.env.VITE_CHX_USER_ID || "").trim() || "6414b5c318ef9e551c2bde68";
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

function TrackOrder() {
  const { orderId } = useParams(); // Extrae el ID del pedido de la URL
  const [orderDetails, setOrderDetails] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [shopifyDetails, setShopifyDetails] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  console.log(orderDetails, trackingInfo, shopifyDetails);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

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
    <Layout style={{ maxWidth: "1200px", margin: "2rem auto" }}>
      {errorMessage && (
        <div
          style={{
            color: "#b91c1c",
            background: "#fee2e2",
            border: "1px solid #fecaca",
            padding: "8px 12px",
            borderRadius: 6,
            margin: "0 10px 12px"
          }}
        >
          {errorMessage}
        </div>
      )}
      <CustomerInfo orderDetails={orderDetails} />
      <TimeLineOrder trackingData={trackingInfo} />
      <StatusSummary trackingData={trackingInfo} />
      <InfoDestiny client={shopifyDetails} />
      <div
        className="track-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "12px" : "20px"
        }}
      >
        <div
          className="track-flex"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "space-around"
          }}
        >
          <div
            className="track-col"
            style={{ flex: "1 1 300px", margin: isMobile ? "0 6px" : "0 10px" }}
          >
            <TimeLineTracker trackingData={trackingInfo} />
          </div>
          <div
            className="track-col"
            style={{ flex: "1 1 300px", margin: isMobile ? "0 6px" : "0 10px" }}
          >
            <ProductsList lineItems={shopifyDetails?.order?.line_items} />
          </div>
        </div>
        <PromoSlider />
        <SupportHelp carrierName={orderDetails?.carrier} />
        <FAQ />
      </div>

      <FloatingWhatsApp />
      <Layout.Footer
        style={{
          padding: "24px 16px",
          background: "#fafafa"
        }}
      >
        <div style={{ width: "100%", margin: "0 auto" }}>
          <div
            style={{
              marginTop: "16px",
              textAlign: "center",
              color: "#8c8c8c",
              fontSize: "12px"
            }}
          >
            © {new Date().getFullYear()} Herramientas Total. Todos los derechos
            reservados.
          </div>
        </div>
      </Layout.Footer>
    </Layout>
  );
}

export default TrackOrder;
