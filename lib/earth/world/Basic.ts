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

    this.camera.position.set(0, 30, -250);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);

    this.dom.appendChild(this.renderer.domElement);
  }

  setControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotateSpeed = 3;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 300;
    this.controls.enablePan = false;
  }

  destroy() {
    this.controls.dispose();
    this.renderer.dispose();
    this.dom.innerHTML = "";
  }
}