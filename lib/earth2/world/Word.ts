import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { IWord } from "../interfaces/IWord";
import { Basic } from "./Basic";
import Sizes from "../Utils/Sizes";
import { Resources } from "./Resources";
import Earth from "./Earth";
import Data from "./Data";

export default class World {
  public scene: Scene;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer;
  public controls: OrbitControls;
  public sizes: Sizes;
  public resources: Resources;
  public earth!: Earth;

  private rafId: number | null = null;
  private destroyed = false;
  private basic: Basic;
  private dom: HTMLElement;

  constructor(option: IWord) {
    this.dom = option.dom;

    this.basic = new Basic(this.dom);
    this.scene = this.basic.scene;
    this.camera = this.basic.camera;
    this.renderer = this.basic.renderer;
    this.controls = this.basic.controls;

    this.sizes = new Sizes({ dom: this.dom });

    this.sizes.$on("resize", () => {
      this.renderer.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      );
      this.camera.aspect =
        this.sizes.viewport.width / this.sizes.viewport.height;
      this.camera.updateProjectionMatrix();
    });

    this.resources = new Resources(async () => {
      await this.createEarth();
      this.render();
    });
  }

  async createEarth() {
    this.earth = new Earth({
      data: Data,
      dom: this.dom,
      textures: this.resources.textures,

      earth: {
        radius: 50,
        rotateSpeed: 0.00025,
        isRotation: true,
      },

      satellite: {
        show: true,
        rotateSpeed: -0.01,
        size: 1,
        number: 2,
      },

      // 🎨 PALETA TECH PROFESIONAL
      punctuation: {
        circleColor: 0x9333ea, // 🟣 morado corporativo
        lightColumn: {
          startColor: 0x9333ea, // morado origen
          endColor: 0xa855f7,   // azul neon destino
        },
      },

      flyLine: {
        color: 0xcfd1d5,        // cyan eléctrico
        flyLineColor: 0xa855f7, // azul neon animación
        speed: 0.01,
      },
    });

    this.scene.add(this.earth.group);
    await this.earth.init();
  }

  render() {
    if (this.destroyed) return;

    this.rafId = requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    this.earth.render();
  }

  destroy() {
    this.destroyed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);

    this.sizes.destroy();
    this.basic.destroy();
  }
}