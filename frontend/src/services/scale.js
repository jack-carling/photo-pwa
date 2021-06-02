export const scale = (url, maxWidth = 2000, maxHeight = 2000, quality = 0.8) =>
  new Promise((res) => {
    let img = new Image();
    img.src = url;
    img.onload = () => {
      let { width: w, height: h } = img;
      let scale = Math.min(maxWidth / w, maxHeight / h);
      w = Math.floor(w * scale);
      h = Math.floor(h * scale);
      let canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      let ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      res(canvas.toDataURL('image/jpeg', quality));
    };
  });
