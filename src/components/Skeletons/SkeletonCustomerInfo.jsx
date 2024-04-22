import { Row, Col, Card, Image, Skeleton } from "antd";
import Link from "antd/es/typography/Link";

const SkeletonCustomerInfo = () => {
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
              <Skeleton.Input active  />
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card className="payment-method-card">
              <Skeleton.Input active  />
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card className="payment-method-card">
              <Skeleton.Input active  />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default SkeletonCustomerInfo;
