export const isString = (arg: unknown): arg is string => {
  return typeof arg === "string";
};

export const isUndefined = (arg: unknown): arg is undefined => {
  return typeof arg === "undefined";
};
