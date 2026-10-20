import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverMock);
HTMLElement.prototype.scrollIntoView = vi.fn();
HTMLElement.prototype.hasPointerCapture = () => false;
HTMLElement.prototype.setPointerCapture = () => {};
HTMLElement.prototype.releasePointerCapture = () => {};

// JSDOM does not fetch image assets; default carousel fixtures model cached images.
// Loading/decoding tests explicitly override this property for pending requests.
Object.defineProperty(HTMLImageElement.prototype,'complete',{configurable:true,get:()=>true});
