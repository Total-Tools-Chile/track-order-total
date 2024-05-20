import { Row, Col, Card, Image } from "antd";
import Link from "antd/es/typography/Link";
import {
  UserOutlined,
  ShoppingOutlined,
  TruckOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import SkeletonCustomerInfo from "../components/Skeletons/SkeletonCustomerInfo";

const CustomerInfo = ({ orderDetails }) => {
  if (!orderDetails) return <SkeletonCustomerInfo />;

  return (
    <Row justify="center" align="middle" gutter={[48, 48]}>
      <Col flex="100px">
        <Link href="https://herramientastotal.cl">
          <Image
            preview={false}
            width={200}
            src="https://herramientastotal.cl/cdn/shop/files/logo-normal_500x148.png"
          />
        </Link>
      </Col>
      <Col xs={24} flex="auto" style={{ margin: "1rem" }}>
        <Row justify="center" align="middle" gutter={[24, 24]}>
          <Col span={24} md={8}>
            <Card className="payment-method-card">
              <span style={{ display: "flex", alignItems: "center" }}>
                <UserOutlined style={{ marginRight: 10, fontSize: "1.5rem" }} />
                <h6 style={{ margin: "0" }} className="card-number">
                  Nombre: {orderDetails?.firstName} {orderDetails?.lastName}
                </h6>
              </span>
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card className="payment-method-card">
              <span style={{ display: "flex", alignItems: "center" }}>
                <TruckOutlined
                  style={{ marginRight: 10, fontSize: "1.5rem" }}
                />
                <h6 style={{ margin: "0" }} className="card-number">
                  ODT: {orderDetails?.ODT}
                </h6>
              </span>
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card className="payment-method-card">
              <span style={{ display: "flex", alignItems: "center" }}>
                <ShoppingOutlined
                  style={{ marginRight: 10, fontSize: "1.5rem" }}
                />
                <h6 style={{ margin: "0" }} className="card-number">
                  Orden: #{orderDetails?.nameSP}
                </h6>
              </span>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
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
