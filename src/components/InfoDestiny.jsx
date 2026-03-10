import { Row, Col, Card, Button, Modal, Typography } from "antd";
import { useState } from "react";
import {
  EnvironmentOutlined,
  HomeOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import SkeletonDestinyInfo from "./Skeletons/SkeletonDestinyInfo";

// no Link usage

const { Text, Title } = Typography;

const InfoDestiny = ({ client }) => {
  const [open, setOpen] = useState(false);
  if (!client) return <SkeletonDestinyInfo />;

  const boletaUrl = client?.order?.note_attributes?.find(
    (attr) => attr.name === "URL"
  )?.value;

  return (
    <Card className="tracking-panel">
      <div className="tracking-panel__header">
        <div>
          <Text className="tracking-eyebrow">Destino</Text>
          <Title level={4} className="tracking-panel__title">
            Entrega y documento tributario
          </Title>
        </div>
      </div>
      <Row justify="center" align="middle">
        <Col xs={24} flex="auto">
          <Row justify="center" align="middle" gutter={[16, 16]}>
          <Col span={24} md={8}>
            <Card className="tracking-info-card" bordered={false}>
              <span className="tracking-info-card__icon">
                <EnvironmentOutlined />
              </span>
              <div>
                <Text className="tracking-eyebrow">Región</Text>
                <div className="tracking-info-card__value">
                  {client?.order?.shipping_address?.province || "No informada"}
                </div>
              </div>
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card className="tracking-info-card" bordered={false}>
              <span className="tracking-info-card__icon">
                <HomeOutlined />
              </span>
              <div>
                <Text className="tracking-eyebrow">Comuna</Text>
                <div className="tracking-info-card__value">
                  {client?.order?.shipping_address?.city || "No informada"}
                </div>
              </div>
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card className="tracking-info-card tracking-info-card--stack" bordered={false}>
              <span className="tracking-info-card__icon">
                <FileTextOutlined />
              </span>
              <div>
                <Text className="tracking-eyebrow">Documento</Text>
                <div className="tracking-info-card__value">
                  Boleta o factura
                </div>
              </div>
              <div className="tracking-info-card__action">
                {boletaUrl ? (
                  <Button
                    type="primary"
                    href={boletaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tracking-primary-button"
                  >
                    Ver documento
                  </Button>
                ) : (
                  <Button onClick={() => setOpen(true)} className="tracking-secondary-button">
                    Documento no disponible
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        </Row>
        </Col>
      </Row>
      <Modal
        title="Documento no disponible"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        okText="Entendido"
        cancelText="Cerrar"
      >
        <p>
          Aún no se ha generado la boleta/factura para esta orden. Por favor
          contáctate con nuestro equipo de soporte indicando tu número de orden.
        </p>
        <p>
          Escribe a{" "}
          <a href="mailto:ventas@herramientastotal.cl">
            ventas@herramientastotal.cl
          </a>{" "}
          o usa el botón de WhatsApp en la esquina para atención rápida.
        </p>
      </Modal>
    </Card>
  );
};

InfoDestiny.propTypes = {
  client: PropTypes.shape({
    order: PropTypes.shape({
      shipping_address: PropTypes.shape({
        province: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired
      }),
      note_attributes: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired
        })
      ).isRequired
    }).isRequired,
    qtyProducts: PropTypes.number.isRequired
  }).isRequired
};

export default InfoDestiny;
