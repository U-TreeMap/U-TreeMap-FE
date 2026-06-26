export const KOREA_ADMIN_LEVEL = {
  COUNTRY: "country",
  SIDO: "sido",
  SIGUNGU: "sigungu",
  EMD: "emd",
};

const LAYERS = {
  [KOREA_ADMIN_LEVEL.COUNTRY]: {
    source: "korea-country",
    fill: "korea-country-fill",
    line: "korea-country-line",
    label: "korea-country-label",
    url: "/data/geojson/korea/skorea-provinces-2018-simple-geo.json",
    options: {
      fillColor: "#2E7D32",
      fillOpacity: 0.18,
      lineColor: "#1B5E20",
      lineWidth: 1.2,
      lineOpacity: 0.8,
      textSize: 12,
      allowOverlap: false,
      textColor: "#1B5E20",
      textHaloColor: "rgba(255,255,255,0.85)",
      textHaloWidth: 1.5,
    },
  },
  [KOREA_ADMIN_LEVEL.SIDO]: {
    source: "korea-sido",
    fill: "korea-sido-fill",
    line: "korea-sido-line",
    label: "korea-sido-label",
    url: "/data/geojson/korea/skorea-provinces-2018-simple-geo.json",
    options: {
      fillColor: "#43A047",
      fillOpacity: 0.24,
      lineColor: "#1B5E20",
      lineWidth: 1.5,
      textSize: 13,
      allowOverlap: false,
      textColor: "#1B5E20",
      textHaloColor: "rgba(255,255,255,0.9)",
      textHaloWidth: 1.5,
    },
  },
  [KOREA_ADMIN_LEVEL.SIGUNGU]: {
    source: "korea-sigungu",
    fill: "korea-sigungu-fill",
    line: "korea-sigungu-line",
    label: "korea-sigungu-label",
    chunkIndexUrl: "/data/geojson/korea/korea_sigungu_simple_chunk_index.json",
    options: {
      fillColor: "#66BB6A",
      fillOpacity: 0.3,
      lineColor: "#2E7D32",
      lineWidth: 1.2,
      textSize: 12,
      allowOverlap: false,
      textColor: "#0B3D1A",
      textHaloColor: "rgba(255,255,255,0.92)",
      textHaloWidth: 1.3,
    },
  },
  [KOREA_ADMIN_LEVEL.EMD]: {
    source: "korea-emd",
    fill: "korea-emd-fill",
    line: "korea-emd-line",
    label: "korea-emd-label",
    chunkIndexUrl: "/data/geojson/korea/korea_emd_sigungu_chunk_index.json",
    options: {
      fillColor: "#A5D6A7",
      fillOpacity: 0.36,
      lineColor: "#2E7D32",
      lineWidth: 0.8,
      textSize: 11,
      allowOverlap: false,
      textColor: "#0B3D1A",
      textHaloColor: "rgba(255,255,255,0.92)",
      textHaloWidth: 1.2,
    },
  },
};

const EMPTY_FEATURE_COLLECTION = {
  type: "FeatureCollection",
  features: [],
};

const loadedLevels = new Set();
const loadingPromises = new Map();
const jsonCache = new Map();
const chunkIndexes = new Map();
const loadedChunks = {
  [KOREA_ADMIN_LEVEL.SIGUNGU]: new Map(),
  [KOREA_ADMIN_LEVEL.EMD]: new Map(),
};
let emdHoverBound = false;

const loadJson = async url => {
  if (jsonCache.has(url)) {
    return jsonCache.get(url);
  }

  const promise = fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`GeoJSON load failed: ${url}`);
    }

    return response.json();
  });

  jsonCache.set(url, promise);
  return promise;
};

const loadChunkIndex = async level => {
  if (chunkIndexes.has(level)) {
    return chunkIndexes.get(level);
  }

  const config = LAYERS[level];
  const promise = loadJson(config.chunkIndexUrl);
  chunkIndexes.set(level, promise);
  return promise;
};

const getViewportBBox = map => {
  const bounds = map.getBounds();
  const west = bounds.getWest();
  const east = bounds.getEast();
  const south = bounds.getSouth();
  const north = bounds.getNorth();
  const lngPadding = Math.max((east - west) * 0.35, 0.2);
  const latPadding = Math.max((north - south) * 0.35, 0.2);

  return [west - lngPadding, south - latPadding, east + lngPadding, north + latPadding];
};

const intersectsBBox = (a, b) => {
  return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
};

const expandBBox = (bbox, coordinate) => {
  const [lng, lat] = coordinate;

  bbox[0] = Math.min(bbox[0], lng);
  bbox[1] = Math.min(bbox[1], lat);
  bbox[2] = Math.max(bbox[2], lng);
  bbox[3] = Math.max(bbox[3], lat);
};

const visitCoordinates = (coordinates, callback) => {
  if (typeof coordinates[0] === "number") {
    callback(coordinates);
    return;
  }

  coordinates.forEach(item => visitCoordinates(item, callback));
};

const getFeatureBBox = feature => {
  if (feature.bbox) return feature.bbox;

  const bbox = [Infinity, Infinity, -Infinity, -Infinity];
  visitCoordinates(feature.geometry.coordinates, coordinate => expandBBox(bbox, coordinate));
  feature.bbox = bbox;
  return bbox;
};

const getChunkId = item => item.chunkId ?? item.sigunguCode ?? item.sidoCode;

const setSourceData = (map, sourceId, data) => {
  const source = map.getSource(sourceId);

  if (source) {
    source.setData(data);
  }
};

const ensureChunkedSourceData = async (map, level) => {
  const config = LAYERS[level];
  addPolygonLayers(map, config, EMPTY_FEATURE_COLLECTION);

  const viewportBBox = getViewportBBox(map);
  const index = await loadChunkIndex(level);
  const visibleChunks = index.filter(item => intersectsBBox(viewportBBox, item.bbox));

  await Promise.all(
    visibleChunks.map(async item => {
      const chunkId = getChunkId(item);
      if (loadedChunks[level].has(chunkId)) return;

      const chunkGeojson = await loadJson(item.file);
      loadedChunks[level].set(chunkId, enrichFeatures(chunkGeojson).features);
    })
  );

  const visibleFeatures = visibleChunks.flatMap(item => {
    const chunkId = getChunkId(item);
    const features = loadedChunks[level].get(chunkId) ?? [];
    return features.filter(feature => intersectsBBox(viewportBBox, getFeatureBBox(feature)));
  });
  setSourceData(map, config.source, {
    type: "FeatureCollection",
    features: visibleFeatures,
  });

  if (level === KOREA_ADMIN_LEVEL.EMD) {
    bindEmdHover(map);
  }
};

const stableCountFromCode = code => {
  const normalizedCode = String(code || "0");
  const hash = normalizedCode.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (hash * 137) % 10000;
};

const enrichFeatures = geojson => {
  geojson.features.forEach(feature => {
    const code = feature.properties.code;
    const treeCount = stableCountFromCode(code);

    feature.properties.treeCount = feature.properties.treeCount ?? treeCount;
    feature.properties.carbonStorage = feature.properties.carbonStorage ?? Math.round(treeCount * 0.42);
  });

  return geojson;
};

const setLayerVisibility = (map, layerId, visibility) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, "visibility", visibility);
  }
};

const addPolygonLayers = (map, { source, fill, line, label, options }, geojson) => {
  if (!map.getSource(source)) {
    map.addSource(source, {
      type: "geojson",
      data: geojson,
      promoteId: "code",
    });
  }

  if (!map.getLayer(fill)) {
    map.addLayer({
      id: fill,
      type: "fill",
      source,
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#004D40",
          options.fillColor,
        ],
        "fill-opacity": options.fillOpacity,
      },
    });
  }

  if (!map.getLayer(line)) {
    map.addLayer({
      id: line,
      type: "line",
      source,
      layout: {
        visibility: "none",
      },
      paint: {
        "line-color": options.lineColor,
        "line-width": options.lineWidth,
        "line-opacity": options.lineOpacity ?? 1,
      },
    });
  }

  if (!map.getLayer(label)) {
    map.addLayer({
      id: label,
      type: "symbol",
      source,
      layout: {
        visibility: "none",
        "text-field": ["get", "name"],
        "text-size": options.textSize,
        "text-anchor": "center",
        "text-allow-overlap": options.allowOverlap,
      },
      paint: {
        "text-color": options.textColor,
        "text-halo-color": options.textHaloColor,
        "text-halo-width": options.textHaloWidth,
      },
    });
  }
};

const bindEmdHover = map => {
  if (emdHoverBound || !map.getLayer(LAYERS[KOREA_ADMIN_LEVEL.EMD].fill)) return;

  let hoveredEmdId = null;

  map.on("mousemove", LAYERS[KOREA_ADMIN_LEVEL.EMD].fill, e => {
    if (!e.features.length) return;

    const feature = e.features[0];

    if (hoveredEmdId !== null) {
      map.setFeatureState({ source: LAYERS[KOREA_ADMIN_LEVEL.EMD].source, id: hoveredEmdId }, { hover: false });
    }

    hoveredEmdId = feature.id;
    map.setFeatureState({ source: LAYERS[KOREA_ADMIN_LEVEL.EMD].source, id: hoveredEmdId }, { hover: true });
  });

  map.on("mouseleave", LAYERS[KOREA_ADMIN_LEVEL.EMD].fill, () => {
    if (hoveredEmdId !== null) {
      map.setFeatureState({ source: LAYERS[KOREA_ADMIN_LEVEL.EMD].source, id: hoveredEmdId }, { hover: false });
    }

    hoveredEmdId = null;
    map.getCanvas().style.cursor = "";
  });

  map.on("mouseenter", LAYERS[KOREA_ADMIN_LEVEL.EMD].fill, () => {
    map.getCanvas().style.cursor = "pointer";
  });

  emdHoverBound = true;
};

export async function ensureKoreaAdministrativeLevel(map, level) {
  if (level === KOREA_ADMIN_LEVEL.SIGUNGU || level === KOREA_ADMIN_LEVEL.EMD) {
    await ensureChunkedSourceData(map, level);
    return;
  }

  if (loadedLevels.has(level)) return;
  if (loadingPromises.has(level)) return loadingPromises.get(level);

  const config = LAYERS[level];
  if (!config) return;

  const promise = loadJson(config.url)
    .then(geojson => {
      addPolygonLayers(map, config, enrichFeatures(geojson));

      if (level === KOREA_ADMIN_LEVEL.EMD) {
        bindEmdHover(map);
      }

      loadedLevels.add(level);
      console.log(`%c🧩 Korea ${level} polygons loaded`, "color:#2E7D32;font-weight:bold;");
    })
    .finally(() => {
      loadingPromises.delete(level);
    });

  loadingPromises.set(level, promise);
  return promise;
}

export async function loadKoreaAdministrativePolygons(map) {
  return ensureKoreaAdministrativeLevel(map, KOREA_ADMIN_LEVEL.COUNTRY);
}

export function showKoreaCountryPolygons(map) {
  setLayerVisibility(map, LAYERS[KOREA_ADMIN_LEVEL.COUNTRY].fill, "visible");
  setLayerVisibility(map, LAYERS[KOREA_ADMIN_LEVEL.COUNTRY].line, "visible");
}

export function showKoreaCountryLabels(map) {
  setLayerVisibility(map, LAYERS[KOREA_ADMIN_LEVEL.COUNTRY].label, "visible");
}

export function showKoreaSidoPolygons(map) {
  setLayerVisibility(map, LAYERS[KOREA_ADMIN_LEVEL.SIDO].fill, "visible");
  setLayerVisibility(map, LAYERS[KOREA_ADMIN_LEVEL.SIDO].line, "visible");
}

export function showKoreaSidoLabels(map) {
  setLayerVisibility(map, LAYERS[KOREA_ADMIN_LEVEL.SIDO].label, "visible");
}

export function showKoreaSigunguPolygons(map) {
  setLayerVisibility(map, LAYERS[KOREA_ADMIN_LEVEL.SIGUNGU].fill, "visible");
  setLayerVisibility(map, LAYERS[KOREA_ADMIN_LEVEL.SIGUNGU].line, "visible");
}

export function showKoreaSigunguLabels(map) {
  setLayerVisibility(map, LAYERS[KOREA_ADMIN_LEVEL.SIGUNGU].label, "visible");
}

export function showKoreaEmdPolygons(map) {
  setLayerVisibility(map, LAYERS[KOREA_ADMIN_LEVEL.EMD].fill, "visible");
  setLayerVisibility(map, LAYERS[KOREA_ADMIN_LEVEL.EMD].line, "visible");
}

export function showKoreaEmdLabels(map) {
  setLayerVisibility(map, LAYERS[KOREA_ADMIN_LEVEL.EMD].label, "visible");
}

export function hideAllKoreaAdministrativeLayers(map) {
  Object.values(LAYERS).forEach(({ fill, line, label }) => {
    setLayerVisibility(map, fill, "none");
    setLayerVisibility(map, line, "none");
    setLayerVisibility(map, label, "none");
  });
}
