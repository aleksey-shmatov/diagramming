import { nanoid } from 'nanoid'
import { RoughGenerator } from 'roughjs/bin/generator'

export const generateId = () => nanoid()

export const generateSeed = () => RoughGenerator.newSeed()
