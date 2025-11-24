import { Button, Modal, List, Typography } from "antd";
import { useState } from "react";

const { Text } = Typography;

const SupportHelp = ({ carrierName = "" }) => {
  const [open, setOpen] = useState(false);

  const pasos = [
    "Verifica la dirección y comuna de destino.",
    "Revisa si hay intentos de entrega o disponibilidad en oficina.",
    "Si no hay movimiento en 48h, contáctanos por WhatsApp.",
    "Ten a mano tu ODT y número de orden."
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          margin: "0 10px"
        }}
      >
        <Button
          type="primary"
          onClick={() => setOpen(true)}
          style={{ background: "#036066" }}
        >
          ¿No llegó?
        </Button>
      </div>
      <Modal
        title="¿No llegó tu pedido?"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        okText="Entendido"
        cancelText="Cerrar"
      >
        <Text style={{ display: "block", marginBottom: 8 }}>
          Sigue estos pasos y contáctanos si aún necesitas ayuda.
        </Text>
        <List
          size="small"
          dataSource={pasos}
          renderItem={(item) => (
            <List.Item style={{ paddingLeft: 0 }}>{item}</List.Item>
          )}
        />
        <div style={{ marginTop: 12 }}>
          <a href="#whatsapp">Escríbenos por WhatsApp</a> o envía un correo a{" "}
          <a href="mailto:ventas@herramientastotal.cl">
            ventas@herramientastotal.cl
          </a>
          .
        </div>
      </Modal>
    </>
  );
};

export default SupportHelp;
