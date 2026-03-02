import {
  AdditiveBlending,
  ArcCurve,
  BufferAttribute,
  BufferGeometry,
  Color,
  Line,
  LineBasicMaterial,
  Points,
  PointsMaterial,
  Quaternion,
  Vector3,
  Group,
} from "three";

import { lon2xyz } from "./common";

/* ================= BRAND COLORS ================= */

const PRIMARY_PURPLE = 0x9333ea; // morado corporativo
const TECH_BLUE = 0xc084fc;      // azul neon tech
const CYAN_GLOW = 0xa855f7;      // cyan eléctrico

/* ================= CREATE FLY LINE ================= */

function createFlyLine(
  radius: number,
  startAngle: number,
  endAngle: number,
  color?: number
): Points {
  const geometry = new BufferGeometry();

  const arc = new ArcCurve(0, 0, radius, startAngle, endAngle, false);
  const pointsArr = arc.getSpacedPoints(100);

  geometry.setFromPoints(pointsArr);

  const percentArr: number[] = [];

  for (let i = 0; i < pointsArr.length; i++) {
    percentArr.push(i / pointsArr.length);
  }

  geometry.setAttribute(
    "percent",
    new BufferAttribute(new Float32Array(percentArr), 1)
  );

  /* ===== COLOR GRADIENT TECH ===== */

  const colorArr: number[] = [];

  for (let i = 0; i < pointsArr.length; i++) {
    const c1 = new Color(PRIMARY_PURPLE);
    const c2 = new Color(TECH_BLUE);
    const c = c1.clone().lerp(c2, i / pointsArr.length);
    colorArr.push(c.r, c.g, c.b);
  }

  geometry.setAttribute(
    "color",
    new BufferAttribute(new Float32Array(colorArr), 3)
  );

  const material = new PointsMaterial({
    size: 1,
    transparent: true,
    opacity: 0.3,               // segmento más brillante
    depthWrite: false,
    blending: AdditiveBlending, // 🔥 efecto glow real
    vertexColors: true,
  });

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "void main() {",
      `
      attribute float percent;
      void main() {
      `
    );

    shader.vertexShader = shader.vertexShader.replace(
      "gl_PointSize = size;",
      `
      gl_PointSize = percent * size;
      `
    );
  };

  const flyLine = new Points(geometry, material);

  if (color) {
    material.color = new Color(color);
  }

  flyLine.name = "FlyLine";

  return flyLine;
}

/* ================= FLY ARC ================= */

export function flyArc(
  radius: number,
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number,
  options: { color?: number; flyLineColor?: number }
): Group {
  const startSphereCoord = lon2xyz(radius, lon1, lat1);
  const endSphereCoord = lon2xyz(radius, lon2, lat2);

  const startEndQua = _3Dto2D(startSphereCoord, endSphereCoord);

  const arcline = arcXOY(
    radius,
    startEndQua.startPoint,
    startEndQua.endPoint,
    options
  );

  arcline.quaternion.multiply(startEndQua.quaternion);

  return arcline;
}

/* ================= 3D TO 2D ================= */

function _3Dto2D(startSphere: Vector3, endSphere: Vector3) {
  const origin = new Vector3(0, 0, 0);

  const startDir = startSphere.clone().sub(origin);
  const endDir = endSphere.clone().sub(origin);

  const normal = startDir.clone().cross(endDir).normalize();
  const xoyNormal = new Vector3(0, 0, 1);

  const quaternion3D_XOY = new Quaternion().setFromUnitVectors(
    normal,
    xoyNormal
  );

  const startSphereXOY = startSphere.clone().applyQuaternion(quaternion3D_XOY);
  const endSphereXOY = endSphere.clone().applyQuaternion(quaternion3D_XOY);

  const middleV3 = startSphereXOY.clone()
    .add(endSphereXOY)
    .multiplyScalar(0.5);

  const midDir = middleV3.clone().sub(origin).normalize();
  const yDir = new Vector3(0, 1, 0);

  const quaternionXOY_Y = new Quaternion().setFromUnitVectors(
    midDir,
    yDir
  );

  const startSpherXOY_Y = startSphereXOY.clone().applyQuaternion(
    quaternionXOY_Y
  );
  const endSphereXOY_Y = endSphereXOY.clone().applyQuaternion(
    quaternionXOY_Y
  );

  const quaternionInverse = quaternion3D_XOY
    .clone()
    .invert()
    .multiply(quaternionXOY_Y.clone().invert());

  return {
    quaternion: quaternionInverse,
    startPoint: startSpherXOY_Y,
    endPoint: endSphereXOY_Y,
  };
}

/* ================= ARC XOY ================= */

function arcXOY(
  radius: number,
  startPoint: Vector3,
  endPoint: Vector3,
  options: { color?: number; flyLineColor?: number }
): Group {
  const group = new Group();

  const middleV3 = new Vector3()
    .addVectors(startPoint, endPoint)
    .multiplyScalar(0.5);

  const dir = middleV3.clone().normalize();

  const earthRadianAngle = radianAOB(
    startPoint,
    endPoint,
    new Vector3(0, 0, 0)
  );

  const arcTopCoord = dir.multiplyScalar(
    radius + earthRadianAngle * radius * 0.08
  );

  const flyArcCenter = threePointCenter(
    startPoint,
    endPoint,
    arcTopCoord
  );

  const flyArcR = Math.abs(flyArcCenter.y - arcTopCoord.y);

  const flyRadianAngle = radianAOB(
    startPoint,
    new Vector3(0, -1, 0),
    flyArcCenter
  );

  const startAngle = -Math.PI / 2 + flyRadianAngle;
  const endAngle = Math.PI - startAngle;

  /* ===== LINE ===== */

  const line = circleLine(
    flyArcCenter.x,
    flyArcCenter.y,
    flyArcR,
    startAngle,
    endAngle,
    options.color ?? CYAN_GLOW
  );

  group.add(line);

  /* ===== FLY EFFECT ===== */

  const flyAngle = (endAngle - startAngle) / 7;

  const flyLine = createFlyLine(
    flyArcR,
    startAngle,
    startAngle + flyAngle,
    options.flyLineColor ?? TECH_BLUE
  );

  flyLine.position.y = flyArcCenter.y;

  group.add(flyLine);

  (flyLine as any).flyEndAngle = endAngle - startAngle - flyAngle;
  (flyLine as any).startAngle = startAngle;

  group.userData["flyLine"] = flyLine;

  return group;
}

/* ================= MATH ================= */

function radianAOB(A: Vector3, B: Vector3, O: Vector3): number {
  const dir1 = A.clone().sub(O).normalize();
  const dir2 = B.clone().sub(O).normalize();
  const cosAngle = dir1.dot(dir2);
  return Math.acos(cosAngle);
}

function circleLine(
  x: number,
  y: number,
  r: number,
  startAngle: number,
  endAngle: number,
  color: number
): Line {
  const geometry = new BufferGeometry();

  const arc = new ArcCurve(x, y, r, startAngle, endAngle, false);
  const points = arc.getSpacedPoints(80);

  geometry.setFromPoints(points);

  const material = new LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.1,            // 🔥 controla intensidad aquí
    blending: AdditiveBlending,
    depthWrite: false,
  });

  return new Line(geometry, material);
}

function threePointCenter(
  p1: Vector3,
  p2: Vector3,
  p3: Vector3
): Vector3 {
  const L1 = p1.lengthSq();
  const L2 = p2.lengthSq();
  const L3 = p3.lengthSq();

  const x1 = p1.x, y1 = p1.y;
  const x2 = p2.x, y2 = p2.y;
  const x3 = p3.x, y3 = p3.y;

  const S =
    x1 * y2 +
    x2 * y3 +
    x3 * y1 -
    x1 * y3 -
    x2 * y1 -
    x3 * y2;

  const x =
    (L2 * y3 +
      L1 * y2 +
      L3 * y1 -
      L2 * y1 -
      L3 * y2 -
      L1 * y3) /
    S /
    2;

  const y =
    (L3 * x2 +
      L2 * x1 +
      L1 * x3 -
      L1 * x2 -
      L2 * x3 -
      L3 * x1) /
    S /
    2;

  return new Vector3(x, y, 0);
}