import { convert } from "./convert"
import { pages } from "./pages"
import { readme } from "./readme"
import { getPdfFiles } from "./support"
;(async () => {
  const filenames: string[] = await getPdfFiles()
  await convert(filenames)
  await readme(filenames)
  await pages(filenames)
})()
