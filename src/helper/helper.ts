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
