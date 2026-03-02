import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class Basic {
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public renderer!: THREE.WebGLRenderer;
  public controls!: OrbitControls;
  public dom: HTMLElement;

  constructor(dom: HTMLElement) {
    this.dom = dom;
    this.initScenes();
    this.setControls();
  }

  initScenes() {
    this.scene = new THREE.Scene();

    const width = this.dom.clientWidth;
    const height = this.dom.clientHeight;

    this.camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      1,
      100000
    );

    this.camera.position.set(0, 30, -140);


    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setClearColor(0x050816);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);

    this.dom.appendChild(this.renderer.domElement);
  }

  setControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotateSpeed = 3;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.enableRotate = true;
  }

  destroy() {
    this.controls.dispose();
    this.renderer.dispose();
    this.dom.innerHTML = "";
  }
}