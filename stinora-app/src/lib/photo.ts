/**
 * Read an image file and downscale it before it is stored.
 *
 * A phone camera shot is several megabytes; localStorage gives the whole origin
 * about five. Storing the original would fill the quota with one profile picture
 * and every subsequent booking would silently fail to save.
 */
export function readImageResized(file: File, maxSize = 384, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Choose an image file.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('That file could not be read.'));
    reader.onload = (evt) => {
      const img = new Image();
      img.onerror = () => reject(new Error('That image could not be decoded.'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('That image could not be processed.'));
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch {
          reject(new Error('That image could not be processed.'));
        }
      };
      img.src = String(evt.target?.result || '');
    };
    reader.readAsDataURL(file);
  });
}
