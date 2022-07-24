import { writeFile } from "fs-extra"
import {
  cleanFilename,
  FileMeta,
  getFileMeta,
  getPdfFiles,
  readmePath,
} from "./support"

export interface TemplateOptions {
  filenames: string[]
}

const encodeUrl = (filename: string, ext: "pdf" | "html"): string =>
  `https://github.com/prescience-data/dark-knowledge/blob/main/${ext}/${
    encodeURI(`${filename}.${ext}`)
  }`

const makeLink = (
  filename: string,
  ext: "pdf" | "html",
): string => `[${ext}](${encodeUrl(filename, ext)})`

const makeArray = (item?: string[]): string => item?.join(", ") ?? ""

const makeRow = (filename: string): string => {
  const name: string = cleanFilename(filename)
  const meta: FileMeta | undefined = getFileMeta(name)
  if (meta) {
    console.log(`Found meta for "${name}".`)
  }
  const [year, ...parts] = name.split("-").map(part => part.trim())
  const title: string = meta?.promoted
    ? `**${parts.join(" - ")}**`
    : parts.join(" - ")

  return [
    ` `,
    year,
    title,
    makeLink(name, "pdf"),
    makeLink(name, "html"),
    makeArray(meta?.topics),
    makeArray(meta?.authors),
    ` `,
  ].map(column => column.trim()).join(" | ")
}

const makeReadme = ({ filenames }: TemplateOptions) =>
  [
    `![image](https://user-images.githubusercontent.com/65471523/116797719-39b4e800-ab2c-11eb-997b-4fef59e99d17.png)`,
    ` `,
    `# Dark Knowledge`,
    `😈📚 A curated library of research papers and presentations for counter-detection and web privacy enthusiasts.`,
    ` `,
    `## Contributing`,
    `_Found an interesting paper you think might fit? Feel free to open an issue or PR!_`,
    `If anyone has time, would be awesome to get PRs adding context to [meta.json](https://github.com/prescience-data/dark-knowledge/blob/main/build/meta.json)`,
    ` `,
    `| Year | Title | PDF | HTML | Topics | Authors |`,
    `|------|-------|-----|------|--------|---------|`,
    ...filenames.reverse().map(makeRow),
    ` `,
  ].map(section => section.trim()).join("\n")

export const generate = async () => {
  console.log(`Generating README.md`)
  const filenames: string[] = await getPdfFiles()

  const readme: string = makeReadme({ filenames })

  await writeFile(readmePath, readme)
}
