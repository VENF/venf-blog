import { fieldRegistry } from '../plugins/registry'

interface FieldSkeletonProps {
  type: string
}

export function FieldSkeleton({ type }: FieldSkeletonProps) {
  const Skeleton = fieldRegistry.get(type).skeleton
  return <Skeleton />
}
