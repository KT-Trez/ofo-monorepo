export const exhaustiveCheck = (value: never) => {
  throw new Error(`Exhaustive check not met: ${value}`);
};
