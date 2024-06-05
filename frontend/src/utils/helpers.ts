import { EGenre } from '~/constants/enum'
import { DImage } from '~/types/data'

export function enumToSlug(enumValue: string): string {
  return enumValue.replace(/_/g, '-').toLowerCase()
}

// Function to get enum from slug
export function slugToEnum(
  slug: string
): EGenre | undefined {
  const enumKeys = Object.keys(EGenre).filter((key) =>
    isNaN(Number(key))
  )
  for (const key of enumKeys) {
    if (
      enumToSlug(EGenre[key as keyof typeof EGenre]) ===
      slug.toLowerCase()
    ) {
      return EGenre[key as keyof typeof EGenre]
    }
  }
  return undefined
}

export function downloadMusic(file: DImage) {
  const { path, fileName } = file
  fetch(path)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a Blob object with the correct content type
      const mp3Blob = new Blob([blob], {
        type: 'audio/mpeg'
      })

      // Create a URL object using the Blob data
      const url = window.URL.createObjectURL(mp3Blob)

      // Create an anchor (a) element to initiate the download
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)

      // Append the anchor element to the body to trigger the download
      document.body.appendChild(link)
      link.click()

      // Remove the anchor element after download is initiated
      link.parentNode?.removeChild(link)
    })
    .catch((error) =>
      console.error('Error downloading music:', error)
    )
}
