import { getCurrentInstance, onUnmounted } from 'vue-demi'
import { _Method } from './types'

export const noop = () => {}

export function addSubscription<T extends _Method>(
  subscriptions: T[],
  callback: T,
  detached?: boolean,
  onCleanup: () => void = noop
) {
  subscriptions.push(callback)

  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback)
    if (idx > -1) {
      subscriptions.splice(idx, 1)
      onCleanup()
    }
  }
  //getCurrentInstance  @link https://www.jianshu.com/p/5558cadd10b9
  if (!detached && getCurrentInstance()) {
    // getCurrentInstance 获取当前组件实例
    // 在组件实例被卸载之后调用。
    onUnmounted(removeSubscription)
  }

  return removeSubscription
}

export function triggerSubscriptions<T extends _Method>(
  subscriptions: T[],
  ...args: Parameters<T>
) {
  // 遍历执行
  subscriptions.slice().forEach((callback) => {
    callback(...args)
  })
}
