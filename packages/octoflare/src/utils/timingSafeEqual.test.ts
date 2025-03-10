import { expect, test } from 'bun:test'
import { timingSafeEqual } from './timingSafeEqual.js'

test('timingSafeEqual', () => {
  expect(timingSafeEqual('QQLDbYuk9KjqgmNQQcJa', 'QQLDbYuk9KjqgmNQQcJa')).toBe(
    true
  )
  expect(timingSafeEqual('qkeexLfrnuz2wff8K3Zh', 'qkeexLfrnuz3wff8K3Zh')).toBe(
    false
  )
})
