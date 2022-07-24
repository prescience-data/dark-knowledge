import { convert } from "./convert"
import { generate } from "./readme"
;(async () => {
  await convert()
  await generate()
})()
