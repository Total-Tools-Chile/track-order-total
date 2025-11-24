import { Row, Col, Card, Button, Modal } from "antd";
import { useState } from "react";
import {
  EnvironmentOutlined,
  HomeOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import SkeletonDestinyInfo from "./Skeletons/SkeletonDestinyInfo";

// no Link usage

const InfoDestiny = ({ client }) => {
  const [open, setOpen] = useState(false);
  console.log(client);
  if (!client) return <SkeletonDestinyInfo />;

  const boletaUrl = client?.order?.note_attributes?.find(
    (attr) => attr.name === "URL"
  )?.value;

  return (
    <Row justify="center" align="middle">
      <Col xs={24} flex="auto" style={{ margin: "0.5rem" }}>
        <Row justify="center" align="middle" gutter={[24, 24]}>
          <Col span={24} md={8}>
            <Card className="customer-info-card">
              <span style={{ display: "flex", alignItems: "center" }}>
                <EnvironmentOutlined
                  style={{ marginRight: 10, fontSize: "1.3rem" }}
                />
                <h6 style={{ margin: "0" }} className="card-number">
                  Region destino: {client?.order?.shipping_address?.province}
                </h6>
              </span>
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card className="customer-info-card">
              <span style={{ display: "flex", alignItems: "center" }}>
                <HomeOutlined style={{ marginRight: 10, fontSize: "1.3rem" }} />
                <h6 style={{ margin: "0" }} className="card-number">
                  Comuna destino: {client?.order?.shipping_address?.city}
                </h6>
              </span>
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card
              style={{ display: "flex", alignItems: "center" }}
              className="customer-info-card"
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <FileTextOutlined
                  style={{ marginRight: 10, fontSize: "1.3rem" }}
                />
                <h6 style={{ margin: "0" }} className="card-number">
                  Boleta/Factura
                </h6>
              </span>
              <div style={{ marginTop: "8px" }}>
                {boletaUrl ? (
                  <Button
                    type="primary"
                    href={boletaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: "#036066" }}
                  >
                    Ver documento
                  </Button>
                ) : (
                  <Button onClick={() => setOpen(true)}>
                    Documento no disponible
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Col>
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
    </Row>
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
