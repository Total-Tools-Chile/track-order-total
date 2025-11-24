import { Card, Tag, Typography } from "antd";

const { Text } = Typography;

const estadoColorMap = {
  Ordenada: "blue",
  Procesada: "orange",
  Enviada: "purple",
  "En tránsito": "geekblue",
  "En reparto": "green",
  Entregada: "success"
};

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

const parseDate = (str) => {
  if (!str) return null;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  // fallback: try DD/MM/YYYY HH:mm:ss
  const parts = String(str).split(" ");
  const [dd, mm, yyyy] = (parts[0] || "").split("/");
  if (dd && mm && yyyy) {
    const time = parts[1] || "00:00:00";
    return new Date(`${yyyy}-${mm}-${dd}T${time.replace(" ", "")}`);
  }
  return null;
};

const humanizeDiff = (date) => {
  if (!date) return "desconocido";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "menos de 1 min";
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h`;
  const days = Math.floor(hrs / 24);
  return `${days} d`;
};

const estimateEta = (step) => {
  switch (step) {
    case "En reparto":
      return "Hoy antes de las 21:00";
    case "En tránsito":
      return "1-2 días hábiles";
    case "Enviada":
      return "2-3 días hábiles";
    case "Procesada":
      return "2-4 días hábiles";
    case "Entregada":
      return "Entregado";
    default:
      return "En evaluación";
  }
};

const getLatestEvent = (trackingData) => {
  if (!Array.isArray(trackingData) || trackingData.length === 0) return null;
  return trackingData[0]; // asumiendo más reciente primero; si no, ordenar por fecha
};

const StatusSummary = ({ trackingData }) => {
  if (!trackingData) return null;
  const latest = getLatestEvent(trackingData);
  const estado = latest?.ULTIMO_ESTADO?.trim();
  const step = statusToStepMap[estado] || "Enviada";
  const color = estadoColorMap[step] || "default";
  const fecha = latest?.FECHA;
  const parsed = parseDate(fecha);
  const lastUpdate = humanizeDiff(parsed);
  const eta = estimateEta(step);
  const isPlaceholderProcessed =
    (!parsed || !fecha) &&
    (estado === "Clasificado en Bodega" || step === "Procesada");
  const lastUpdateLabel = isPlaceholderProcessed
    ? "Procesada en bodega"
    : `Última actualización: ${lastUpdate}`;

  return (
    <Card
      size="small"
      style={{ margin: "0 10px", border: "1px solid #f0f0f0" }}
      bodyStyle={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        flexWrap: "wrap"
      }}
    >
      <Tag color={color} style={{ marginRight: 8 }}>
        {step}
      </Tag>
      <Text type="secondary">{lastUpdateLabel}</Text>
      <Text strong style={{ marginLeft: "auto" }}>
        ETA estimada: {eta}
      </Text>
    </Card>
  );
};

export default StatusSummary;
