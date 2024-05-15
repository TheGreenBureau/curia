const keys = <T extends object>(obj: T) => {
  return Object.keys(obj) as Array<keyof T>;
};

const isKey = <T extends object>(x: T, k: PropertyKey): k is keyof T => {
  return k in x;
};

export { isKey, keys };
