import { Collapse, Typography, theme } from "antd";

const { Panel } = Collapse;
const { Text } = Typography;

const FAQ = () => {
  const { token } = theme.useToken();
  const containerStyle = {
    margin: "0 10px",
    marginTop: "1.5rem",
    padding: "1rem",
    border: "1px solid #f0f0f0",
    borderRadius: token.borderRadiusLG,
    background: token.colorBgContainer
  };

  const faqs = [
    {
      q: "¿Cuánto demora el despacho?",
      a: "Los tiempos dependen del courier y la región. Una vez procesada la orden, verás el estado actualizado en esta página. Si pasan más de 48 horas sin cambios, contáctanos."
    },
    {
      q: "¿Qué es el ODT y dónde lo encuentro?",
      a: "El ODT es el número de seguimiento del envío. Lo verás en la parte superior de esta página y en el correo de confirmación."
    },
    {
      q: "El seguimiento no se actualiza, ¿qué hago?",
      a: "A veces los eventos demoran en reflejarse. Prueba recargar o vuelve más tarde. Si continúa igual, escríbenos por WhatsApp desde el botón flotante."
    },
    {
      q: "¿Qué diferencia hay entre 'En tránsito' y 'En reparto'?",
      a: "“En tránsito” indica que el paquete viaja entre centros; “En reparto” significa que está en la última etapa, rumbo a la dirección de entrega."
    },
    {
      q: "¿Cómo obtengo mi boleta o factura?",
      a: "Si fue cargada por el sistema, verás el enlace en la sección de destino. Si no aparece, solicita el documento a soporte con tu número de orden."
    }
  ];

  return (
    <div style={containerStyle}>
      <Text strong style={{ display: "block", marginBottom: "0.5rem" }}>
        Preguntas frecuentes
      </Text>
      <Collapse accordion>
        {faqs.map((item, idx) => (
          <Panel header={item.q} key={idx}>
            <Text type="secondary">{item.a}</Text>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default FAQ;
