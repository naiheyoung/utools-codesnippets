import { openDB } from 'idb'

export const DB_NAME = 'db-snippets'
export const STORES = {
  SNIPPETS: 'snippets',
  TAGS: 'tags'
}

export const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    const snippetStore = db.createObjectStore(STORES.SNIPPETS, {
      keyPath: 'id'
    })
    snippetStore.createIndex('by-title', 'title')
    snippetStore.createIndex('by-keyword', 'keyword')
    snippetStore.createIndex('by-createAt', 'createdAt')
    snippetStore.createIndex('by-tags', 'tags', { multiEntry: true })

    const tagStore = db.createObjectStore(STORES.TAGS, {
      keyPath: 'id'
    })
    tagStore.createIndex('by-title', 'title', { unique: true })
  }
})
