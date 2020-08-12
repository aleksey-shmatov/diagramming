export const fillKinds = [
    'hachure',
    'solid',
    'zigzag',
    'cross-hatch',
    'dots',
    'dashed',
    'zigzag-line',
    'none',
]

export type FillKind = typeof fillKinds[number]

export type StrokeStyle = {
    color: string
    width: number
    opacity: number
}

export type FillStyle = {
    color: string
    opacity: number
}

export type RoughStyle = {
    roughness: number
    seed: number
    fillKind: FillKind
}

export type AllStyles = {
    stroke: StrokeStyle
    fill: FillStyle
    rough: RoughStyle
}

export const defaultFillStyle: FillStyle = {
    color: '#8ed1fc',
    opacity: 1,
}

export const defaultStrokeStyle: StrokeStyle = {
    color: '#0693E3',
    opacity: 1,
    width: 2,
}

export const defaultRoughStyle: RoughStyle = {
    roughness: 1,
    seed: 1,
    fillKind: 'hachure',
}
