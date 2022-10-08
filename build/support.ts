import { readdir } from "fs-extra"
import { exec as _execSync } from "node:child_process"
import { resolve } from "node:path"
import { promisify } from "node:util"

import meta from "./meta.json"

const _exec = promisify(_execSync)

export const exec = async (command: string, args: string[] = []) =>
  _exec([command, ...args.map(arg => arg.trim())].join(" "))

const rootDir: string = "/pdf"

export const pdfDir: string = resolve(rootDir, "pdf")
export const htmlDir: string = resolve(rootDir, "html")
export const readmePath: string = resolve(rootDir, "README.md")
export const tocPath: string = resolve(rootDir, "html", "index.html")

export const getPdfFiles = async (): Promise<string[]> =>
  (await readdir(pdfDir)).filter((filename) => filename.endsWith(".pdf"))

export const cleanFilename = (filename: string): string =>
  filename.replace(".pdf", "").replace(".html", "")

export const getPdfPath = (filename: string): string =>
  resolve(pdfDir, `${cleanFilename(filename)}.pdf`)

export const getHtmlPath = (filename: string): string =>
  resolve(htmlDir, `${cleanFilename(filename)}.html`)

const makeArray = (item?: string[]): string => item?.join(", ") ?? ""

export interface FileMeta {
  name: string
  topics?: string[]
  authors?: string[]
  promoted?: boolean,
  source?: string[]
}

export interface Meta {
  files: FileMeta[]
}

export const getFileMeta = (filename: string): FileMeta | undefined =>
  meta.files.find(({ name }) => name === cleanFilename(filename))

export const chunk = (items: string[], size: number) =>
  items.reduce(
    (
      builder,
      e,
      i,
    ) => (i % size ? builder[builder.length - 1].push(e) : builder.push([e]),
      builder),
    [] as string[][],
  )

export interface File {
  name: string
  meta: FileMeta | undefined
  year: string
  title: string
  authors: string
  topics: string
  pdfUrl: string
  htmlUrl: string
}

const makePdfUrl = (name: string): string =>
  `https://github.com/prescience-data/dark-knowledge/blob/main/pdf/${
    encodeURI(`${name}.pdf`)
  }`
const makeHtmlUrl = (name: string): string =>
  `https://dark-knowledge.pages.dev/${encodeURI(`${name}.html`)}`

export const useFile = (filename: string): File => {
  const name: string = cleanFilename(filename)
  const meta: FileMeta | undefined = getFileMeta(name)
  const [year, ...parts] = name.split("-").map(part => part.trim())
  const title: string = parts.join(" - ")

  const pdfUrl: string = makePdfUrl(name)
  const htmlUrl: string = makeHtmlUrl(name)
  const topics: string = makeArray(meta?.topics)
  const authors: string = makeArray(meta?.authors)

  return {
    name,
    meta,
    year,
    title,
    authors,
    topics,
    pdfUrl,
    htmlUrl,
  }
}
