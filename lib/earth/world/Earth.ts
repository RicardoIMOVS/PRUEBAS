import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  Object3D,
  Points,
  PointsMaterial,
  ShaderMaterial,
  SphereGeometry as SphereBufferGeometry,
  Sprite,
  SpriteMaterial,
  Texture,
  TextureLoader,
} from "three";

import gsap from "gsap";

import earthVertex from "../shaders/earth/vertex.vs";
import earthFragment from "../shaders/earth/fragment.fs";

import {
  createAnimateLine,
  createLightPillar,
  createPointMesh,
  createWaveMesh,
  getCirclePoints,
  lon2xyz,
} from "../Utils/common";

import { flyArc } from "../Utils/arc";

/* ================= TYPES ================= */

export type Punctuation = {
  circleColor: number;
  lightColumn: {
    startColor: number;
    endColor: number;
  };
};

type Options = {
  data: {
    startArray: {
      name: string;
      E: number;
      N: number;
    };
    endArray: {
      name: string;
      E: number;
      N: number;
    }[];
  }[];
  dom: HTMLElement;
  textures: Record<string, Texture>;
  earth: {
    radius: number;
    rotateSpeed: number;
    isRotation: boolean;
  };
  satellite: {
    show: boolean;
    rotateSpeed: number;
    size: number;
    number: number;
  };
  punctuation: Punctuation;
  flyLine: {
    color: number;
    speed: number;
    flyLineColor: number;
  };
};

type Uniforms = {
  glowColor: { value: Color };
  scale: { type: string; value: number };
  bias: { type: string; value: number };
  power: { type: string; value: number };
  time: { type: string; value: number };
  isHover: { value: boolean };
  map: { value: Texture | null };
};

/* ================= CLASS ================= */

export default class Earth {
  public group: Group;
  public earthGroup: Group;
  public around!: BufferGeometry;
  public aroundPoints!: Points<BufferGeometry, PointsMaterial>;

  public options: Options;
  public uniforms: Uniforms;
  public timeValue: number;

  public earth!: Mesh<SphereBufferGeometry, ShaderMaterial>;
  public punctuationMaterial!: MeshBasicMaterial;
  public markupPoint: Group;
  public waveMeshArr: Object3D[];
  public circleLineList: any[];
  public isRotation: boolean;
  public flyLineArcGroup!: Group;

  constructor(options: Options) {
    this.options = options;

    this.group = new Group();
    this.group.scale.set(0, 0, 0);

    this.earthGroup = new Group();
    this.group.add(this.earthGroup);

    this.markupPoint = new Group();
    this.waveMeshArr = [];
    this.circleLineList = [];
    this.isRotation = this.options.earth.isRotation;

    this.timeValue = 100;

    this.uniforms = {
      glowColor: { value: new Color(0x0cd1eb) },
      scale: { type: "f", value: -1.0 },
      bias: { type: "f", value: 1.0 },
      power: { type: "f", value: 3.3 },
      time: { type: "f", value: this.timeValue },
      isHover: { value: false },
      map: { value: null },
    };
  }

  async init(): Promise<void> {
    this.createEarth();
    this.createStars();
    this.createEarthGlow();
    this.createEarthAperture();
    await this.createMarkupPoint();
    this.createFlyLine();
    this.focusOnStartLocation();
    this.show();
  }

  /* ================= AUTO FOCUS ================= */

  private focusOnStartLocation() {
    // 🔥 CAMBIA ESTE VALOR POR EL PAÍS QUE QUIERAS
    const startLongitude = 24; // México

    const offset = Math.PI;

    this.earthGroup.rotation.y =
      offset - (startLongitude * Math.PI) / 180;
  }

  /* ================= EARTH ================= */

  createEarth() {
    const geometry = new SphereBufferGeometry(
      this.options.earth.radius,
      50,
      50
    );

    const border = new SphereBufferGeometry(
      this.options.earth.radius + 10,
      60,
      60
    );

    const pointMaterial = new PointsMaterial({
      color: 0x81ffff,
      transparent: true,
      opacity: 0.1,
      size: 0.01,
    });

    const points = new Points(border, pointMaterial);
    this.earthGroup.add(points);

    this.uniforms.map.value = this.options.textures.earth;

    const material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: earthVertex,
      fragmentShader: earthFragment,
    });

    this.earth = new Mesh(geometry, material);
    this.earthGroup.add(this.earth);
  }

  createStars() {
    const vertices: number[] = [];

    for (let i = 0; i < 500; i++) {
      vertices.push(
        800 * Math.random() - 300,
        800 * Math.random() - 300,
        800 * Math.random() - 300
      );
    }

    this.around = new BufferGeometry();
    this.around.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3)
    );

    const material = new PointsMaterial({
      size: 2,
      color: 0x4d76cf,
      transparent: true,
      map: this.options.textures.gradient,
    });

    this.aroundPoints = new Points(this.around, material);
    this.group.add(this.aroundPoints);
  }

  createEarthGlow() {
    const R = this.options.earth.radius;

    const material = new SpriteMaterial({
      map: this.options.textures.glow,
      color: 0x4390d1,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });

    const sprite = new Sprite(material);
    sprite.scale.set(R * 3, R * 3, 1);
    this.earthGroup.add(sprite);
  }

  createEarthAperture() {
    const material = new ShaderMaterial({
      uniforms: {
        glowColor: { value: new Color(0x4390d1) },
        coeficient: { value: 0.5 },
        power: { value: 4.0 },
      },
      vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
      fragmentShader: `
      uniform vec3 glowColor;
      uniform float coeficient;
      uniform float power;
      varying vec3 vNormal;

      void main() {
        float intensity = pow(coeficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
        gl_FragColor = vec4(glowColor, intensity);
      }
    `,
      blending: NormalBlending,
      transparent: true,
      depthWrite: false,
    });

    const sphere = new SphereBufferGeometry(
      this.options.earth.radius * 1.05,
      64,
      64
    );

    const mesh = new Mesh(sphere, material);
    this.earthGroup.add(mesh);
  }

  async createMarkupPoint() {
    for (const item of this.options.data) {
      const radius = this.options.earth.radius;
      const lon = item.startArray.E;
      const lat = item.startArray.N;

      this.punctuationMaterial = new MeshBasicMaterial({
        color: this.options.punctuation.circleColor,
        map: this.options.textures.label,
        transparent: true,
        depthWrite: false,
      });

      const mesh = createPointMesh({ radius, lon, lat, material: this.punctuationMaterial });
      this.markupPoint.add(mesh);

      const pillar = createLightPillar({
        radius,
        lon,
        lat,
        index: 0,
        textures: this.options.textures,
        punctuation: this.options.punctuation,
      });

      this.markupPoint.add(pillar);

      const wave = createWaveMesh({
        radius,
        lon,
        lat,
        textures: this.options.textures,
      });

      this.markupPoint.add(wave);
      this.waveMeshArr.push(wave);

      this.earthGroup.add(this.markupPoint);
    }
  }

  createFlyLine() {
    this.flyLineArcGroup = new Group();
    this.flyLineArcGroup.userData["flyLineArray"] = [];
    this.earthGroup.add(this.flyLineArcGroup);

    this.options.data.forEach((cities) => {
      cities.endArray.forEach((item) => {
        const arcline = flyArc(
          this.options.earth.radius,
          cities.startArray.E,
          cities.startArray.N,
          item.E,
          item.N,
          this.options.flyLine
        );

        this.flyLineArcGroup.add(arcline);
        this.flyLineArcGroup.userData["flyLineArray"].push(
          arcline.userData["flyLine"]
        );
      });
    });
  }

  show() {
    gsap.to(this.group.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2,
      ease: "power2.out",
    });
  }

  render() {
    if (this.flyLineArcGroup?.userData?.flyLineArray) {
      this.flyLineArcGroup.userData.flyLineArray.forEach((fly: any) => {
        fly.rotation.z += this.options.flyLine.speed;
        if (fly.rotation.z >= fly.flyEndAngle) fly.rotation.z = 0;
      });
    }

    if (this.isRotation) {
      this.earthGroup.rotation.y += this.options.earth.rotateSpeed;
    }

    this.circleLineList.forEach((e) => {
      e.rotateY(this.options.satellite.rotateSpeed);
    });

    this.uniforms.time.value =
      this.uniforms.time.value < -this.timeValue
        ? this.timeValue
        : this.uniforms.time.value - 1;
  }
}