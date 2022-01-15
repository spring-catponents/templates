import { r } from '../helpers'

import { execa } from 'execa'

describe('workflow uses', () => {
  it('not found uses should throw error', async () => {
    const { stderr } = await execa('esmo', [r('test/fixtures/uses/uses.ts')])
    expect(stderr).toBeDefined()
  })
})
