import { Card, Steps, Typography } from "antd";
import {
  ShopOutlined,
  SolutionOutlined,
  TruckOutlined,
  SmileOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import SkeletonTimeLineOrder from "../components/Skeletons/SkeletonTimeLineOrder";

const { Step } = Steps;
const { Text, Title } = Typography;

// Mapea varios mensajes de estado de seguimiento a un conjunto común de etapas
const statusToStepMap = {
  Venta: "Ordenada",
  "Clasificado en Bodega": "Procesada",
  "Recepcionado en Agencia": "Enviada",
  "En proceso de despacho": "Enviada",
  "Procesando para envio": "Enviada",
  "En Viaje entre regiones": "En tránsito",
  "Recepcionado en lugar de entrega": "En reparto",
  "Clasificado en bodega para reparto": "En reparto",
  "En proceso de reparto": "En reparto",
  "En reparto": "En reparto",
  Entregado: "Entregada"
};

const getLatestStep = (trackingData) => {
  return trackingData?.reduce((latest, event) => {
    const step = statusToStepMap[event.ULTIMO_ESTADO.trim()];
    const stepOrder = [
      "Ordenada",
      "Procesada",
      "Enviada",
      "En tránsito",
      "En reparto",
      "Entregada"
    ];
    return stepOrder.indexOf(step) > stepOrder.indexOf(latest) ? step : latest;
  }, "Ordenada");
};

const TimeLineOrder = ({ trackingData }) => {
  if (!trackingData) return <SkeletonTimeLineOrder />;

  const isBluex =
    trackingData?.provider === "bluexpress" && trackingData?.frontend;
  const currentStep = isBluex ? null : getLatestStep(trackingData);
  const currentStepIndex = isBluex
    ? Number(trackingData.frontend.stepIndex || 0)
    : [
        "Ordenada",
        "Procesada",
        "Enviada",
        "En tránsito",
        "En reparto",
        "Entregada"
      ].indexOf(currentStep);

  return (
    <Card className="tracking-route-card">
      <div className="tracking-route-card__header">
        <div>
          <Text className="tracking-eyebrow">Ruta operativa</Text>
          <Title level={4} className="tracking-panel__title">
            Hitos del despacho
          </Title>
        </div>
        <Text className="tracking-muted">
          Esta secuencia resume el punto exacto en el que va tu envío.
        </Text>
      </div>
      <Steps
        labelPlacement="vertical"
        current={currentStepIndex}
        className="tracking-route-steps"
      >
        <Step
          title="Ordenada"
          icon={<ShopOutlined style={{ color: "#016066" }} />}
          description="La orden ha sido realizada."
          iconPrefix=""
        />
        <Step
          title="Procesada"
          icon={<SolutionOutlined style={{ color: "#016066" }} />}
          description="La orden está siendo procesada."
        />
        <Step
          title="Enviada"
          icon={<TruckOutlined style={{ color: "#016066" }} />}
          description="La orden ha sido enviada."
        />
        <Step
          title="En tránsito"
          icon={<TruckOutlined style={{ color: "#016066" }} />}
          description="La orden está en tránsito."
        />
        <Step
          title="En reparto"
          icon={<TruckOutlined style={{ color: "#016066" }} />}
          description="La orden está en reparto."
        />
        <Step
          title="Entregada"
          icon={<SmileOutlined style={{ color: "#016066" }} />}
          description="La orden ha sido entregada."
        />
      </Steps>
    </Card>
  );
};

TimeLineOrder.propTypes = {
  trackingData: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default TimeLineOrder;
