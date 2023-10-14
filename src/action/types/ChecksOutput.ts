export type ChecksOutput = {
  title: string
  summary: string
  text?: string
  annotations?: {
    path: string
    start_line: number
    end_line: number
    start_column?: number
    end_column?: number
    annotation_level: 'notice' | 'warning' | 'failure'
    message: string
    title?: string
    raw_details?: string
  }[]
  images?: {
    alt: string
    image_url: string
    caption?: string
  }[]
}
