import { Button, Card, Space, Tag, Typography } from "antd";
import {
  MailOutlined,
  MessageOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";

const { Text, Title } = Typography;

const carrierLabels = {
  chilexpress: "Chilexpress",
  bluexpress: "Bluexpress",
  pullman: "Pullman Cargo"
};

const SupportHelp = ({ carrierName }) => {
  const carrierKey = String(carrierName || "").toLowerCase();
  const carrier =
    Object.entries(carrierLabels).find(([key]) => carrierKey.includes(key))?.[1] ||
    "Courier asignado";

  return (
    <Card className="tracking-support-card">
      <div>
        <Text className="tracking-eyebrow">Soporte de despacho</Text>
        <Title level={4} className="tracking-panel__title">
          ¿Necesitas mover esta incidencia?
        </Title>
        <Text className="tracking-muted">
          Si tu seguimiento no cambia o necesitas la boleta, comparte tu número
          de orden y ODT para acelerar la atención.
        </Text>
      </div>
      <Space size={[8, 8]} wrap>
        <Tag className="tracking-chip tracking-chip--dark">{carrier}</Tag>
        <Tag className="tracking-chip">Respuesta estimada: 1 hora</Tag>
      </Space>
      <div className="tracking-support-card__actions">
        <Button
          type="primary"
          href="https://wa.me/56950444597"
          target="_blank"
          icon={<MessageOutlined />}
          className="tracking-primary-button"
        >
          WhatsApp
        </Button>
        <Button
          href="mailto:ventas@herramientastotal.cl"
          icon={<MailOutlined />}
          className="tracking-secondary-button"
        >
          Correo
        </Button>
        <Button
          href="tel:+56950444597"
          icon={<PhoneOutlined />}
          className="tracking-secondary-button"
        >
          Llamar
        </Button>
      </div>
    </Card>
  );
};

SupportHelp.propTypes = {
  carrierName: PropTypes.string
};

export default SupportHelp;
