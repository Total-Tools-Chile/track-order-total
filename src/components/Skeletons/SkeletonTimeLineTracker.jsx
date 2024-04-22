import { Collapse, theme, Typography, Skeleton } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

const { Text } = Typography;

const TimeLineTracker = () => {
  const { token } = theme.useToken();
  const panelStyle = {
    borderRadius: token.borderRadiusLG,
    border: "1px solid #f0f0f0",
    overflow: "hidden",
    padding: "1rem",
    background: token.colorBgContainer
  };

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
    >
      <Collapse.Panel
        header={
          <>
            <Text strong>Seguimiento del Envío</Text>
            <Text
              type="secondary"
              style={{ display: "block", marginTop: "0.5rem" }}
            >
              A veces, el seguimiento paso a paso puede no estar disponible. Si
              tienes problemas, haz click aquí para ver todo el proceso de tu
              compra.
            </Text>
          </>
        }
        key="1"
        style={panelStyle}
      >
        <Skeleton
          active
          paragraph={{
            rows: 3
          }}
        />{" "}
      </Collapse.Panel>
    </Collapse>
  );
};

export default TimeLineTracker;
