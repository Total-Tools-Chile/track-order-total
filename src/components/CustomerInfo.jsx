import { Card, Col, Image, Row, Space, Tag, Typography } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  TruckOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import SkeletonCustomerInfo from "../components/Skeletons/SkeletonCustomerInfo";

const { Link, Text, Title } = Typography;

const CustomerInfo = ({ orderDetails }) => {
  if (!orderDetails) return <SkeletonCustomerInfo />;

  return (
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
            <Tag className="tracking-section-tag">Centro de seguimiento</Tag>
            <Title level={2} className="tracking-hero__title">
              Despacho en curso
            </Title>
            <Text className="tracking-muted">
              Revisa el avance operativo de tu pedido, los hitos del courier y
              la referencia exacta del despacho.
            </Text>
          </div>
        </div>
        <Space size={[8, 8]} wrap>
          <Tag className="tracking-chip">Pedido #{orderDetails?.nameSP}</Tag>
          <Tag className="tracking-chip tracking-chip--dark">
            ODT {orderDetails?.ODT}
          </Tag>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="tracking-hero__metrics">
        <Col xs={24} md={8}>
          <Card className="tracking-metric-card" bordered={false}>
            <span className="tracking-metric-card__icon">
              <UserOutlined />
            </span>
            <div>
              <Text className="tracking-eyebrow">Cliente</Text>
              <div className="tracking-metric-card__value">
                {orderDetails?.firstName} {orderDetails?.lastName}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="tracking-metric-card" bordered={false}>
            <span className="tracking-metric-card__icon">
              <TruckOutlined />
            </span>
            <div>
              <Text className="tracking-eyebrow">Código de transporte</Text>
              <div className="tracking-metric-card__value">
                {orderDetails?.ODT}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="tracking-metric-card" bordered={false}>
            <span className="tracking-metric-card__icon">
              <ShoppingOutlined />
            </span>
            <div>
              <Text className="tracking-eyebrow">Orden comercial</Text>
              <div className="tracking-metric-card__value">
                #{orderDetails?.nameSP}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

CustomerInfo.propTypes = {
  orderDetails: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    ODT: PropTypes.string.isRequired,
    nameSP: PropTypes.string.isRequired
  })
};

export default CustomerInfo;
