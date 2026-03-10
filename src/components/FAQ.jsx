import { Card, Collapse, Typography } from "antd";

const { Text, Title } = Typography;

const FAQ = () => {
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
    <Card className="tracking-panel tracking-panel--compact">
      <div className="tracking-panel__header">
        <div>
          <Text className="tracking-eyebrow">Ayuda rápida</Text>
          <Title level={4} className="tracking-panel__title">
            Preguntas frecuentes
          </Title>
        </div>
      </div>
      <Collapse
        accordion
        className="tracking-collapse"
        items={faqs.map((item, idx) => ({
          key: idx,
          label: item.q,
          children: <Text className="tracking-muted">{item.a}</Text>
        }))}
      />
    </Card>
  );
};

export default FAQ;
