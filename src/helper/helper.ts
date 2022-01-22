import { shape } from './pixelization';

export const random = (min: number, max: number) => {
  if (max === min) return min;
  var r = Math.random() * (max - min + 1) + min;
  return Math.floor(r);
};

export const download = (key: string) => {
  var link = document.createElement('a');
  link.download = 'pixelization.png';
  // @ts-ignore
  link.href = document.getElementById(key)?.toDataURL('image/png');
  link.click();
};

export const randomOptions = () => {
  const shapeArr = Object.values(shape);

  const randomArraySize = random(1, 3);

  return Array(randomArraySize)
    .fill(0)
    .map(() => {
      const randomShape = random(0, shapeArr.length - 1);
      const randomResolution = random(0, 50);
      const randomSize = random(0, 50);
      const randomOffset = random(0, 25);
      const randomAlpha = random(5, 10);
      return {
        shape: shapeArr[randomShape],
        ...(randomResolution && { resolution: randomResolution }),
        ...(randomSize && { size: randomSize }),
        offset: randomOffset,
        alpha: randomAlpha / 10,
      };
    });
};
