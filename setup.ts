import { walk, readFileStr, writeFileStr } from 'https://deno.land/std/fs/mod.ts'
import { BufReader } from 'https://deno.land/std/io/bufio.ts'

const { exit } = Deno
const files = []

let projectName = ''

console.log('Choose a name for the project:')
const reader = new BufReader(Deno.stdin)
const input = await reader.readLine()
if (input) {
  projectName = new TextDecoder().decode(input.line)
} else {
  console.log('NAME is not valid')
  exit()
}

for await (const entry of walk(".")) {
  if (entry.path.match(/\.ts+$/)) {
    files.push(
      readFileStr(entry.path).then(
        content => ({
          content,
          path: entry.path
        })
      )
    )
  }
}

await Promise.all(
  (await Promise.all(files)).map(
    (file) => {
      const content = file.content.replace(/template/g, projectName)
      return writeFileStr(file.path, content)
    }
  )
)