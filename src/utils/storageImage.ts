type StorageImageOptions = {
  width: number
  quality?: number
}

const publicObjectPath = '/storage/v1/object/public/'
const renderImagePath = '/storage/v1/render/image/public/'

export function optimizeStorageImageUrl(
  source: string | null | undefined,
  { width, quality = 75 }: StorageImageOptions,
): string {
  const value = source?.trim()
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
  if (!value || !supabaseUrl) return value || ''

  try {
    const imageUrl = new URL(value)
    const projectUrl = new URL(supabaseUrl)
    if (imageUrl.origin !== projectUrl.origin) return value

    if (imageUrl.pathname.includes(publicObjectPath)) {
      imageUrl.pathname = imageUrl.pathname.replace(publicObjectPath, renderImagePath)
    } else if (!imageUrl.pathname.includes(renderImagePath)) {
      return value
    }

    imageUrl.searchParams.set('width', String(width))
    imageUrl.searchParams.set('quality', String(quality))
    return imageUrl.toString()
  } catch {
    return value
  }
}
