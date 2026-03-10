import { Card, Progress, Tag, Typography } from "antd";

const { Text, Title } = Typography;

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

const progressByStep = {
  Ordenada: 16,
  Procesada: 32,
  Enviada: 48,
  "En tránsito": 68,
  "En reparto": 88,
  Entregada: 100
};

const getLatestEvent = (trackingData) => {
  if (!Array.isArray(trackingData) || trackingData.length === 0) return null;
  return trackingData[0]; // asumiendo más reciente primero; si no, ordenar por fecha
};

const StatusSummary = ({ trackingData }) => {
  if (!trackingData) return null;

  const isBluex =
    trackingData?.provider === "bluexpress" && trackingData?.frontend;

  if (isBluex) {
    const f = trackingData.frontend;
    const step = (f.stepTitle || "Enviada").replace(
      "En transito",
      "En tránsito"
    );
    const color = estadoColorMap[step] || "default";
    const parsed = parseDate(trackingData?.events?.[0]?.date || f.updatedAt);
    const lastUpdate = humanizeDiff(parsed);
    const eta = estimateEta(step);

    return (
      <Card className="tracking-summary-card">
        <div className="tracking-summary-card__main">
          <div>
            <Text className="tracking-eyebrow">Estado operacional</Text>
            <Title level={3} className="tracking-summary-card__title">
              {step}
            </Title>
            <div className="tracking-summary-card__meta">
              <Tag color={color} className="tracking-status-pill">
                {step}
              </Tag>
              <Text className="tracking-muted">
                Última actualización: {lastUpdate}
              </Text>
            </div>
          </div>
          <div className="tracking-summary-card__eta">
            <Text className="tracking-eyebrow">Compromiso estimado</Text>
            <div className="tracking-summary-card__eta-value">{eta}</div>
          </div>
        </div>
        <Progress
          percent={progressByStep[step] || 24}
          showInfo={false}
          strokeColor="#016066"
          trailColor="rgba(31, 35, 40, 0.1)"
        />
      </Card>
    );
  }

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
    <Card className="tracking-summary-card">
      <div className="tracking-summary-card__main">
        <div>
          <Text className="tracking-eyebrow">Estado operacional</Text>
          <Title level={3} className="tracking-summary-card__title">
            {step}
          </Title>
          <div className="tracking-summary-card__meta">
            <Tag color={color} className="tracking-status-pill">
              {step}
            </Tag>
            <Text className="tracking-muted">{lastUpdateLabel}</Text>
          </div>
        </div>
        <div className="tracking-summary-card__eta">
          <Text className="tracking-eyebrow">Compromiso estimado</Text>
          <div className="tracking-summary-card__eta-value">{eta}</div>
        </div>
      </div>
      <Progress
        percent={progressByStep[step] || 24}
        showInfo={false}
        strokeColor="#016066"
        trailColor="rgba(31, 35, 40, 0.1)"
      />
    </Card>
  );
};

export default StatusSummary;
