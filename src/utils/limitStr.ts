export const limitStr = (str: string, num: number) =>
  str.length > num ? `${str.substring(0, num)}...` : str
