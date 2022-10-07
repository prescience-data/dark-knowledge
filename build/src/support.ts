import {readdir} from "fs-extra"
import {resolve} from "node:path"
import meta from "./meta.json"
import {AuthorMeta, File, FileMeta} from "./types"

const rootDir: string = resolve(__dirname, "../../")

export const pdfDir: string = resolve(rootDir, "pdf")
export const readmePath: string = resolve(rootDir, "README.md")

export const getPdfFiles = async (): Promise<string[]> =>
  (await readdir(pdfDir)).filter((filename) => filename.endsWith(".pdf"))

export const cleanFilename = (filename: string): string =>
  filename.replace(".pdf", "")

const makeArray = (item?: string[]): string =>
  item?.filter(i => i && i.length > 0).join(", ") ?? ""

const match = (a: string, b: string): boolean => a.replaceAll(" ", "").toLowerCase() === b.replaceAll(" ", "").toLowerCase()

const getFileMeta = (filename: string): FileMeta | undefined =>
  meta.files.find(({name}) => match(name, filename))

const getAuthorMeta = (author: string): AuthorMeta | undefined =>
  meta.authors.find(({name}) => match(name, author))

const makePdfUrl = (name: string): string =>
  `[PDF](https://github.com/prescience-data/dark-knowledge/blob/main/pdf/${
    encodeURI(`${name}.pdf`)
  })`

const makeAuthorUrl = (author: string) => {
  const {name, url} = getAuthorMeta(author) ?? {}
  if (name && url) {
    return `[${name}](${url})`
  }
  return `${author}`
}

export const useFile = (filename: string): File => {
  const name: string = cleanFilename(filename)
  const meta: FileMeta | undefined = getFileMeta(name)
  const [year, ...parts] = name.split(" - ").map(part => part.trim())

  const title: string = parts.join(" - ")

  const url: string = makePdfUrl(name)
  const topics: string = makeArray(meta?.topics)
  const authors: string = makeArray(meta?.authors?.map(makeAuthorUrl))

  return {
    name,
    meta,
    year,
    title,
    authors,
    topics,
    url,
  }
}

export const contentSize = (content: string): number =>
  encodeURI(content).split(/%..|./).length - 1
