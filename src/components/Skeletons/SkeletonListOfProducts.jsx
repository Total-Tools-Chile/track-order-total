import { Collapse, List, Typography, theme, Skeleton } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ProductsList = () => {
  const { token } = theme.useToken();
  const panelStyle = {
    borderRadius: token.borderRadiusLG,
    border: "1px solid #f0f0f0",
    overflow: "hidden",
    padding: "1rem"
  };

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      style={{
        background: token.colorBgContainer,
        marginBottom: "1rem" // Ensure some space around the component
      }}
    >
      <Collapse.Panel
        header={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Text strong>Productos</Text>
            <Skeleton.Button
              active
              paragraph={{
                rows: 1
              }}
            />
          </div>
        }
        key="1"
        style={panelStyle}
      >
        <Text
          type="secondary"
          style={{ fontSize: "12px", display: "block", marginBottom: "1rem" }}
        >
          <Skeleton
            active
            paragraph={{
              rows: 1
            }}
          />
        </Text>
        <List
          itemLayout="horizontal"
          dataSource={[2]}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <Skeleton
                active
                paragraph={{
                  rows: 1
                }}
              />
            </List.Item>
          )}
        />
      </Collapse.Panel>
    </Collapse>
  );
};

export default ProductsList;
