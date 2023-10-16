import {resolve} from "path"
import {readFile, writeFile} from "fs/promises"

async function main() {


  const metaFilePath = resolve("./meta.json")
  const readmeFilePath = resolve("./README.md")

  const meta = JSON.parse(await readFile(metaFilePath, "utf-8"))
  meta.sort((a, b) => b.year - a.year)

  console.log(`Found ${meta.length} files in "meta.json"...`)


  const readme = [ /* language=md */ ...`
    ![image](https://user-images.githubusercontent.com/65471523/116797719-39b4e800-ab2c-11eb-997b-4fef59e99d17.png)

    # Dark Knowledge

    😈📚 A curated library of research papers and presentations for counter-detection and web privacy enthusiasts.

    | Year | Title | PDF | Topics | Authors |
    |------|-------|-----|--------|---------|
  `.trim().split("\n")]

  console.log(`Built header...`)


  for (const {year, title, filename, topics, authors} of meta) {
    readme.push( /* language=md */ `
      | ${year} | ${title} | [PDF]("${encodeURI(`https://github.com/prescience-data/dark-knowledge/blob/main/pdf/${filename}`)}") | ${(topics ?? []).join(", ")} | ${(authors ?? []).join(", ")} |
    `)
  }

  console.log(`Built table...`)


  await writeFile(readmeFilePath, readme.map(line => line.trim()).join("\n"), "utf-8")

  console.log(`Done!`)

}


main().catch(error => console.error(error.message))
