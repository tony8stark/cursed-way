type MapDataModule = typeof import("../renderer/map-data");
type MapGeneratorModule = typeof import("../renderer/map-generator");

type MapRuntime = Pick<
  MapDataModule,
  "computeRoute" | "findNearestCell" | "getMapCells" | "getTerrainForScene" | "setActiveMap"
> & Pick<MapGeneratorModule, "generateMap">;

let mapRuntimePromise: Promise<MapRuntime> | null = null;

export function loadMapRuntime(): Promise<MapRuntime> {
  if (!mapRuntimePromise) {
    mapRuntimePromise = Promise.all([
      import("../renderer/map-data"),
      import("../renderer/map-generator"),
    ]).then(([mapData, mapGenerator]) => ({
      computeRoute: mapData.computeRoute,
      findNearestCell: mapData.findNearestCell,
      getMapCells: mapData.getMapCells,
      getTerrainForScene: mapData.getTerrainForScene,
      setActiveMap: mapData.setActiveMap,
      generateMap: mapGenerator.generateMap,
    }));
  }

  return mapRuntimePromise;
}
