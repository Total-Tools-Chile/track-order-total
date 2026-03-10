import { Card, Collapse, Timeline, Typography } from "antd";
import {
  CaretRightOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  TruckOutlined,
  SmileOutlined,
  SolutionOutlined,
  HomeOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import SkeletonTimeLineTracker from "./Skeletons/SkeletonTimeLineTracker";

const { Text } = Typography;

const stateStyleMap = {
  Venta: { color: "blue", icon: <ShopOutlined /> },
  Ordenada: { color: "blue", icon: <ShopOutlined /> },
  "Clasificado en Bodega": {
    color: "orange",
    icon: <SolutionOutlined twoToneColor="#016066" />
  },
  Procesada: { color: "orange", icon: <SolutionOutlined /> },
  "Guia en digitacion": { color: "orange", icon: <SolutionOutlined /> },
  "Guia enviada": { color: "cyan", icon: <TruckOutlined /> },
  "Recepcionado en Agencia": { color: "green", icon: <HomeOutlined /> },
  "En proceso de despacho": { color: "cyan", icon: <TruckOutlined /> },
  "Procesando para envio": { color: "purple", icon: <TruckOutlined /> },
  Enviada: { color: "purple", icon: <TruckOutlined /> },
  "En Viaje entre regiones": { color: "blue", icon: <TruckOutlined /> },
  "En transito": { color: "blue", icon: <TruckOutlined /> },
  "En tránsito": { color: "blue", icon: <TruckOutlined /> },
  "Recepcionado en lugar de entrega": {
    color: "volcano",
    icon: <HomeOutlined />
  },
  "Clasificado en bodega para reparto": {
    color: "gold",
    icon: <HomeOutlined />
  },
  "En proceso de reparto": { color: "lime", icon: <TruckOutlined /> },
  "Reingresado a bodega": { color: "red", icon: <TruckOutlined /> },
  "En reparto": { color: "green", icon: <TruckOutlined /> },
  Entregado: { color: "green", icon: <SmileOutlined /> }
};

const ComponentTimeLineTracker = ({ trackingData }) => {
  const isBluex =
    trackingData?.provider === "bluexpress" && trackingData?.frontend;
  const items = isBluex
    ? Array.isArray(trackingData?.events) && trackingData.events.length > 0
      ? trackingData.events
      : Array.isArray(trackingData?.frontend?.steps)
        ? trackingData.frontend.steps
        : []
    : Array.isArray(trackingData)
      ? trackingData
      : [];

  return (
    <div className="tracking-events">
      <Timeline className="tracking-events__timeline">
        {items.map((item, index) => {
          const title = isBluex
            ? item?.title || item?.status
            : item?.ULTIMO_ESTADO;
          const date = isBluex ? item?.date || item?.updatedAt : item?.FECHA;
          const agency = isBluex
            ? item?.location || item?.agency || ""
            : item?.ULTIMA_AGENCIA;
          const normalizedTitle = String(title || "").trim();
          const { color, icon } = stateStyleMap[normalizedTitle] || {
            color: "gray",
            icon: <ClockCircleOutlined />
          };
          return (
            <Timeline.Item
              key={index}
              dot={icon}
              color={color}
              className="tracking-events__item"
            >
              <div className="tracking-events__item-title">{normalizedTitle}</div>
              <div className="tracking-events__item-meta">{date}</div>
              {agency ? (
                <div className="tracking-events__item-meta">{agency}</div>
              ) : null}
            </Timeline.Item>
          );
        })}
      </Timeline>
    </div>
  );
};

const TimeLineTracker = ({ trackingData }) => {
  if (!trackingData) return <SkeletonTimeLineTracker />;

  return (
    <Card className="tracking-panel tracking-panel--compact">
      <div className="tracking-panel__header">
        <div>
          <Text className="tracking-eyebrow">Bitácora del courier</Text>
          <div className="tracking-panel__title">Eventos de transporte</div>
        </div>
      </div>
      <Collapse
        bordered={false}
        defaultActiveKey={["1"]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className="tracking-collapse"
        items={[
          {
            key: "1",
            label: (
              <div>
                <Text strong>Seguimiento paso a paso</Text>
                <Text className="tracking-muted tracking-collapse__subtitle">
                  Si el courier demora en propagar hitos, aquí seguirás viendo
                  el último evento operativo disponible.
                </Text>
              </div>
            ),
            children: <ComponentTimeLineTracker trackingData={trackingData} />
          }
        ]}
      />
    </Card>
  );
};

ComponentTimeLineTracker.propTypes = {
  trackingData: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

TimeLineTracker.propTypes = {
  trackingData: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default TimeLineTracker;
