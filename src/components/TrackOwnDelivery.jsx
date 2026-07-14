import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Card,
  Col,
  Image,
  Layout,
  Progress,
  Result,
  Row,
  Space,
  Spin,
  Steps,
  Tag,
  Timeline,
  Typography
} from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  CheckCircleTwoTone,
  ClockCircleOutlined,
  CameraOutlined
} from "@ant-design/icons";
import moment from "moment";
import { FloatingWhatsApp } from "./WhatsAppButton/FloatingWhatsApp";

const { Content, Footer } = Layout;
const { Text, Title, Link } = Typography;

// Backend (mismo criterio que TrackOrder): usa VITE_API_BASE_URL si es http(s), si no fly.dev.
const API_BASE = (() => {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL || "").trim();
  if (/^https?:\/\//i.test(fromEnv)) return fromEnv.replace(/\/+$/, "");
  return "https://shopy-sale-v2.fly.dev";
})();

// Progreso visual por etapa (Envío Propio / courier interno).
const PROGRESS_BY_STAGE = {
  pending_assign: 20,
  assigned: 45,
  en_reparto: 75,
  entregado: 100,
  cancelled: 100
};

const STAGE_TAG_COLOR = {
  pending_assign: "orange",
  assigned: "blue",
  en_reparto: "green",
  entregado: "success",
  cancelled: "default"
};

const antStatus = (status) =>
  status === "done" ? "finish" : status === "current" ? "process" : "wait";

const fmt = (value) => (value ? moment(value).format("DD/MM/YYYY HH:mm") : "");

function TrackOwnDelivery() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(
      `${API_BASE}/shopsale/v1/public/own-deliveries/tracking/${encodeURIComponent(
        orderId
      )}`
    )
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (!json || json.found === false) {
          setData(null);
          setError(
            `No encontramos un envío con el seguimiento ${orderId}. Verifica el número.`
          );
        } else {
          setData(json);
        }
      })
      .catch(() => {
        if (!cancelled)
          setError("No pudimos obtener tu seguimiento. Intenta nuevamente en unos minutos.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const steps = Array.isArray(data?.steps) ? data.steps : [];
  const currentIdx = (() => {
    const idx = steps.findIndex((s) => s.status === "current");
    if (idx !== -1) return idx;
    // Entregado: ya no hay paso "current" (el último queda "done") → resaltar el último
    // paso alcanzado en vez de caer al índice 0 (que marcaba el primer paso por error).
    const lastDone = steps.map((s) => s.status).lastIndexOf("done");
    return lastDone !== -1 ? lastDone : 0;
  })();
  const stepItems = steps.map((s) => ({
    title: s.label,
    description: s.description,
    status: antStatus(s.status)
  }));

  const timelineItems = (Array.isArray(data?.timeline) ? data.timeline : [])
    .slice()
    .reverse()
    .map((ev) => ({
      color:
        ev.event === "entregado"
          ? "green"
          : ev.event === "cancelled"
            ? "gray"
            : ev.event === "failed_attempt"
              ? "orange"
              : "#016066",
      children: (
        <div>
          <div style={{ fontWeight: 600, color: "#1f2328" }}>{ev.label}</div>
          <Text className="tracking-muted" style={{ fontSize: 12 }}>
            {fmt(ev.at)}
          </Text>
        </div>
      )
    }));

  return (
    <Layout className="tracking-shell">
      <Content className="tracking-shell__content">
        {/* Hero */}
        <Card className="tracking-hero">
          <div className="tracking-hero__header">
            <div className="tracking-hero__brand">
              <Link href="https://herramientastotal.cl">
                <Image
                  preview={false}
                  width={190}
                  src="https://herramientastotal.cl/cdn/shop/files/logo-normal_500x148.png"
                />
              </Link>
              <div>
                <Tag className="tracking-section-tag">Seguimiento de tu pedido</Tag>
                <Title level={2} className="tracking-hero__title">
                  Envío a domicilio
                </Title>
                <Text className="tracking-muted">
                  Reparto propio de Herramientas Total. Acá ves el estado de tu entrega en
                  tiempo real.
                </Text>
              </div>
            </div>
            {data ? (
              <Space size={[8, 8]} wrap>
                {data.orderName ? (
                  <Tag className="tracking-chip">Pedido {data.orderName}</Tag>
                ) : null}
                <Tag className="tracking-chip tracking-chip--dark">
                  Seguimiento {data.trackingNumber}
                </Tag>
              </Space>
            ) : null}
          </div>
        </Card>

        {error ? (
          <Alert
            message="No pudimos recuperar tu envío"
            description={error}
            type="error"
            showIcon
            className="tracking-alert"
          />
        ) : null}

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <Spin size="large" />
          </div>
        ) : data ? (
          <>
            {data.isCancelled ? (
              <Alert
                message="Este envío fue cancelado"
                description="Si crees que es un error, escríbenos por WhatsApp y lo revisamos."
                type="warning"
                showIcon
                className="tracking-alert"
              />
            ) : null}

            {/* Estado actual (focal) */}
            <Card className="tracking-summary-card">
              <div className="tracking-summary-card__main">
                <div>
                  <Text className="tracking-eyebrow">Estado actual</Text>
                  <Title level={3} className="tracking-summary-card__title">
                    {data.statusLabel}
                  </Title>
                  <div className="tracking-summary-card__meta">
                    <Tag
                      color={STAGE_TAG_COLOR[data.stage] || "default"}
                      className="tracking-status-pill"
                    >
                      {data.statusLabel}
                    </Tag>
                    {data.driverFirstName && !data.isDelivered ? (
                      <Text className="tracking-muted">
                        Repartidor: {data.driverFirstName}
                      </Text>
                    ) : null}
                    {data.isDelivered && data.receivedBy ? (
                      <Text className="tracking-muted">
                        Recibido por: {data.receivedBy}
                      </Text>
                    ) : null}
                  </div>
                </div>
                <div className="tracking-summary-card__eta">
                  <Text className="tracking-eyebrow">
                    {data.isDelivered ? "Entregado" : "Compromiso"}
                  </Text>
                  <div className="tracking-summary-card__eta-value">
                    {data.isDelivered
                      ? fmt(data.deliveredAt) || "Entregado"
                      : data.stage === "en_reparto"
                        ? "Hoy antes de las 21:00"
                        : "En preparación"}
                  </div>
                </div>
              </div>
              <Progress
                percent={PROGRESS_BY_STAGE[data.stage] ?? 20}
                showInfo={false}
                status={data.isCancelled ? "exception" : "active"}
                strokeColor="#016066"
                trailColor="rgba(31, 35, 40, 0.1)"
              />
              {data.updatedAt ? (
                <Text
                  className="tracking-muted"
                  style={{ fontSize: 12, display: "block", marginTop: 8 }}
                >
                  Última actualización: {fmt(data.updatedAt)}
                </Text>
              ) : null}
            </Card>

            {/* Stepper */}
            {!data.isCancelled && stepItems.length ? (
              <Card className="tracking-panel">
                <div className="tracking-panel__header">
                  <Text className="tracking-eyebrow">Progreso del reparto</Text>
                </div>
                <Steps
                  current={currentIdx}
                  items={stepItems}
                  responsive
                  labelPlacement="vertical"
                  style={{ marginTop: 8 }}
                />
              </Card>
            ) : null}

            <Row gutter={[20, 20]} className="tracking-grid">
              <Col xs={24} xl={14}>
                <div className="tracking-stack">
                  {/* Historial */}
                  <Card className="tracking-panel">
                    <div className="tracking-panel__header">
                      <Text className="tracking-eyebrow">Historial</Text>
                      <Title level={4} className="tracking-panel__title">
                        Hitos de tu envío
                      </Title>
                    </div>
                    {timelineItems.length ? (
                      <Timeline items={timelineItems} style={{ marginTop: 8 }} />
                    ) : (
                      <Text className="tracking-muted">Aún no hay eventos registrados.</Text>
                    )}
                  </Card>

                  {/* Evidencia de entrega */}
                  {data.isDelivered && data.proofPhotoUrl ? (
                    <Card className="tracking-panel">
                      <div className="tracking-panel__header">
                        <Text className="tracking-eyebrow">
                          <CameraOutlined /> Evidencia de entrega
                        </Text>
                      </div>
                      <Image
                        src={data.proofPhotoUrl}
                        alt="Evidencia de entrega"
                        style={{ borderRadius: 12, maxHeight: 320, objectFit: "cover" }}
                      />
                    </Card>
                  ) : null}
                </div>
              </Col>

              <Col xs={24} xl={10}>
                <div className="tracking-stack">
                  {/* Destino */}
                  <Card className="tracking-panel">
                    <div className="tracking-panel__header">
                      <Text className="tracking-eyebrow">Destino</Text>
                    </div>
                    <Card className="tracking-info-card" bordered={false}>
                      <span className="tracking-info-card__icon">
                        <EnvironmentOutlined />
                      </span>
                      <div>
                        <Text className="tracking-eyebrow">Dirección</Text>
                        <div className="tracking-info-card__value">
                          {data?.destination?.address || "—"}
                        </div>
                      </div>
                    </Card>
                    {data?.destination?.name ? (
                      <Card
                        className="tracking-info-card"
                        bordered={false}
                        style={{ marginTop: 12 }}
                      >
                        <span className="tracking-info-card__icon">
                          <UserOutlined />
                        </span>
                        <div>
                          <Text className="tracking-eyebrow">Recibe</Text>
                          <div className="tracking-info-card__value">
                            {data.destination.name}
                          </div>
                        </div>
                      </Card>
                    ) : null}
                  </Card>

                  {/* Repartidor */}
                  {data.driverFirstName ? (
                    <Card className="tracking-panel">
                      <div className="tracking-panel__header">
                        <Text className="tracking-eyebrow">Repartidor</Text>
                      </div>
                      <Card className="tracking-info-card" bordered={false}>
                        <span className="tracking-info-card__icon">
                          {data.isDelivered ? (
                            <CheckCircleTwoTone twoToneColor="#1f8f55" />
                          ) : (
                            <ClockCircleOutlined />
                          )}
                        </span>
                        <div>
                          <Text className="tracking-eyebrow">Asignado a</Text>
                          <div className="tracking-info-card__value">
                            {data.driverFirstName}
                          </div>
                        </div>
                      </Card>
                    </Card>
                  ) : null}
                </div>
              </Col>
            </Row>
          </>
        ) : !error ? (
          <Result
            status="404"
            title="Sin resultados"
            subTitle="No encontramos un envío con ese número de seguimiento."
          />
        ) : null}
      </Content>
      <FloatingWhatsApp />
      <Footer className="tracking-footer">
        <div className="tracking-footer__inner">
          <div className="tracking-footer__copy">
            © {new Date().getFullYear()} Herramientas Total. Todos los derechos reservados.
          </div>
        </div>
      </Footer>
    </Layout>
  );
}

export default TrackOwnDelivery;
