export interface Snippet {
  id: string
  title: string
  icon?: string
  code: string
  keyword: string | null
  tags: string[] | null
  createdAt: number
  updatedAt: number
}

export interface Tag {
  id: string
  title: string
}
