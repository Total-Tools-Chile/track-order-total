import { Collapse, Timeline, theme, Typography } from "antd";
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
  "Clasificado en Bodega": {
    color: "orange",
    icon: <SolutionOutlined twoToneColor="#036066" />
  },
  "Recepcionado en Agencia": { color: "green", icon: <HomeOutlined /> },
  "En proceso de despacho": { color: "cyan", icon: <TruckOutlined /> },
  "Procesando para envio": { color: "purple", icon: <TruckOutlined /> },
  "En Viaje entre regiones": { color: "blue", icon: <TruckOutlined /> },
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
  return (
    <div style={{ overflowY: "auto", maxHeight: "300px", padding: "1.5rem" }}>
      <Timeline mode="alternate">
        {trackingData?.map((item, index) => {
          const { color, icon } = stateStyleMap[item.ULTIMO_ESTADO.trim()] || {
            color: "gray",
            icon: <ClockCircleOutlined />
          };
          return (
            <Timeline.Item
              key={index}
              dot={icon}
              color={color}
              style={{ lineHeight: "1" }}
            >
              <p style={{ fontWeight: "bold" }}> {item.ULTIMO_ESTADO}</p>
              <p style={{ fontSize: "0.6rem", color: "#8c8c8c" }}>
                {item.FECHA}
              </p>
              <p style={{ fontSize: "0.6rem", color: "#8c8c8c" }}>
                {item.ULTIMA_AGENCIA}
              </p>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </div>
  );
};

const TimeLineTracker = ({ trackingData }) => {
  const { token } = theme.useToken();
  const panelStyle = {
    borderRadius: token.borderRadiusLG,
    border: "1px solid #f0f0f0",
    overflow: "hidden",
    padding: "1rem",
    background: token.colorBgContainer
  };

  if (!trackingData) return <SkeletonTimeLineTracker />;

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
    >
      <Collapse.Panel
        header={
          <>
            <Text strong>Seguimiento del Envío</Text>
            <Text
              type="secondary"
              style={{ display: "block", marginTop: "0.5rem" }}
            >
              A veces, el seguimiento paso a paso puede no estar disponible. Si
              tienes problemas, haz click aquí para ver todo el proceso de tu
              compra.
            </Text>
          </>
        }
        key="1"
        style={panelStyle}
      >
        <ComponentTimeLineTracker trackingData={trackingData} />
      </Collapse.Panel>
    </Collapse>
  );
};

ComponentTimeLineTracker.propTypes = {
  trackingData: PropTypes.array.isRequired
};

TimeLineTracker.propTypes = {
  trackingData: PropTypes.array.isRequired
};

export default TimeLineTracker;
