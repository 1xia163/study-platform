/**
 * 笔记照片的二进制存储 —— 只放 IndexedDB，localStorage 里只保留元数据。
 *
 * 约定（AGENTS.md 数据与持久化约定）：
 * - localStorage: photos: [{ photoId, fileName, sortOrder }]
 * - IndexedDB:    photoId → Blob
 * 两者都成功才算保存成功。
 */

const DB_NAME = 'zhike-media'
const STORE_NAME = 'note-photos'
const DB_VERSION = 1

let dbPromise = null

function openDb() {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('当前环境不支持 IndexedDB'))
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

  return dbPromise
}

async function withStore(mode, run) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode)
    const store = transaction.objectStore(STORE_NAME)
    let result
    try {
      result = run(store)
    } catch (error) {
      reject(error)
      return
    }
    transaction.oncomplete = () => resolve(result?.result ?? result)
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}

/**
 * 写入一张照片
 * @param {string} photoId 照片 id
 * @param {Blob} blob 图片二进制
 * @returns {Promise<void>}
 */
export async function putPhoto(photoId, blob) {
  if (!photoId || !blob) return
  await withStore('readwrite', (store) => store.put(blob, photoId))
}

/**
 * 读取一张照片，不存在时返回 null
 * @param {string} photoId 照片 id
 * @returns {Promise<Blob|null>}
 */
export async function getPhoto(photoId) {
  if (!photoId) return null
  const blob = await withStore('readonly', (store) => store.get(photoId)).catch(() => null)
  return blob instanceof Blob ? blob : null
}

/**
 * 删除一张照片；不存在时也视为成功
 * @param {string} photoId 照片 id
 * @returns {Promise<void>}
 */
export async function deletePhoto(photoId) {
  if (!photoId) return
  await withStore('readwrite', (store) => store.delete(photoId)).catch(() => {})
}
