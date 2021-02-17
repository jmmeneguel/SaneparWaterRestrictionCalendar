import axios from "axios";

export interface suggestionType {
  text: string;
  magicKey: string;
  isCollection: boolean;
}

interface locationType {
  x: number;
  y: number;
  spatialReference: { wkid: number };
}

export interface waterRestrictionType {
  attributes: {
    OBJECTID: number;
    RETOMADA: number;
    NORMALIZACAO: number;
    LOCALIDADE: null;
    PERIODO: string;
    OBSERVACAO: string;
    INICIO: number;
    CODOPE: string;
  };
}

export const getSuggestions = async (searchString: string) => {
  const base_url =
    "https://utility.arcgis.com/usrsvcs/servers/b89ba3a68c664268b9bdea76948b4f11/rest/services/World/GeocodeServer/suggest";

  const params = {
    f: "json",
    text: searchString,
    maxSuggestions: 60,
    countryCode: "BRA",
  };

  let res = await axios.get(base_url, { params });
  let data = res.data.suggestions;
  data = data.filter((sug: suggestionType) => sug.text.includes("Paraná"));

  return data;
};

const findAdressCandidates = async (singleLine: string) => {
  const base_url =
    "https://utility.arcgis.com/usrsvcs/servers/b89ba3a68c664268b9bdea76948b4f11/rest/services/World/GeocodeServer/findAddressCandidates";

  const params = {
    f: "json",
    outSR: JSON.stringify({
      wkid: 102100,
    }),
    outFields: "*",
    countryCod: "BRA",
    maxLocations: 6,
    SingleLine: singleLine,
  };

  let res = await axios.get(base_url, { params });

  return res.data;
};

const getCodope = async (location: locationType) => {
  const base_url =
    "https://services1.arcgis.com/46Oage49MS2a3O6A/arcgis/rest/services/Mapa_Rodizio_Abastecimento_RMC_View/FeatureServer/1/query";

  const params = {
    f: "json",
    returnGeometry: false,
    geometryType: "esriGeometryPoint",
    outFields: "*",
    geometry: JSON.stringify(location),
  };

  let res = await axios.get(base_url, { params });

  let codope = res.data.features[0].attributes.codope;

  return codope;
};

const getByCodope = async (codope: string) => {
  const base_url =
    "https://services1.arcgis.com/46Oage49MS2a3O6A/arcgis/rest/services/Mapa_Rodizio_Abastecimento_RMC_View/FeatureServer/2/query";

  const params = {
    f: "json",
    returnGeometry: false,
    outFields: "*",
    where: `(CODOPE = '${codope}')`,
  };

  let res = await axios.get(base_url, { params });
  return res.data;
};

const printTimeStamps = (data: { features: waterRestrictionType[]; }) => {
  data.features.forEach((entry: waterRestrictionType) => {
    let ts_retomada = new Date(entry.attributes.RETOMADA);
    let ts_init = new Date(entry.attributes.INICIO);
    let ts_norm = new Date(entry.attributes.NORMALIZACAO);

    console.log(
      `INICIO: ${ts_init} \\ RETOMADA: ${ts_retomada} \\ NORMALIZACAO: ${ts_norm}`
    );
  });
};

export const getWaterRestrictionData = async (singleLineAddress: string) => {
  let flag = true
  let candidates
  // TODO: Replace by for loop
  while (flag) {
    try {
      candidates = await findAdressCandidates(singleLineAddress);
      flag = false
    } catch {
      console.error('erro na requisição dos candidatos')
    }
  }

  console.log('candidates', candidates)

  let location = candidates.candidates[0].location;
  location.spatialReference = {
    wkid: 102100,
  };

  let codope = await getCodope(location);

  let data = await getByCodope(codope);

  let filteredData = data.features.filter((entry: waterRestrictionType) => {
    const today = new Date()
    return today < new Date(entry.attributes.NORMALIZACAO)
  })

  return filteredData
};

const main = async () => {
  let suggestions = await getSuggestions("José Clementino Bettega");
  let candidates = await findAdressCandidates(suggestions[0].text);

  let location = candidates.candidates[0].location;
  location.spatialReference = {
    wkid: 102100,
  };

  let codope = await getCodope(location);
  console.log(`CODOPE: ${codope}`);

  let data = await getByCodope(codope);

  printTimeStamps(data);
};
