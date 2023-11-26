export const objectKeys = <T extends string | number | symbol>(object: Record<T, any>) => {
  return Object.keys(object) as T[];
};

export const objectValues = <T>(object: Record<any, T>) => {
  return Object.values(object) as T[];
};
