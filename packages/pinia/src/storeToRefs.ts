import {
  isReactive,
  isRef,
  isVue2,
  toRaw,
  toRef,
  ToRefs,
  toRefs,
} from 'vue-demi'
import { StoreGetters, StoreState } from './store'
import type { PiniaCustomStateProperties, StoreGeneric } from './types'

/**
 * Creates an object of references with all the state, getters, and plugin-added
 * state properties of the store. Similar to `toRefs()` but specifically
 * designed for Pinia stores so methods and non reactive properties are
 * completely ignored.
 * 创建一个引用对象，其中包含所有的状态，getters和插件增加的状态属性。类似于`toRefs()`，但专门为Pinia存储而设计。所以方法和非反应性属性都被完全忽略。
 * @param store - store to extract the refs from
 */
export function storeToRefs<SS extends StoreGeneric>(
  store: SS
): ToRefs<
  StoreState<SS> & StoreGetters<SS> & PiniaCustomStateProperties<StoreState<SS>>
> {
  // See https://github.com/vuejs/pinia/issues/852
  // It's easier to just use toRefs() even if it includes more stuff
  // 用toRefs()更容易，即使包含更多的东西
  if (isVue2) {
    // @ts-expect-error: toRefs include methods and others
    return toRefs(store)
  } else {
    store = toRaw(store)

    const refs = {} as ToRefs<
      StoreState<SS> &
        StoreGetters<SS> &
        PiniaCustomStateProperties<StoreState<SS>>
    >
    for (const key in store) {
      const value = store[key]
      // isRef是用来检测ref类型的，如果是返回的是true,否者返回false
      // isReactive是用来检测reactive类型的，如果是返回的是true,否者返回false
      // @link http://t.zoukankan.com/IwishIcould-p-14876599.html
      if (isRef(value) || isReactive(value)) {
        // @ts-expect-error: the key is state or getter
        refs[key] = toRef(store, key)
        // ref与toRef的区别:
      }
    }

    return refs
  }
}
// TODO: ref toRef toRefs toRaw storeToRefs
