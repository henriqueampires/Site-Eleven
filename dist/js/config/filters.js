export const subtypeOptions = {
  casa: [
    ["all", "Todas as casas"],
    ["terrea", "Casa térrea"],
    ["sobrado", "Sobrado"]
  ],
  apartamento: [
    ["all", "Todos os apartamentos"],
    ["apartamento", "Apartamento"],
    ["cobertura", "Cobertura"],
    ["studio", "Studio"],
    ["loft", "Loft"],
    ["duplex", "Duplex"]
  ],
  terreno: [
    ["all", "Todos os terrenos"],
    ["residencial", "Terreno residencial"],
    ["comercial", "Terreno comercial"]
  ],
  comercial: [
    ["all", "Todos os comerciais"],
    ["laje-corporativa", "Laje corporativa"],
    ["galpao", "Galpão"],
    ["area-comercial", "Área comercial"]
  ]
};

export const dealRanges = {
  buy: { min: 0, max: 20000000, step: 250000 },
  rent: { min: 0, max: 100000, step: 1000 }
};

export const specialLabels = {
  virtualTour: "Tour virtual",
  floorPlan: "Planta disponível",
  exchange: "Aceita permuta",
  accessibility: "Acessibilidade"
};

export const checkboxGroups = {
  condo: {
    title: "Atributos do condomínio",
    items: [
      ["condo.pool", "Piscina"],
      ["condo.gym", "Academia"],
      ["condo.gourmet", "Espaço gourmet / salão de festas"],
      ["condo.petPlace", "Pet place"],
      ["condo.kidsPlace", "Kids place"],
      ["condo.tennisCourt", "Quadra de tênis"],
      ["condo.sportsCourt", "Quadra poliesportiva"],
      ["condo.generator", "Gerador"],
      ["condo.evCharger", "Carregador veicular"],
      ["condo.security", "Portaria / guarita de segurança"]
    ]
  },
  house: {
    title: "Atributos da casa",
    items: [
      ["house.poolSpa", "Piscina / ofurô"],
      ["house.balcony", "Varanda / terraço"],
      ["house.garden", "Jardim / área externa"],
      ["house.gourmet", "Espaço gourmet"],
      ["house.solar", "Energia solar"]
    ]
  }
};

export const commercialFields = [
  { kind: "number", path: "commercial.parking", label: "Mínimo de vagas", min: 0, step: 1, suffix: "vagas" },
  { kind: "select", path: "commercial.powerStandard", label: "Padrão de entrada de energia", options: [["", "Qualquer padrão"], ["trifasico", "Trifásico"], ["alta-tensao", "Alta tensão"]] },
  { kind: "number", path: "commercial.facadeArea", label: "Área mínima de fachada", min: 0, step: 1, suffix: "m²" },
  { kind: "boolean", path: "commercial.sustainability", label: "Sustentabilidade" },
  { kind: "boolean", path: "commercial.elevator", label: "Elevador" }
];

export const warehouseFields = [
  { kind: "number", path: "warehouse.carSpaces", label: "Vagas para automóveis", min: 0, step: 1 },
  { kind: "number", path: "warehouse.truckSpaces", label: "Vagas para caminhões", min: 0, step: 1 },
  { kind: "number", path: "warehouse.storageArea", label: "Área mínima de estocagem", min: 0, step: 50, suffix: "m²" },
  { kind: "number", path: "warehouse.storageVolume", label: "Volume mínimo de estocagem", min: 0, step: 100, suffix: "m³" },
  { kind: "select", path: "warehouse.powerStandard", label: "Padrão de entrada de energia", options: [["", "Qualquer padrão"], ["trifasico", "Trifásico"], ["alta-tensao", "Alta tensão"]] },
  { kind: "boolean", path: "warehouse.elevatedDocks", label: "Docas elevadas" },
  { kind: "boolean", path: "warehouse.dockLeveler", label: "Nivelador de docas" },
  { kind: "boolean", path: "warehouse.sustainability", label: "Sustentabilidade" },
  { kind: "boolean", path: "warehouse.adminArea", label: "Área administrativa" },
  { kind: "number", path: "warehouse.ceilingHeight", label: "Pé-direito mínimo", min: 0, step: 0.5, suffix: "m" },
  { kind: "number", path: "warehouse.floorLoad", label: "Carga mínima do piso", min: 0, step: 0.5, suffix: "t/m²" }
];
