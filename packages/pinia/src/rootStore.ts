import {
  App,
  EffectScope,
  getCurrentInstance,
  inject,
  InjectionKey,
  Ref,
} from 'vue-demi'
import {
  StateTree,
  PiniaCustomProperties,
  _Method,
  Store,
  _GettersTree,
  _ActionsTree,
  PiniaCustomStateProperties,
  DefineStoreOptionsInPlugin,
  StoreGeneric,
} from './types'

/**
 * setActivePinia must be called to handle SSR at the top of functions like
 * `fetch`, `setup`, `serverPrefetch` and others
 * setActivePinia 必须在函数的顶部调用，如 `fetch`, `setup`, `serverPrefetch` 等
 */
export let activePinia: Pinia | undefined

/**
 * Sets or unsets the active pinia. Used in SSR and internally when calling
 * actions and getters
 * 设置或者取消设置活跃的 pinia。在 SSR 和内部调用 actions 和 getters
 * @param pinia - Pinia instance
 */
export const setActivePinia = (pinia: Pinia | undefined) =>
  (activePinia = pinia)

/**
 * Get the currently active pinia if there is any.
 *
 */
export const getActivePinia = () =>
  (getCurrentInstance() && inject(piniaSymbol)) || activePinia

/**
 * Every application must own its own pinia to be able to create stores
 * 每一个应用程序都必须拥有自己的pinia来创建store
 */
export interface Pinia {
  install: (app: App) => void

  /**
   * root state
   */
  state: Ref<Record<string, StateTree>>

  /**
   * Adds a store plugin to extend every store
   *  增加一个store插件来扩展每个store
   * @param plugin - store plugin to add
   */
  use(plugin: PiniaPlugin): Pinia

  /**
   * Installed store plugins
   *
   * @internal
   */
  _p: PiniaPlugin[]

  /**
   * App linked to this Pinia instance
   *
   * @internal
   */
  _a: App

  /**
   * Effect scope the pinia is attached to
   *
   * @internal
   */
  _e: EffectScope

  /**
   * Registry of stores used by this pinia.
   *
   * @internal
   */
  _s: Map<string, StoreGeneric>

  /**
   * Added by `createTestingPinia()` to bypass `useStore(pinia)`.
   *
   * @internal
   */
  _testing?: boolean
}

export const piniaSymbol = (
  __DEV__ ? Symbol('pinia') : /* istanbul ignore next */ Symbol()
) as InjectionKey<Pinia>

/**
 * Context argument passed to Pinia plugins.
 */
export interface PiniaPluginContext<
  Id extends string = string,
  S extends StateTree = StateTree,
  G /* extends _GettersTree<S> */ = _GettersTree<S>,
  A /* extends _ActionsTree */ = _ActionsTree
> {
  /**
   * pinia instance.
   */
  pinia: Pinia

  /**
   * Current app created with `Vue.createApp()`.
   */
  app: App

  /**
   * Current store being extended.
   */
  store: Store<Id, S, G, A>

  /**
   * Initial options defining the store when calling `defineStore()`.
   */
  options: DefineStoreOptionsInPlugin<Id, S, G, A>
}

/**
 * Plugin to extend every store.
 * 通过插件扩展每一个store
 */
export interface PiniaPlugin {
  /**
   * Plugin to extend every store. Returns an object to extend the store or
   * nothing.
   *  插件扩展每一个store，返回一个对象来扩展store
   * @param context - Context
   */
  (context: PiniaPluginContext): Partial<
    PiniaCustomProperties & PiniaCustomStateProperties
  > | void
}

/**
 * Plugin to extend every store.
 * 通过插件扩展每一个store
 * @deprecated use PiniaPlugin instead
 */
export type PiniaStorePlugin = PiniaPlugin
