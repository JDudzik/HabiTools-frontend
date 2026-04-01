let supportsWebp = undefined;


export const detectWebpSupport = async () => {
  if (supportsWebp !== undefined) {
    return supportsWebp;
  }

   
  if (!self.createImageBitmap) {
    supportsWebp = false;
    return false;
  }

  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  supportsWebp = await createImageBitmap(blob).then(() => true, () => false); // eslint-disable-line require-atomic-updates
  return supportsWebp;
};
