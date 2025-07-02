export const ImageCompressor = async (file: File, quality: number = 0.7): Promise<File> => {
  return new Promise<File>((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      img.src = reader.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Cannot get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);

      const mimeType = file.type.includes("png") ? "image/png" : "image/jpeg";

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: mimeType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error("Compression failed"));
          }
        },
        mimeType,
        mimeType === "image/png" ? 1 : quality
      );
    };

    img.onerror = (err) => reject(err);
  });
};
