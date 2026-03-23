import { dbPromise, STORES } from './db'
import { Snippet } from './types'
import { nanoid } from 'nanoid'

export class SnippetRepository {
  async create(snippet: Snippet) {
    const db = await dbPromise
    const tx = db.transaction([STORES.SNIPPETS, STORES.TAGS], 'readwrite')
    const snippetStore = tx.objectStore(STORES.SNIPPETS)
    const tagStore = tx.objectStore(STORES.TAGS)
    const tagIdx = tagStore.index('by-title')
    if (snippet.tags) {
      for (const t of snippet.tags) {
        let tag = await tagIdx.get(t)
        if (!tag) {
          await tagStore.add({ id: nanoid(), title: t })
        }
      }
    }
    const key = await snippetStore.put(snippet)
    await tx.done
    return key
  }

  async get(id: string) {
    const db = await dbPromise
    return db.get(STORES.SNIPPETS, id)
  }

  async find(snippetName: string) {
    const db = await dbPromise
    return db.getAllFromIndex(STORES.SNIPPETS, 'by-title', snippetName)
  }

  async list() {
    const db = await dbPromise
    return db.getAll(STORES.SNIPPETS)
  }

  async update(snippet: Snippet) {
    snippet.updatedAt = Date.now()
    return this.create(snippet)
  }

  async delete(id: string) {
    const db = await dbPromise
    return db.delete(STORES.SNIPPETS, id)
  }

  async findByLanguage(language: string) {
    const db = await dbPromise
    return db.getAllFromIndex(STORES.SNIPPETS, 'by-language', language)
  }

  async searchByTag(tag: string) {
    const db = await dbPromise
    return db.getAllFromIndex(STORES.SNIPPETS, 'by-tags', tag)
  }

  async listLatest() {
    const db = await dbPromise
    const tx = db.transaction(STORES.SNIPPETS)
    const store = tx.objectStore(STORES.SNIPPETS)
    const index = store.index('by-createAt')
    const result: Snippet[] = []
    let cursor = await index.openCursor(null, 'prev')
    while (cursor) {
      result.push(cursor.value)
      cursor = await cursor.continue()
    }
    return result
  }

  async clear() {
    const db = await dbPromise
    const tx = db.transaction([STORES.SNIPPETS, STORES.TAGS], 'readwrite')
    const snippetStore = tx.objectStore(STORES.SNIPPETS)
    const tagStore = tx.objectStore(STORES.TAGS)
    await snippetStore.clear()
    await tagStore.clear()
    await tx.done
  }
}

export class TagRepository {
  async create(tag: string) {
    const db = await dbPromise
    return db.put(STORES.TAGS, tag)
  }

  async list() {
    const db = await dbPromise
    return db.getAll(STORES.TAGS)
  }

  async clear() {
    const db = await dbPromise
    return db.clear(STORES.TAGS)
  }
}
