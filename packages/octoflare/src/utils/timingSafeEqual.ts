export const timingSafeEqual = (a: string, b: string) =>
  [...Array(a.length).keys()].reduce(
    (prev, _, i) => prev && a.charCodeAt(i) === b.charCodeAt(i),
    a.length === b.length
  )
