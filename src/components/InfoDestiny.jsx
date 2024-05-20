import { Row, Col, Card, Typography } from "antd";
import {
  EnvironmentOutlined,
  HomeOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import SkeletonDestinyInfo from "./Skeletons/SkeletonDestinyInfo";

const { Link } = Typography;

const InfoDestiny = ({ client }) => {
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
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                <h6 style={{ margin: "0" }} className="card-number">
                  Region destino: {client?.order?.shipping_address?.province}
                </h6>
              </span>
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card className="customer-info-card">
              <span style={{ display: "flex", alignItems: "center" }}>
                <HomeOutlined style={{ marginRight: 8 }} />
                <h6 style={{ margin: "0" }} className="card-number">
                  Comuna destino: {client?.order.shipping_address?.city}
                </h6>
              </span>
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card className="customer-info-card">
              <span style={{ display: "flex", alignItems: "center" }}>
                <FileTextOutlined style={{ marginRight: 8 }} />
                <h6 style={{ margin: "0" }} className="card-number">
                  Boleta/Factura: {client?.qtyProducts}
                  {boletaUrl && (
                    <Link
                      href={boletaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: "10px" }}
                    >
                      Ver Boleta
                    </Link>
                  )}
                </h6>
              </span>
            </Card>
          </Col>
        </Row>
      </Col>
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
