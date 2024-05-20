import { Row, Col, Card, Skeleton } from "antd";

const SkeletonDestinyInfo = () => {
  return (
    <Row justify="center" align="middle" gutter={[48, 48]}>
      <Col xs={24} flex="auto" style={{ margin: "0.5rem" }}>
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

export default SkeletonDestinyInfo;
