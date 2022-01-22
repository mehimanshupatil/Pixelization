// util vars
const TWO_PI = Math.PI * 2;
const QUARTER_PI = Math.PI * 0.25;

// utility functions
function isArray(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function isObject(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

let console = window.console;

export enum shape {
  diamond = 'diamond',
  circle = 'circle',
  square = 'square',
}
export type Options = {
  resolution?: number;
  size?: number;
  alpha?: number;
  offset?: number | { x: number; y: number } | [number, number];
  shape?: shape;
};

const pixelFn = () => {
  // check for canvas support
  let canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let imgData: Uint8ClampedArray;
  let width = 0;
  let height = 0;

  function ClosePixelation(
    replaceEle: HTMLImageElement,
    img: HTMLImageElement,
    options: Options[]
  ) {
    // creat canvas

    // copy attributes from img to canvas
    canvas.className = replaceEle.className;
    canvas.id = replaceEle.id;

    // set size
    width = canvas.width = img.width;
    height = canvas.height = img.height;
    // draw image on canvas
    ctx?.drawImage(img, 0, 0);
    // get imageData
    try {
      // @ts-ignore
      imgData = ctx?.getImageData(0, 0, width, height).data;
    } catch (error) {
      if (console) {
        console.error(error);
      }
      return;
    }

    ctx?.clearRect(0, 0, width, height);

    for (let i = 0, len = options.length; i < len; i++) {
      renderClosePixels(options[i]);
    }

    // replace image with canvas
    replaceEle.replaceWith(canvas);
    // replaceEle.parentNode?.replaceChild(canvas, replaceEle);
  }

  const renderClosePixels = (opts: Options) => {
    let w = width;
    let h = height;

    // option defaults
    let res = opts.resolution || 16;
    let size = opts.size || res;
    let alpha = opts.alpha || 1;
    let offset = opts.offset || 0;
    let offsetX = 0;
    let offsetY = 0;
    let cols = w / res + 1;
    let rows = h / res + 1;
    let halfSize = size / 2;
    let diamondSize = size / Math.SQRT2;
    let halfDiamondSize = diamondSize / 2;

    if (isObject(offset)) {
      // @ts-ignore
      offsetX = offset.x || 0; // @ts-ignore
      offsetY = offset.y || 0;
    } else if (isArray(offset)) {
      // @ts-ignore
      offsetX = offset[0] || 0; // @ts-ignore
      offsetY = offset[1] || 0;
    } else {
      // @ts-ignore
      offsetX = offsetY = offset;
    }

    let row, col, x, y, pixelY, pixelX, pixelIndex, red, green, blue, pixelAlpha;

    for (row = 0; row < rows; row++) {
      y = (row - 0.5) * res + offsetY;
      // normalize y so shapes around edges get color
      pixelY = Math.max(Math.min(y, h - 1), 0);

      for (col = 0; col < cols; col++) {
        x = (col - 0.5) * res + offsetX;
        // normalize y so shapes around edges get color
        pixelX = Math.max(Math.min(x, w - 1), 0);
        pixelIndex = (pixelX + pixelY * w) * 4;
        red = imgData[pixelIndex + 0];
        green = imgData[pixelIndex + 1];
        blue = imgData[pixelIndex + 2];
        pixelAlpha = alpha * (imgData[pixelIndex + 3] / 255);
        if (!ctx) return;
        ctx.fillStyle = 'rgba(' + red + ',' + green + ',' + blue + ',' + pixelAlpha + ')';

        switch (opts.shape) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(x, y, halfSize, 0, TWO_PI, true);
            ctx.fill();
            ctx.closePath();
            break;
          case 'diamond':
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(QUARTER_PI);
            ctx.fillRect(-halfDiamondSize, -halfDiamondSize, diamondSize, diamondSize);
            ctx.restore();
            break;
          default:
            // square
            ctx.fillRect(x - halfSize, y - halfSize, size, size);
        } // switch
      } // col
    } // row
  };

  // enable img.closePixelate
  // HTMLImageElement.prototype.closePixelate = function (options) {
  //   return new ClosePixelation(this, options);
  // };

  // put in global namespace

  return ClosePixelation;
};

export default pixelFn;
