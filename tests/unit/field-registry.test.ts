import { z } from 'zod'
import { describe, it, expect, beforeEach } from 'vitest'
import { fieldRegistry } from '@/features/streaming-form/plugins/registry'
import type { FieldPlugin } from '@/features/streaming-form/plugins/types'

describe('fieldRegistry', () => {
  it('returns plugin for known types', () => {
    expect(fieldRegistry.get('text')).toBeDefined()
    expect(fieldRegistry.get('email')).toBeDefined()
    expect(fieldRegistry.get('textarea')).toBeDefined()
    expect(fieldRegistry.get('select')).toBeDefined()
    expect(fieldRegistry.get('checkbox')).toBeDefined()
  })

  it('throws for unknown type', () => {
    expect(() => fieldRegistry.get('unknown')).toThrow('Unknown field type')
  })

  it('returns all registered type names', () => {
    const types = fieldRegistry.types()
    expect(types).toContain('text')
    expect(types).toContain('email')
    expect(types).toContain('textarea')
    expect(types).toContain('select')
    expect(types).toContain('checkbox')
  })

  it('has types method', () => {
    expect(fieldRegistry.has('text')).toBe(true)
    expect(fieldRegistry.has('unknown')).toBe(false)
  })

  it('each plugin has non-null required properties', () => {
    const types = fieldRegistry.types()
    for (const type of types) {
      const plugin = fieldRegistry.get(type)
      expect(plugin.component).toBeDefined()
      expect(plugin.skeleton).toBeDefined()
      expect(typeof plugin.buildSchema).toBe('function')
      expect(plugin.defaultValue).not.toBeUndefined()
    }
  })

  it('text buildSchema returns z.string()', () => {
    const plugin = fieldRegistry.get('text')
    const schema = plugin.buildSchema({ name: 'test', type: 'text' })
    expect(schema.safeParse('hello').success).toBe(true)
    expect(schema.safeParse(123).success).toBe(false)
  })

  it('email buildSchema returns z.string().email()', () => {
    const plugin = fieldRegistry.get('email')
    const schema = plugin.buildSchema({ name: 'test', type: 'email' })
    expect(schema.safeParse('test@test.com').success).toBe(true)
    expect(schema.safeParse('not-an-email').success).toBe(false)
  })

  it('checkbox buildSchema returns z.boolean()', () => {
    const plugin = fieldRegistry.get('checkbox')
    const schema = plugin.buildSchema({ name: 'test', type: 'checkbox' })
    expect(schema.safeParse(true).success).toBe(true)
    expect(schema.safeParse(false).success).toBe(true)
    expect(schema.safeParse('string').success).toBe(false)
  })

  it('select buildSchema returns z.enum() with options', () => {
    const plugin = fieldRegistry.get('select')
    const schema = plugin.buildSchema({
      name: 'test',
      type: 'select',
      options: ['a', 'b', 'c'],
    })
    expect(schema.safeParse('a').success).toBe(true)
    expect(schema.safeParse('d').success).toBe(false)
  })

  it('register adds a new plugin', () => {
    const customPlugin: FieldPlugin = {
      type: 'custom',
      component: () => null,
      skeleton: () => null,
      buildSchema: () => z.string(),
      defaultValue: '',
    }
    fieldRegistry.register(customPlugin)
    expect(fieldRegistry.has('custom')).toBe(true)
    expect(fieldRegistry.get('custom')).toBe(customPlugin)
  })
})
