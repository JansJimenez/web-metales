# EXPEDIENTE DE PROYECTO WEB CORPORATIVO
## TECHOS METÁLICOS HUAYOBAMBA | TECHOS METALICOS Y ESTRUCTURAS VICTORIA S.R.L.
**RUC:** 20612894451 | **Ubicación:** San Marcos, Cajamarca

Documento Formal de Especificación Técnica, Arquitectura y Casos de Uso del Sistema de Información Web para la comercialización directa de coberturas y estructuras metálicas.

---

## 1. FICHA TÉCNICA INSTITUCIONAL

| Parámetro | Especificación Técnica / Registro Oficial |
| :--- | :--- |
| **Razón Social** | TECHOS METALICOS Y ESTRUCTURAS VICTORIA S.R.L. |
| **RUC** | 20612894451 |
| **Nombre Comercial** | TECHOS METÁLICOS HUAYOBAMBA |
| **Tipo Societario** | Sociedad Comercial de Responsabilidad Limitada (SOC.COM.RESPONS. LTDA) |
| **Condición y Estado SUNAT** | **ACTIVO / HABIDO** (Inscripción: 17/07/2024 \| Inicio: 01/08/2024) |
| **Domicilio Fiscal / Planta** | Av. Cajamarca Nro. S/N C.P. Huayobamba (A 3 cuadras del puente Huayobamba SM), Pedro Gálvez, San Marcos, Cajamarca |
| **Actividad Principal (CIIU)** | **2511** - Fabricación de productos metálicos para uso estructural |
| **Comprobantes Autorizados** | Factura Electrónica (desde 16/08/2024) y Boleta Electrónica (desde 07/04/2025) |
| **Canal Central de Atención** | Teléfono / WhatsApp: +51 921 819 166 |
| **Eslogan de Marca** | «Calidad y Duración» |

---

## 2. ESPECIFICACIÓN DE REQUERIMIENTOS FUNCIONALES (15 RF)

- **RF-01 (Navegación y Menú Sticky)**: Barra superior persistente con scroll suave hacia Inicio, Productos, Estructuras, Garantía, Galería, Cotización y Ubicación. En móviles colapsa en menú hamburguesa.
- **RF-02 (Botón Flotante WhatsApp)**: Componente flotante permanente fijado abajo a la izquierda/derecha (`wa.me/51921819166`) con mensaje de apertura precargado.
- **RF-03 (Marcación Telefónica Directa)**: Enlaces estructurados con protocolo estándar `tel:+51921819166` para apertura automática del marcador de voz en celulares.
- **RF-04 (Módulo Calaminón Aluzinc)**: Ficha técnica de coberturas industriales/residenciales, ventajas ante granizo y corte de longitud a medida con botón CTA directo.
- **RF-05 (Módulo Teja Metálica)**: Ficha de planchas tipo teja residencial, destacando ligereza estructural, cero filtraciones y botón CTA directo.
- **RF-06 (Ficha Estructural CIIU 2511)**: Módulo de diseño, fabricación y montaje en obra de tijerales, galpones y estructuras de acero.
- **RF-07 (Identidad Oficial SUNAT)**: Bloque de texto plano indexable con Razón Social, RUC 20612894451 y condición ACTIVO/HABIDO.
- **RF-08 (Acreditación de Comprobantes)**: Insignia informativa visible de emisión autorizada de Facturas y Boletas Electrónicas.
- **RF-09 (Formulario Web de Cotización)**: Campos: Nombre, Teléfono/WhatsApp (validación regex 9 dígitos), Ubicación de obra, Selector de producto y Detalle del pedido.
- **RF-10 (Reset y Confirmación)**: Envío asíncrono vía `fetch()`, despliegue de confirmación en pantalla y limpieza de inputs sin recarga de página.
- **RF-11 (Mapa Satelital Interactivo)**: Contenedor Iframe responsivo de Google Maps apuntando a la dirección fiscal en C.P. Huayobamba, Pedro Gálvez.
- **RF-12 (Trazabilidad de Ruta GPS)**: Botón "Cómo llegar" para disparar la aplicación Google Maps trazando navegación satelital hacia la planta.
- **RF-13 (Galería de Proyectos en Obra)**: Cuadrícula fotográfica que valida trabajos reales terminados y procesos de soldadura en taller.
- **RF-14 (Enrutamiento Contextual WA)**: Inyección dinámica del nombre del producto en el mensaje de WhatsApp según el botón donde interactúe el usuario.
- **RF-15 (Horarios de Atención de Planta)**: Despliegue de turnos de taller: Lunes a Sábado de 7:30 AM a 6:00 PM y canales de mensajería digital.

---

## 3. ESPECIFICACIÓN DE REQUERIMIENTOS NO FUNCIONALES (15 RNF)

- **RNF-01 (Rendimiento FCP)**: First Contentful Paint $\le 1.5\text{ s}$ en redes móviles 4G.
- **RNF-02 (Rendimiento LCP)**: Largest Contentful Paint $\le 2.5\text{ s}$ en el renderizado del Hero principal.
- **RNF-03 (Estabilidad Visual CLS)**: Cumulative Layout Shift $\le 0.05$ evitando saltos de contenido con atributos fijos de ancho/alto.
- **RNF-04 (Diseño Adaptativo)**: Enfoque Mobile-First adaptable fluidamente desde 360px hasta 2560px sin desbordes horizontales.
- **RNF-05 (Ergonomía Táctil)**: Área táctil mínima de $48\times48\text{ px}$ en botones e hipervínculos móviles.
- **RNF-06 (Seguridad en Tránsito)**: Cifrado HTTPS obligatorio bajo TLS 1.3 con redirección 301 desde cualquier petición HTTP no segura.
- **RNF-07 (Compresión Multimedia)**: Imágenes optimizadas con carga diferida (`loading="lazy"`).
- **RNF-08 (Disponibilidad)**: SLA de Uptime garantizado de 99.9% anual mediante red de distribución global (Edge CDN).
- **RNF-09 (SEO y OpenGraph)**: Metadatos completos en cabecera (`title`, `description`, `og:image`, `Schema.org/LocalBusiness`) para previsualización profesional.
- **RNF-10 (Compatibilidad Cruzada)**: Paridad visual y funcional en Google Chrome, Apple Safari, Mozilla Firefox y Microsoft Edge.
- **RNF-11 (Carga Diferida)**: Implementación de `loading="lazy"` en imágenes secundarias e Iframe del mapa satelital.
- **RNF-12 (Accesibilidad WCAG 2.1)**: Ratio de contraste texto/fondo superior a 4.5:1 y presencia obligatoria de etiquetas descriptivas `alt`.
- **RNF-13 (Cabeceras de Seguridad)**: Inclusión de directivas de protección `X-Content-Type-Options: nosniff` y `X-Frame-Options: SAMEORIGIN`.
- **RNF-14 (Ligereza de Paquete)**: Bundle web de transferencia inicial comprimido de **~90.1 kB gzipped** (ampliamente inferior al límite de $1.2\text{ MB}$).
- **RNF-15 (Semántica y Estándar)**: Código estructurado bajo semántica HTML5 modular y validado ante el W3C sin dependencias deprecadas.

---

## 4. ARQUITECTURA TÉCNICA & STACK TECNOLÓGICO

- **Frontend Core**: React 19 + HTML5 Semántico.
- **Estilos & Diseño**: Tailwind CSS v4 (Design system arquitectónico siderúrgico).
- **Bundler & Build Tool**: Vite 8.
- **IA Asistente**: Google Gemini API (`gemini-3-flash-preview` / `gemini-3.1-flash-lite-preview`) con rate-limiting, protección anti-spam y fallback resiliente.
- **Tipografía**: Google Fonts (*Plus Jakarta Sans*).
- **Despliegue Recomendado**: Cloudflare Pages / Vercel (Edge CDN con $0 costo de servidor y mitigación DDoS perimetral).
