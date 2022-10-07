import {writeFile} from "fs-extra"
import {contentSize, getPdfFiles, readmePath, useFile} from "./support"
import {TemplateOptions} from "./types";

(async () => {
  console.log(`Generating README.md`)

  const filenames: string[] = await getPdfFiles()

  console.log(`Loaded ${filenames.length} pdf files.`)

  const row = (filename: string): string => {
    const { year, title, url, topics, authors } = useFile(
      filename,
    )

    return [
      ` `,
      year,
      title,
      url,
      topics,
      authors,
      ` `,
    ].map(column => column.trim()).join(" | ")
  }

  const template = ({ filenames }: TemplateOptions) =>
    [
      `![image](https://user-images.githubusercontent.com/65471523/116797719-39b4e800-ab2c-11eb-997b-4fef59e99d17.png)`,
      ` `,
      `# Dark Knowledge`,
      `😈📚 A curated library of research papers and presentations for counter-detection and web privacy enthusiasts.`,
      ` `,
      `## Contributing`,
      `1. _Found an interesting paper you think might fit? Feel free to open an issue or PR!_`,
      ``,
      `2. If anyone has time, would be awesome to get PRs adding context to [meta.json](https://github.com/prescience-data/dark-knowledge/blob/main/build/meta.json)`,
      ` `,
      `| Year | Title | PDF | Topics | Authors |`,
      `|------|-------|-----|--------|---------|`,
      ...filenames.sort().reverse().map(row),
      ` `,
    ].map(section => section.trim()).join("\n")

  const readme: string = template({ filenames })

  console.log(`Generated template (${contentSize(readme)} bytes).`)

  await writeFile(readmePath, readme)

  console.log(`Template written to "${readmePath}" successfully.`)
})()
