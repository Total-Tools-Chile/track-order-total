import { Steps } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Step } = Steps;

const SkeletonTimeLineOrder = () => {
  return (
    <div style={{ marginTop: "5rem", padding: "2rem" }}>
      <Steps labelPlacement="vertical">
        <Step
          title="Ordenada"
          icon={<LoadingOutlined style={{ color: "#036066" }} />}
          description="Cargando..."
        />
        <Step
          title="Procesada"
          icon={<LoadingOutlined style={{ color: "#036066" }} />}
          description="Cargando..."
        />
        <Step
          title="Enviada"
          icon={<LoadingOutlined style={{ color: "#036066" }} />}
          description="Cargando..."
        />
        <Step
          title="En tránsito"
          icon={<LoadingOutlined style={{ color: "#036066" }} />}
          description="Cargando..."
        />
        <Step
          title="En reparto"
          icon={<LoadingOutlined style={{ color: "#036066" }} />}
          description="Cargando..."
        />
        <Step
          title="Entregada"
          icon={<LoadingOutlined style={{ color: "#036066" }} />}
          description="Cargando..."
        />
      </Steps>
    </div>
  );
};

export default SkeletonTimeLineOrder;
