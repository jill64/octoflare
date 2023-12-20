#!/usr/bin/env node

import * as p from '@clack/prompts'
import kleur from 'kleur'
import { output } from './steps/output.js'
import { create } from './steps/create.js'
import { input } from './steps/input.js'

p.intro(kleur.cyan().bold('create-octoflare'))

const params = await input()

const s = p.spinner()

s.start('Creating project...')

await create(params)

s.stop('Successfully created project.')

p.outro(output(params))
