import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CustomerInfo from "./CustomerInfo";
import TimeLineOrder from "./TimeLineOrder";
import { Layout } from "antd";
import TimeLineTracker from "./TimeLineTracker";
import ProductsList from "./ListOfProducts";
import { FloatingWhatsApp } from "./WhatsAppButton/FloatingWhatsApp";

// Dentro de tu componente o donde necesites acceder a las variables de entorno
const apiKey = import.meta.env.VITE_API_KEY;
const apiPassword = import.meta.env.VITE_API_PASSWORD;
const storeName = import.meta.env.VITE_STORE_NAME;

function TrackOrder() {
  const { orderId } = useParams(); // Extrae el ID del pedido de la URL
  const [orderDetails, setOrderDetails] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [shopifyDetails, setShopifyDetails] = useState(null);
  // Fetch initial order details
  useEffect(() => {
    fetch(
      `https://shopy-sale.herokuapp.com/shopsale/v1/order-pullman-track?ODT=${orderId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setOrderDetails(data);
      })
      .catch((error) => console.error("Error fetching order details:", error));
  }, [orderId]); // Only depends on orderId

  // Fetch tracking and shopify details once orderDetails is available
  useEffect(() => {
    if (orderDetails) {
      fetch(
        `https://mini-sentry.herokuapp.com/omni/v1/pullman/tracking/${orderDetails.ODT}`
      )
        .then((response) => response.json())
        .then((data) => {
          setTrackingInfo(data.Seguimiento);
          if (orderDetails.idShop) {
            return fetch(
              `https://shopy-sale.herokuapp.com/shopsale/v1/get-order-shopify/${orderDetails.idShop}?apiKey=${apiKey}&apiPassword=${apiPassword}&storeName=${storeName}`
            );
          }
        })
        .then((response) => (response ? response.json() : null))
        .then((data) => {
          if (data) setShopifyDetails(data);
        })
        .catch((error) =>
          console.error("Error fetching tracking or Shopify data:", error)
        );
    }
  }, [orderDetails]);

  return (
    <Layout style={{ maxWidth: "1200px", margin: "2rem auto" }}>
      <CustomerInfo orderDetails={orderDetails} />
      <TimeLineOrder trackingData={trackingInfo} />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around"
          }}
        >
          <div style={{ flex: "1 1 300px", margin: "0 10px" }}>
            <TimeLineTracker trackingData={trackingInfo} />
          </div>
          <div style={{ flex: "1 1 300px", margin: "0 10px" }}>
            <ProductsList lineItems={shopifyDetails?.order?.line_items} />
          </div>
        </div>
      </div>

      <FloatingWhatsApp />
    </Layout>
  );
}

export default TrackOrder;
