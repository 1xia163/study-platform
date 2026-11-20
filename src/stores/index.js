import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

/**
 * Pinia 入口 —— 持久化插件在这里统一注册（全局只此一处）
 *
 * 04 建 store 时只需在 defineStore 的第三个参数写：
 *   { persist: true }
 * 就会自动读写 localStorage，key 自动为 `zhike:<store id>`，
 * 不需要在 store 里手写任何 localStorage 代码。
 *
 * 例如 defineStore('task', ...) → localStorage 里的 key 是 `zhike:task`
 * 统一前缀可以避免和其他项目同名冲突。
 * 只持久化部分字段时用：{ persist: { pick: ['tasks'] } }
 */
export const pinia = createPinia()

pinia.use(
  createPersistedState({
    key: (id) => `zhike:${id}`,
    storage: localStorage,
  }),
)
