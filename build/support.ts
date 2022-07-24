import { readdir } from "fs-extra"
import { exec as _execSync } from "node:child_process"
import { resolve } from "node:path"
import { promisify } from "node:util"

import meta from "./meta.json"

const _exec = promisify(_execSync)

export const exec = async (command: string, args: string[] = []) =>
  _exec([command, ...args.map(arg => arg.trim())].join(" "))

export const pdfDir: string = resolve("/pdf", "pdf")
export const htmlDir: string = resolve("/pdf", "html")
export const readmePath: string = resolve("/pdf", "README.md")

export const getPdfFiles = async (): Promise<string[]> =>
  (await readdir(pdfDir)).filter((filename) => filename.endsWith(".pdf"))

export const getHtmlFiles = async (): Promise<string[]> =>
  (await readdir(htmlDir)).filter((filename) => filename.endsWith(".html"))

export const cleanFilename = (filename: string): string =>
  filename.replace(".pdf", "").replace(".html", "")

export const getPdfPath = (filename: string): string =>
  resolve(pdfDir, `${cleanFilename(filename)}.pdf`)

export const getHtmlPath = (filename: string): string =>
  resolve(htmlDir, `${cleanFilename(filename)}.html`)

export interface FileMeta {
  name: string
  topics?: string[]
  authors?: string[]
  promoted?: boolean
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
