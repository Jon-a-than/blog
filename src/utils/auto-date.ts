import { exec, type ExecException } from 'node:child_process'
import { getCollection, type CollectionKey } from 'astro:content'
import { collectionKeys } from '@/content/config'

interface ContentDate {
  pubDate: Date
  patchDate: Date
}

type ContentDateMap = Map<string, ContentDate>
type CollectionDateMap = Map<CollectionKey, ContentDateMap>

class GitExecError extends Error {
  constructor(
    public error: ExecException,
    public stderr: string
  ) {
    super('Error executing git command')
  }
}

export const collectionDateMap = buildCollectionsDateMap(collectionKeys)

async function buildCollectionsDateMap(collections: CollectionKey[]): Promise<CollectionDateMap> {
  const collectionsDateMapEntries = await Promise.all(
    collections.map(async (collection) => {
      const files = (await getCollection(collection)).map(({ id }) => id)
      return [collection, await buildContentDateMap(`src/content/${collection}`, files)] as const
    })
  )

  return new Map(collectionsDateMapEntries)
}

async function buildContentDateMap(
  collectionDir: string,
  files: string[]
): Promise<ContentDateMap> {
  const mapEntries = await Promise.all(
    files.map(async (file) => {
      return [file, await loadContentDateFromGit(`${collectionDir}/${file}`)] as const
    })
  )

  return new Map(mapEntries)
}

function execAsync(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new GitExecError(error, stderr))
        return
      }

      resolve(stdout.trim())
    })
  })
}

async function loadContentDateFromGit(filepath: string): Promise<ContentDate> {
  const dateListStdout = await execAsync(`git log --format=%aD -- ${filepath}`)
  const dates = dateListStdout.split('\n')

  if (dates.length === 1 && dates[0] === '') {
    return {
      pubDate: new Date(),
      patchDate: new Date()
    }
  }

  return {
    // biome-ignore lint/style/noNonNullAssertion: Must be a valid date
    pubDate: new Date(dates.length < 2 ? dates[0] : dates.at(-1)!),
    patchDate: new Date(dates[0])
  }
}
