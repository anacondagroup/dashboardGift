export const mockOffsetHeightAndWidth = ({ width, height } = { width: 200, height: 200 }): void => {
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: height });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: width });
  });

  afterAll(() => {
    // @ts-ignore
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    // @ts-ignore
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
  });
};
