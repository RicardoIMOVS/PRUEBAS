import { EventEmitter } from "pietile-eventemitter";
import { IEvents } from "../interfaces/IEvents";

type options = { dom: HTMLElement };

export default class Sizes {
  public viewport: { width: number; height: number };
  public emitter: EventEmitter<IEvents>;
  private dom: HTMLElement;
  private resizeHandler: () => void;

  constructor(options: options) {
    this.dom = options.dom;
    this.emitter = new EventEmitter<IEvents>();

    this.viewport = { width: 0, height: 0 };

    this.resizeHandler = this.resize.bind(this);
    window.addEventListener("resize", this.resizeHandler);

    this.resize();
  }

  $on<T extends keyof IEvents>(event: T, fun: () => void) {
    this.emitter.on(event, () => fun());
  }

  resize() {
    this.viewport.width = this.dom.clientWidth;
    this.viewport.height = this.dom.clientHeight;
    this.emitter.emit("resize");
  }

  destroy() {
    window.removeEventListener("resize", this.resizeHandler);
  }
}