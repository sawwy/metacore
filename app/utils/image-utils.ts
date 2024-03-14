export const getImageURL = (name: string) => {
  const url = new URL(`../assets/images/${name}`, import.meta.url).href;
  return url;
};
