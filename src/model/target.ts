import { ResizeDirection } from './core'

export type TargetType = 'shape' | 'marker'
export type MarkerRole = 'rotate' | ResizeDirection

export type TargetData =
    | {
          type: 'shape'
          id: string
      }
    | {
          type: 'marker'
          role: MarkerRole
      }
