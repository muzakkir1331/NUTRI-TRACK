// Utiliti Pemampatan & Saiz Semula Imej Sisi Pelayar (Client-side Image Resizer)
// Menukar sebarang fail imej kamera/muat naik kepada resolusi optimum (~800px)
// untuk mengelakkan ralat memori, masa tamat (timeout) atau sekatan muatan data (payload).

export function compressImage(fileOrDataUrl, maxDim = 800) {
  return new Promise((resolve) => {
    if (!fileOrDataUrl) return resolve(null);

    // Jika parameter adalah objek File
    if (fileOrDataUrl instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resizeDataUrl(e.target.result, maxDim, resolve);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(fileOrDataUrl);
    } else if (typeof fileOrDataUrl === 'string') {
      resizeDataUrl(fileOrDataUrl, maxDim, resolve);
    } else {
      resolve(null);
    }
  });
}

function resizeDataUrl(dataUrl, maxDim, callback) {
  if (!dataUrl || typeof dataUrl !== 'string') return callback(dataUrl);

  const img = new Image();
  img.onload = () => {
    let { width, height } = img;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Mampatkan kepada format JPEG 0.75 kualiti (biasanya ~40KB - 80KB)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
      callback(compressedDataUrl);
    } catch (err) {
      console.warn('Gagal memampatkan imej pada kanvas:', err);
      callback(dataUrl);
    }
  };

  img.onerror = () => callback(dataUrl);
  img.src = dataUrl;
}
