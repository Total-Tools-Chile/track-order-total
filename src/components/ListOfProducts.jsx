import { useEffect, useState } from "react";
import { Card, Collapse, List, Typography, Button, Flex, Tag } from "antd";
import { CaretRightOutlined, ReloadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { formatCLP } from "../utils/formatCLP";
import SkeletonListOfProducts from "../components/Skeletons/SkeletonListOfProducts";

const { Text } = Typography;

const ProductsList = ({ lineItems }) => {
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
    <Card className="tracking-panel tracking-panel--compact">
      <div className="tracking-panel__header">
        <div>
          <Text className="tracking-eyebrow">Carga de la orden</Text>
          <div className="tracking-panel__title">Productos despachados</div>
        </div>
        <Button
          icon={<ReloadOutlined />}
          type="primary"
          href={repeatPurchaseUrl()}
          className="tracking-primary-button"
          target="_blank"
        >
          Repetir compra
        </Button>
      </div>
      <Collapse
        bordered={false}
        defaultActiveKey={["1"]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className="tracking-collapse"
        items={[
          {
            key: "1",
            label: <Text strong>Detalle de artículos</Text>,
            children: (
              <>
                <Flex gap="8px 8px" wrap className="tracking-product-tags">
                  <Tag className="tracking-chip">
                    Descuento total:{" "}
                    {formatCLP(totals.totalDiscount.toFixed(0))}
                  </Tag>
                  <Tag className="tracking-chip tracking-chip--dark">
                    Total: {formatCLP(totals.totalAfterTax.toFixed(0))}
                  </Tag>
                </Flex>
                <List
                  itemLayout="horizontal"
                  dataSource={lineItems}
                  className="tracking-product-list"
                  renderItem={(item, index) => (
                    <List.Item key={index} className="tracking-product-list__item">
                      <List.Item.Meta
                        title={item.name}
                        description={`Cantidad: ${
                          item.quantity
                        } • Unitario: ${formatCLP(item.price)} • Descuento: ${formatCLP(
                          item.total_discount
                        )}`}
                      />
                    </List.Item>
                  )}
                />
              </>
            )
          }
        ]}
      />
    </Card>
  );
};

ProductsList.propTypes = {
  lineItems: PropTypes.array.isRequired
};
export default ProductsList;
