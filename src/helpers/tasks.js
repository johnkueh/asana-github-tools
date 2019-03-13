export const findSomething = () => {};

export const findTaskId = string => {
  const match = string.match(/\[(.+?)\]/);
  if (match) {
    return match[1];
  }

  return null;
};
