export const empresaConfig = {
  nombre: "TECHOS METÁLICOS HUAYOBAMBA",
  nombreComercial: "TECHOS METÁLICOS HUAYOBAMBA",
  razonSocial: "TECHOS METALICOS Y ESTRUCTURAS VICTORIA S.R.L.",
  ruc: "20612894451",
  tipoSocietario: "Sociedad Comercial de Responsabilidad Limitada (SOC.COM.RESPONS. LTDA)",
  condicionSunat: "ACTIVO / HABIDO",
  inscripcionSunat: "17/07/2024",
  inicioActividades: "01/08/2024",
  domicilioFiscal: "Av. Cajamarca Nro. S/N C.P. Huayobamba (A 3 cuadras del puente Huayobamba SM), Pedro Gálvez, San Marcos, Cajamarca",
  direccion: "Av. Cajamarca Nro. S/N C.P. Huayobamba, San Marcos - Cajamarca",
  referencia: "A 3 cuadras del puente Huayobamba SM",
  actividadPrincipal: "2511 - Fabricación de productos metálicos para uso estructural",
  ciiu: "2511",
  comprobantes: "Factura Electrónica y Boleta Electrónica autorizadas ante SUNAT",
  facturaElectronica: "Factura Electrónica (desde 16/08/2024)",
  boletaElectronica: "Boleta Electrónica (desde 07/04/2025)",
  lema: "Calidad y Duración",
  telefono: "51921819166", // WhatsApp internacional
  telefonoDisplay: "+51 921 819 166",
  telefonoLlamada: "+51921819166",
  atencion: "Lunes a Sábado de 7:30 AM a 6:00 PM",
  cobertura: "Fabricación a medida y despachos a San Marcos, Cajamarca y provincias",
  logo: "/logo.jpg",
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Huayobamba,+San+Marcos,+Cajamarca",
  mapsEmbed: "https://maps.google.com/maps?q=Huayobamba%20San%20Marcos%20Cajamarca&t=&z=14&ie=UTF8&iwloc=&output=embed"
};

export const categoriasProductos = [
  'Todos',
  'Tejas y Calaminones',
  'Coberturas y Calaminas',
  'Perfiles y Estructuras',
  'Accesorios y Fijaciones'
];

export const serviciosEstructurales = [
  {
    id: "est-1",
    titulo: "Diseño y Fabricación de Tijerales Metálicos",
    norma: "CIIU 2511 / Acero Estructural ASTM A36 - A500",
    descripcion: "Cálculo y soldadura de cerchas y tijerales reticulares a dos aguas y arcos parabólicos para soporte de coberturas pesadas y vientos andinos.",
    imagen: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    aplicaciones: ["Techos residenciales a dos aguas", "Coliseos y losas multideportivas", "Tijerales para naves y depósitos"],
    ctaTexto: "Cotizar Tijerales en Taller"
  },
  {
    id: "est-2",
    titulo: "Estructuras para Galpones y Almacenes",
    norma: "CIIU 2511 / Soldadura Homologada AWS D1.1",
    descripcion: "Habilitación completa de columnas tubulares LAC, viguetas reticulares y correas en perfil C diseñadas a la medida de tu terreno.",
    imagen: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    aplicaciones: ["Almacenes agrícolas y pecuarios", "Plantas de procesamiento y talleres", "Cocheras de vehículos pesados"],
    ctaTexto: "Cotizar Galpón Estructural"
  },
  {
    id: "est-3",
    titulo: "Montaje e Instalación Integral de Coberturas",
    norma: "Seguridad en Obra / Cuadrilla Especializada",
    descripcion: "Servicio de izaje, arriostramiento, fijación con tornillería EPDM y sellado de cumbreras con entrega lista para lluvias.",
    imagen: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    aplicaciones: ["Obras particulares y contratistas", "Instituciones públicas y educativas", "Ampliaciones de vivienda"],
    ctaTexto: "Solicitar Visita Técnica"
  }
];

export const galeriaProyectos = [
  {
    id: "gal-1",
    titulo: "Vivienda Chalet con Teja Metálica Prepintada",
    ubicacion: "San Marcos, Cajamarca",
    descripcion: "Cobertura tipo teja colonial roja horneada sobre tijeral metálico liviano. Cero filtraciones ante granizadas.",
    imagen: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    etiqueta: "Residencial"
  },
  {
    id: "gal-2",
    titulo: "Galpón Industrial con Calaminón Aluzinc TR4",
    ubicacion: "Huayobamba, San Marcos",
    descripcion: "Planchas roladas directas en planta a 9.50m continuos, eliminando empalmes intermedios.",
    imagen: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    etiqueta: "Industrial TR4"
  },
  {
    id: "gal-3",
    titulo: "Habilitación de Tijerales y Soldadura Estructural",
    ubicacion: "Taller Huayobamba (CIIU 2511)",
    descripcion: "Ensamble de cerchas con tubos LAC estructurales y cordón de soldadura controlado.",
    imagen: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    etiqueta: "Taller Metalmecánico"
  },
  {
    id: "gal-4",
    titulo: "Cobertura Termoacústica UPVC Silenciosa",
    ubicacion: "Caserío cercano a Pedro Gálvez",
    descripcion: "Instalación en dormitorios y zonas de descanso, reduciendo en 70% el impacto sonoro de aguaceros.",
    imagen: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    etiqueta: "Termoacústica"
  },
  {
    id: "gal-5",
    titulo: "Remates, Cumbreras y Canales Pluviales",
    ubicacion: "Obra en San Marcos",
    descripcion: "Sellado hermético de caídas con cumbreras de aluzinc prepintado y tornillos con arandela de neopreno.",
    imagen: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80",
    etiqueta: "Acabados & Sellado"
  },
  {
    id: "gal-6",
    titulo: "Despacho y Carga Directa en Planta",
    ubicacion: "Huayobamba SM",
    descripcion: "Carga supervisada de calaminones al corte y paquetes de perfilería con guía y factura legal.",
    imagen: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    etiqueta: "Despacho"
  }
];

export const productosData = [
  {
    id: 1,
    nombre: "Teja Metálica Prepintada de Aluzinc",
    categoria: "Tejas y Calaminones",
    norma: "Acero Aluzinc AZ-150 / Pintura Poliéster Horneada",
    espesores: "0.35 mm / 0.40 mm / 0.45 mm",
    largos: "Módulos de 1.10 m, 2.20 m, 3.30 m y fabricación a medida",
    anchoUtil: "1.00 m útil (ancho total 1.08 m)",
    imagen: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    descripcion: "Elegante diseño tipo teja colonial andina fabricada en aluzinc prepintado (rojo terracota, chocolate, verde). Ultraligera, 100% impermeable, resistente a granizadas, heladas y no absorbe humedad.",
    usos: ["Techos residenciales y chalets", "Casas de campo y cabañas", "Edificaciones con estética andina y colonial"],
    precio_ref: "S/ 52.00",
    precio_num: 52.00,
    unidad: "plancha",
    destacado: true
  },
  {
    id: 2,
    nombre: "Calaminón Aluzinc Trapezoidal TR4",
    categoria: "Tejas y Calaminones",
    norma: "ASTM A792 / Recubrimiento AZ-150",
    espesores: "0.30 mm / 0.35 mm / 0.40 mm / 0.50 mm",
    largos: "Cortes directos de fábrica a la medida exacta (hasta 12 m)",
    anchoUtil: "1.00 m útil (ancho total 1.05 m)",
    imagen: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    descripcion: "Calaminón trapezoidal de 4 crestas rolado directo en planta con aleación de alta durabilidad (55% Al, 43.4% Zn). Rápido drenaje pluvial para lluvias intensas y rigidez estructural superior.",
    usos: ["Techos residenciales y cocheras", "Naves industriales y almacenes", "Coliseos y galpones avícolas/ganaderos"],
    precio_ref: "S/ 46.00",
    precio_num: 46.00,
    unidad: "plancha (x metro / comercial)",
    destacado: true
  },
  {
    id: 3,
    nombre: "Calamina Galvanizada Ondulada Pesada",
    categoria: "Coberturas y Calaminas",
    norma: "ASTM A653 / NTP 341.031",
    espesores: "0.22 mm / 0.25 mm / 0.30 mm",
    largos: "1.80 m / 2.40 m / 3.00 m / 3.60 m",
    anchoUtil: "0.75 m útil (ancho total 0.83 m)",
    imagen: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    descripcion: "Plancha tradicional de acero galvanizado con baño de zinc en caliente. Cobertura económica, flexible y de fácil colocación para todo tipo de cerramientos y techos rurales.",
    usos: ["Techados rurales y agrícolas", "Cercos de obra y cobertizos", "Viviendas y ampliaciones rápidas"],
    precio_ref: "S/ 24.50",
    precio_num: 24.50,
    unidad: "plancha",
    destacado: false
  },
  {
    id: 4,
    nombre: "Plancha Termoacústica UPVC Silenciosa",
    categoria: "Coberturas y Calaminas",
    norma: "ISO 9001 - Certificación Antifuego B1",
    espesores: "2.0 mm / 2.5 mm",
    largos: "1.80 m a 6.00 m",
    anchoUtil: "1.05 m útil",
    imagen: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    descripcion: "Plancha multicapa de PVC espumado que amortigua el ruido de lluvias torrenciales hasta en un 70% y funciona como aislante térmico contra el frío y calor. Cero corrosión.",
    usos: ["Dormitorios y áreas de descanso", "Criaderos de animales y granjas", "Zonas lluviosas de alta montaña"],
    precio_ref: "S/ 85.00",
    precio_num: 85.00,
    unidad: "plancha",
    destacado: true
  },
  {
    id: 5,
    nombre: "Perfil Costanera C (Correa para Techo)",
    categoria: "Perfiles y Estructuras",
    norma: "ASTM A36 / LAC estructural",
    espesores: "1.5 mm / 2.0 mm / 2.5 mm",
    largos: "Barras estándar de 6.00 m",
    anchoUtil: "Dimensiones: 80x40, 100x50, 120x50 mm",
    imagen: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80",
    descripcion: "Perfil de acero conformado en frío ideal para correas de soporte de Teja Metálica y Calaminón TR4. Máxima resistencia a la flexión con un peso eficiente.",
    usos: ["Correas portacalaminón y fijación de tejas", "Viguetas para techos metálicos", "Cerchas y tijerales"],
    precio_ref: "S/ 42.00",
    precio_num: 42.00,
    unidad: "barra de 6m",
    destacado: true
  },
  {
    id: 6,
    nombre: "Tubo Estructural LAC Cuadrado y Rectangular",
    categoria: "Perfiles y Estructuras",
    norma: "Norma ASTM A500 Grado B",
    espesores: "1.5 mm, 2.0 mm, 3.0 mm en barras de 6.00 m",
    largos: "Medidas: 1x1, 2x1, 2x2, 3x1.5, 4x2 pulg",
    anchoUtil: "Barras de 6.00 metros",
    imagen: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    descripcion: "Tubería de acero soldada de alta tenacidad estructural para fabricación de tijerales, arcos parabólicos, columnas de soporte y carpintería metálica pesada.",
    usos: ["Tijerales para techos a 2 aguas", "Columnas y soportes de coberturas", "Portones y estructuras de cerrajería"],
    precio_ref: "S/ 58.00",
    precio_num: 58.00,
    unidad: "tubo de 6m",
    destacado: false
  },
  {
    id: 7,
    nombre: "Cumbrera / Caballete para Teja Metálica y TR4",
    categoria: "Accesorios y Fijaciones",
    norma: "Aluzinc Prepintado 0.40 mm",
    espesores: "0.40 mm (Rojo, Verde, Chocolate, Natural)",
    largos: "Tramos de 2.00 m y 3.00 m",
    anchoUtil: "Desarrollo de 30 cm a 40 cm",
    imagen: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    descripcion: "Remate superior para la unión de caídas en techos a dos aguas. Hermeticidad garantizada para evitar filtraciones de agua en la cumbre del techo.",
    usos: ["Remate de cumbre en techos de teja metálica", "Caballete para calaminón TR4", "Esquineros y canaletas pluviales"],
    precio_ref: "S/ 32.00",
    precio_num: 32.00,
    unidad: "pieza de 2m",
    destacado: false
  },
  {
    id: 8,
    nombre: "Tornillos Autoperforantes con Arandela EPDM",
    categoria: "Accesorios y Fijaciones",
    norma: "Acero cementado galvanizado / Neopreno EPDM",
    espesores: "#10 x 3/4\", #12 x 1\", #12 x 2\", #12 x 2-1/2\"",
    largos: "Punta broca para metal y madera",
    anchoUtil: "Caja x 100 unidades / Millar",
    imagen: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    descripcion: "Tornillo autoperforante con arandela vulcanizada que sella perfectamente la perforación evitando goteras ante las lluvias más intensas.",
    usos: ["Fijación de Teja Metálica y Calaminón a correas", "Instalación de cumbreras", "Montajes de techos metálicos"],
    precio_ref: "S/ 28.00",
    precio_num: 28.00,
    unidad: "ciento (100 u.)",
    destacado: false
  },
  {
    id: 9,
    nombre: "Fierro Corrugado Grado 60 Sismorresistente",
    categoria: "Perfiles y Estructuras",
    norma: "NTP 341.031 / ASTM A615",
    espesores: "Diámetros: 6mm, 8mm, 3/8\", 1/2\", 5/8\", 3/4\"",
    largos: "Barras rectas de 9.00 m",
    anchoUtil: "Varilla de 9 metros",
    imagen: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80",
    descripcion: "Barras de construcción sismorresistente con corrugas de alta adherencia para zapatas, columnas y bases de techos estructurales.",
    usos: ["Cimientos y zapatas para columnas", "Vigas de amarre para soporte de techos", "Estructuras de concreto armado"],
    precio_ref: "S/ 33.50",
    precio_num: 33.50,
    unidad: "varilla de 9m",
    destacado: false
  }
];
