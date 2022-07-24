import { writeFile } from "fs-extra"
import { tocPath, useFile } from "./support"

export interface PagesOptions {
  filenames: string[]
}

const rowStyle: string = "border border-slate-300 p-4"

const makeRow = (filename: string): string => {
  const { title, year, authors, topics, htmlUrl } = useFile(filename)

  return `
  <tr>
    <td class="${rowStyle}">${year}</td>
    <td class="${rowStyle}"><a href="${htmlUrl}">${title}</a></td>
    <td class="${rowStyle}">${topics}</td>
    <td class="${rowStyle}">${authors}</td>
  </tr>
  `.trim()
}

export const makeToc = ({ filenames }: PagesOptions) => {
  // language=HTML
  return `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-site-verification" content="_A7DdusQaLlDkL7pfuJ_cPwHjT9tir4SUMrFUe5CjSU" />
    <title>Dark Knowledge</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
    tailwind.config = {
      theme: { extend: {
          colors: { primary: "#cfd9df", secondary: "#e2ebf0" }
      } }
    }
    </script>
  </head>
  <body class="bg-gradient-to-r from-primary to-secondary p-6">
    <div class="container mx-auto bg-slate-50 rounded-sm">
      <table class="rounded-sm border-collapse border border-slate-400">
      <thead>
        <tr>
          <th class="${rowStyle}">Year</th>
          <th class="${rowStyle}">Title</th>
          <th class="${rowStyle}">Topics</th>
          <th class="${rowStyle}">Authors</th>
        </tr>
      </thead>
      <tbody>
          ${filenames.map(makeRow).join("\n")}
      </tbody>
      </table>
    </div>
  </body>
  </html>
  `.trim()
}

export const pages = async (filenames: string[]) => {
  console.log(`Generating Pages table of contents.`)
  const toc: string = makeToc({ filenames })

  await writeFile(tocPath, toc)
}
