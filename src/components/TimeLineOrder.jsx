import { Steps } from "antd";
import {
  ShopOutlined,
  SolutionOutlined,
  TruckOutlined,
  SmileOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import SkeletonTimeLineOrder from "../components/Skeletons/SkeletonTimeLineOrder";

const { Step } = Steps;

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
  const currentStep = getLatestStep(trackingData);
  const currentStepIndex = [
    "Ordenada",
    "Procesada",
    "Enviada",
    "En tránsito",
    "En reparto",
    "Entregada"
  ].indexOf(currentStep);

  if (!trackingData) return <SkeletonTimeLineOrder />;

  return (
    <div style={{ marginTop: "1rem", padding: "2rem" }}>
      <Steps labelPlacement="vertical" current={currentStepIndex}>
        <Step
          title="Ordenada"
          icon={<ShopOutlined style={{ color: "#036066" }} />}
          description="La orden ha sido realizada."
          iconPrefix=""
        />
        <Step
          title="Procesada"
          icon={<SolutionOutlined style={{ color: "#036066" }} />}
          description="La orden está siendo procesada."
        />
        <Step
          title="Enviada"
          icon={<TruckOutlined style={{ color: "#036066" }} />}
          description="La orden ha sido enviada."
        />
        <Step
          title="En tránsito"
          icon={<TruckOutlined style={{ color: "#036066" }} />}
          description="La orden está en tránsito."
        />
        <Step
          title="En reparto"
          icon={<TruckOutlined style={{ color: "#036066" }} />}
          description="La orden está en reparto."
        />
        <Step
          title="Entregada"
          icon={<SmileOutlined style={{ color: "#036066" }} />}
          description="La orden ha sido entregada."
        />
      </Steps>
    </div>
  );
};

TimeLineOrder.propTypes = {
  trackingData: PropTypes.object
};

export default TimeLineOrder;
