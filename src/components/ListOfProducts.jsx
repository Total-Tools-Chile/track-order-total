import { useEffect, useState } from "react";
import { Collapse, List, Typography, Button, theme } from "antd";
import { CaretRightOutlined, ReloadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { formatCLP } from "../utils/formatCLP";
import SkeletonListOfProducts from "../components/Skeletons/SkeletonListOfProducts";

const { Text } = Typography;

const ProductsList = ({ lineItems }) => {
  const { token } = theme.useToken();
  const panelStyle = {
    borderRadius: token.borderRadiusLG,
    border: "1px solid #f0f0f0",
    overflow: "hidden",
    padding: "1rem"
  };

  const [totals, setTotals] = useState({
    totalBeforeTax: 0,
    totalDiscount: 0,
    totalTax: 0,
    totalAfterTax: 0
  });

  useEffect(() => {
    if (lineItems && lineItems.length > 0) {
      const newTotals = lineItems.reduce(
        (acc, item) => {
          const itemPrice = Number(item.price) * item.quantity;
          const itemDiscount = Number(item.total_discount);
          acc.totalBeforeTax += itemPrice;
          acc.totalDiscount += itemDiscount;
          const taxRate =
            item.tax_lines && item.tax_lines.length > 0
              ? Number(item.tax_lines[0].price) / itemPrice
              : 0;
          const itemTotal = itemPrice - itemDiscount;
          acc.totalTax += itemTotal * taxRate;
          return acc;
        },
        { totalBeforeTax: 0, totalDiscount: 0, totalTax: 0 }
      );

      newTotals.totalAfterTax =
        newTotals.totalBeforeTax - newTotals.totalDiscount + newTotals.totalTax;
      setTotals(newTotals);
    }
  }, [lineItems]); // Recalculate when lineItems change

  const repeatPurchaseUrl = () => {
    const baseUrl = "http://totaltools-b2c.myshopify.com/cart";
    const cartItems = lineItems
      ?.map((item) => `${item.variant_id}:${item.quantity}`)
      .join(",");
    return `${baseUrl}/${cartItems}`;
  };

  if (!lineItems) return <SkeletonListOfProducts />;

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
            <Button
              icon={<ReloadOutlined />}
              type="primary"
              href={repeatPurchaseUrl()}
              style={{ backgroundColor: "#036066" }}
              target="_blank"
            >
              Repetir Compra
            </Button>
          </div>
        }
        key="1"
        style={panelStyle}
      >
        <Text
          type="secondary"
          style={{ fontSize: "12px", display: "block", marginBottom: "1rem" }}
        >
          Total antes de IVA: {formatCLP(totals.totalBeforeTax.toFixed(2))}{" "}
          Descuento total: {formatCLP(totals.totalDiscount.toFixed(2))} IVA
          total: {formatCLP(totals.totalTax.toFixed(2))} Total con IVA:{" "}
          {formatCLP(totals.totalAfterTax.toFixed(2))}
        </Text>
        <List
          itemLayout="horizontal"
          dataSource={lineItems}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                title={item.name}
                description={`Cantidad: ${
                  item.quantity
                }, Precio Unitario: ${formatCLP(
                  item.price
                )}, Descuento: ${formatCLP(item.total_discount)}`}
              />
            </List.Item>
          )}
        />
      </Collapse.Panel>
    </Collapse>
  );
};

ProductsList.propTypes = {
  lineItems: PropTypes.array.isRequired
};
export default ProductsList;
