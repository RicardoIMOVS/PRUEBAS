import { LoadingManager, Texture, TextureLoader } from "three";
import { resources } from "./Assets";

export class Resources {
  private manager!: LoadingManager;
  private callback: () => void;
  private textureLoader!: TextureLoader;
  public textures: Record<string, Texture>;

  constructor(callback: () => void) {
    this.callback = callback;
    this.textures = {};

    this.setLoadingManager();
    this.loadResources();
  }

  private setLoadingManager() {
    this.manager = new LoadingManager();

    this.manager.onLoad = () => {
      this.callback();
    };
  }

  private loadResources(): void {
    this.textureLoader = new TextureLoader(this.manager);

    resources.textures?.forEach((item) => {
      this.textureLoader.load(item.url, (t) => {
        this.textures[item.name] = t;
      });
    });
  }
}