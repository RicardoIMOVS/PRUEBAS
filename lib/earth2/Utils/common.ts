import {
  AdditiveBlending,
  CatmullRomCurve3,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Texture,
  TubeGeometry,
  Vector3,
} from "three";

/* ================= TYPES ================= */

type WaveOptions = {
  radius: number;
  lon: number;
  lat: number;
  textures: Record<string, Texture>;
};

type LightPillarOptions = {
  radius: number;
  lon: number;
  lat: number;
  index: number;
  textures: Record<string, Texture>;
};

type PointMeshOptions = {
  radius: number;
  lon: number;
  lat: number;
  material: MeshBasicMaterial;
};

type CirclePointsOptions = {
  radius?: number;
  number?: number;
  closed?: boolean;
};

type AnimateLineOptions = {
  pointList: number[][];
  material: MeshBasicMaterial;
  number?: number;
  radius?: number;
  radialSegments?: number;
};

/* ================= BRAND COLORS ================= */

// 🟣 Morado corporativo
const PRIMARY_PURPLE = 0xE8E8E8;

// 🔵 Cyan eléctrico tech
const CYAN_GLOW = 0xcfd1d5;

// 🔷 Azul neon
const TECH_BLUE = 0xa855f7;

/* ================= UTILS ================= */

export const lon2xyz = (
  R: number,
  longitude: number,
  latitude: number
): Vector3 => {
  let lon = (longitude * Math.PI) / 180;
  const lat = (latitude * Math.PI) / 180;

  lon = -lon;

  const x = R * Math.cos(lat) * Math.cos(lon);
  const y = R * Math.sin(lat);
  const z = R * Math.cos(lat) * Math.sin(lon);

  return new Vector3(x, y, z);
};

/* ================= WAVE (CYAN TECH) ================= */

export const createWaveMesh = (options: WaveOptions): Mesh => {
  const geometry = new PlaneGeometry(1, 1);
  const texture = options.textures.aperture;

  const material = new MeshBasicMaterial({
    color: CYAN_GLOW, // 🔵 Tech cyan
    map: texture,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const mesh = new Mesh(geometry, material);

  const coord = lon2xyz(
    options.radius * 1.001,
    options.lon,
    options.lat
  );

  const size = options.radius * 0.12;

  mesh.scale.set(size, size, size);
  mesh.userData.size = size;
  mesh.userData.scale = Math.random();

  mesh.position.set(coord.x, coord.y, coord.z);

  const coordVec3 = coord.clone().normalize();
  const meshNormal = new Vector3(0, 0, 1);

  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);

  return mesh;
};

/* ================= LIGHT PILLAR (PURPLE TECH) ================= */

export const createLightPillar = (
  options: LightPillarOptions
): Group => {
  const height = options.radius * 0.15;

  const geometry = new PlaneGeometry(
    options.radius * 0.03,
    height
  );

  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, 0, height / 2);

  const material = new MeshBasicMaterial({
    map: options.textures.light_column,
    color: options.index === 0
      ? PRIMARY_PURPLE   // 🟣 origen
      : TECH_BLUE,       // 🔷 destino
    transparent: true,
    side: DoubleSide,
    depthWrite: false,
  });

  const mesh = new Mesh(geometry, material);

  const group = new Group();
  group.add(mesh, mesh.clone().rotateZ(Math.PI / 2));

  const sphereCoord = lon2xyz(
    options.radius,
    options.lon,
    options.lat
  );

  group.position.set(
    sphereCoord.x,
    sphereCoord.y,
    sphereCoord.z
  );

  const coordVec3 = sphereCoord.clone().normalize();
  const meshNormal = new Vector3(0, 0, 1);

  group.quaternion.setFromUnitVectors(meshNormal, coordVec3);

  return group;
};

/* ================= POINT BASE ================= */

export const createPointMesh = (
  options: PointMeshOptions
): Mesh => {
  const geometry = new PlaneGeometry(1, 1);
  const mesh = new Mesh(geometry, options.material);

  const coord = lon2xyz(
    options.radius * 1.001,
    options.lon,
    options.lat
  );

  const size = options.radius * 0.05;

  mesh.scale.set(size, size, size);
  mesh.position.set(coord.x, coord.y, coord.z);

  const coordVec3 = coord.clone().normalize();
  const meshNormal = new Vector3(0, 0, 1);

  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);

  return mesh;
};

/* ================= CIRCLE POINTS ================= */

export const getCirclePoints = (
  option: CirclePointsOptions
): number[][] => {
  const list: number[][] = [];

  const radius = option.radius ?? 10;
  const number = option.number ?? 100;

  for (
    let j = 0;
    j < 2 * Math.PI - 0.1;
    j += (2 * Math.PI) / number
  ) {
    list.push([
      parseFloat((Math.cos(j) * radius).toFixed(2)),
      0,
      parseFloat((Math.sin(j) * radius).toFixed(2)),
    ]);
  }

  if (option.closed) {
    list.push(list[0]);
  }

  return list;
};

/* ================= ANIMATE LINE ================= */

export const createAnimateLine = (
  option: AnimateLineOptions
): Mesh => {
  const points: Vector3[] = option.pointList.map(
    (e) => new Vector3(e[0], e[1], e[2])
  );

  const curve = new CatmullRomCurve3(points);

  const tubeGeometry = new TubeGeometry(
    curve,
    option.number ?? 50,
    option.radius ?? 1,
    option.radialSegments ?? 8
  );

  return new Mesh(tubeGeometry, option.material);
};