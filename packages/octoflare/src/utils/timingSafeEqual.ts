import crypto from 'crypto'

export const timingSafeEqual = (a: string, b: string) =>
  crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
