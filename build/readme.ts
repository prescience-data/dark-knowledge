import { writeFile } from "fs-extra"
import { minify } from "html-minifier"
import { readmePath, useFile } from "./support"

export interface TemplateOptions {
  filenames: string[]
}

const makePdfLink = (url: string): string => `[PDF](${url})`

const makeHtmlLink = (url: string): string => `[HTML](${url})`

const makeRow = (filename: string): string => {
  const { year, title, pdfUrl, htmlUrl, topics, authors } = useFile(
    filename,
  )

  return [
    ` `,
    year,
    title,
    makePdfLink(pdfUrl),
    makeHtmlLink(htmlUrl),
    topics,
    authors,
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

export const readme = async (filenames: string[]) => {
  console.log(`Generating README.md`)

  const readme: string = makeReadme({ filenames })

  await writeFile(readmePath, minify(readme))
}
