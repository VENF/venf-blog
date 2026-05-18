import { describe, it, expect } from 'vitest'
import { getProjectBySlug, getAllProjects } from '@/lib/projects'

describe('getAllProjects', () => {
  it('returns an array', () => {
    const projects = getAllProjects()
    expect(Array.isArray(projects)).toBe(true)
  })

  it('sorts by date descending', () => {
    const projects = getAllProjects()
    for (let i = 1; i < projects.length; i++) {
      expect(new Date(projects[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(projects[i].date).getTime()
      )
    }
  })
})

describe('getProjectBySlug', () => {
  it('returns project for example slug', () => {
    const project = getProjectBySlug('example')
    expect(project).not.toBeNull()
    expect(project!.title).toBeTruthy()
    expect(project!.readme).toBeTruthy()
  })

  it('has demo flag', () => {
    const project = getProjectBySlug('example')
    expect(project!.demo).toBe(true)
  })

  it('returns null for unknown slug', () => {
    expect(getProjectBySlug('non-existent')).toBeNull()
  })
})
