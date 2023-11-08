import { Primitive } from './Primitive.js'

export type Json = Primitive | Json[] | { [key: string]: Json }
