export interface FileMeta {
  name: string
  topics?: string[]
  authors?: string[]
  promoted?: boolean
}

export interface AuthorMeta {
  name: string
  url: string
}

export interface Meta {
  files: FileMeta[]
  authors: AuthorMeta[]
}

export interface File {
  name: string
  meta: FileMeta | undefined
  year: string
  title: string
  authors: string
  topics: string
  url: string
}

export interface TemplateOptions {
  filenames: string[]
}
