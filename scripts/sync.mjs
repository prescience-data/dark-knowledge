import {resolve} from "path"
import {readdir, readFile, writeFile} from "fs/promises"

async function main() {

  console.log(`Syncing "meta.json" with pdf directory...`)

  const metaFilePath = resolve("./meta.json")

  const meta = JSON.parse(await readFile(metaFilePath, "utf-8"))

  const pdfDirPath = resolve("./pdf")

  const pdfFilenames = (await readdir(pdfDirPath)).filter(filename => filename.endsWith(".pdf"))

  console.log(`Found ${pdfFilenames.length} pdf files in directory...`)


  for (const pdfFilename of pdfFilenames) {
    if (meta.some((entry) => entry.filename === pdfFilename)) {
      return
    }

    const filename = pdfFilename.trim()
    const year = Number(filename.split("-")[0].trim())
    const title = filename.replace(`${year} - `, "").replace(`.pdf`, "").trim()
    meta.push({
      filename,
      year,
      title,
      authors: [],
      topics: [],
      stars: 0
    })
  }

  for(const entry of meta){
    if(!pdfFilenames.includes(entry.filename)){
      meta.splice(meta.indexOf(entry), 1)
    }
  }


  console.log(`Writing ${meta.length} entries to "meta.json"...`)

  await writeFile(metaFilePath, JSON.stringify(meta, null, 2), "utf-8")

  console.log(`Done!`)

}


main().catch(error => console.error(error.message))
