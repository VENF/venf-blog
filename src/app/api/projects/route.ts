import { NextResponse } from 'next/server'
import { getAllProjects } from '@/lib/projects'

export async function GET() {
  return NextResponse.json(getAllProjects())
}
