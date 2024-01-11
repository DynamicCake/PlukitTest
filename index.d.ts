declare module 'plukit/impl/HookImpl' {
  import Hook, { ActiveHook } from "plukit/lib/Hook";
  import ProxyEventManager from "plukit/lib/ProxyEvent";
  class HookImpl implements Hook {
      secretHandshake: symbol;
      activeHooks: ActiveHook[];
      constructor();
      getHook<T extends object>(activeHook: ActiveHook): ProxyEventManager<T>;
      cleanUp(): void;
  }
  export default HookImpl;

}
declare module 'plukit/impl/PanelBuilderImpl' {
  import PlukitBuilder from "plukit/lib/PlukitBuilder";
  import PluginManager from "plukit/lib/PluginManager";
  import PlukitCore from "plukit/lib/PlukitCore";
  class PlukitBuilderImpl implements PlukitBuilder {
      pluginManager: PluginManager;
      constructor();
      finish(): Promise<PlukitCore>;
  }
  export default PlukitBuilderImpl;

}
declare module 'plukit/impl/PluginManagerImpl' {
  import PluginManager from "plukit/lib/PluginManager";
  import PlukitPlugin from "plukit/lib/PlukitPlugin";
  class PluginManagerImpl implements PluginManager {
      private pluginMap;
      constructor();
      add(plugin: PlukitPlugin): boolean;
      remove(id: string): boolean;
      get(id: string): PlukitPlugin | undefined;
      getKeyList(): string[];
      getValueList(): PlukitPlugin[];
      has(name: string): boolean;
      clear(): void;
  }
  export default PluginManagerImpl;

}
declare module 'plukit/impl/PlukitCoreImpl' {
  import Hook from "plukit/lib/Hook";
  import PlukitCore from "plukit/lib/PlukitCore";
  import PluginManager from "plukit/lib/PluginManager";
  import { DisableReason } from "plukit/lib/PlukitPlugin";
  class PlukitCoreImpl implements PlukitCore {
      version: string;
      isActive: boolean;
      hook: Hook;
      loadedPlugins: PluginManager;
      pluginManager: PluginManager;
      private pageChangeListenerId;
      private constructor();
      static init(plugins: PluginManager): Promise<PlukitCore>;
      private addPageChangeListener;
      loadPlugins(location: string): Promise<void>;
      private isMatch;
      private unloadPlugins;
      private unloadAllPlugins;
      reloadPlugins(reason: DisableReason): Promise<void>;
      stateNode(): any;
      cleanUp(): Promise<void>;
  }
  export default PlukitCoreImpl;

}
declare module 'plukit/impl/ProxyEventImpl' {
  import ProxyEventManager from "plukit/lib/ProxyEvent";
  import ProxyEventHandler from "plukit/lib/ProxyEventHandler";
  class ProxyEventImpl<T extends object> implements ProxyEventManager<T> {
      subscribers: Map<string, ProxyEventHandler<T>>;
      constructor();
      subscribe(id: string, handler: ProxyEventHandler<T>): boolean;
      unsubscribe(id: string): boolean;
      emit(funcName: string, args: IArguments): any;
  }
  export default ProxyEventImpl;

}
declare module 'plukit/index' {
  import Hook, { ActiveHook } from "plukit/lib/Hook";
  import PlukitCore from "plukit/lib/PlukitCore";
  import PlukitBuilder from "plukit/lib/PlukitBuilder";
  import PluginManager from "plukit/lib/PluginManager";
  import PlukitPlugin, { DisableReason, PluginDependencies, PluginMeta } from "plukit/lib/PlukitPlugin";
  import Priority from "plukit/lib/Priority";
  import ProxyEventManager from "plukit/lib/ProxyEvent";
  import ProxyEventHandler from "plukit/lib/ProxyEventHandler";
  import { StringIndexed } from "plukit/lib/Utils";
  import ProxyEvent from "plukit/lib/ProxyEvent";
  export { PlukitCore, StringIndexed, Hook, ActiveHook, PlukitBuilder, PluginManager, PlukitPlugin, Priority, ProxyEventManager, ProxyEventHandler, PluginDependencies, PluginMeta, ProxyEvent, DisableReason };

}
declare module 'plukit/lib/Hook' {
  import ProxyEventManager from "plukit/lib/ProxyEvent";
  import { StringIndexed } from "plukit/lib/Utils";
  interface Hook {
      activeHooks: ActiveHook[];
      /**
       * The property that is checked for when wanting to check if something is a proxy.
       * Is a randomly generated every time this is constructed.
       */
      secretHandshake: Symbol;
      /**
       * Gets the hook of the provided object
       * Note: Due to the way that JavaScript does stuff, you cannot just provide the function to hook into
       * @param obj which object to hook into
       * @param property which property in the object
       * @param debugString when something goes wrong, this string will be printed out
       * @throws If there was a problem when accessing the property of obj
       */
      getHook(hook: ActiveHook): ProxyEventManager<any>;
      /**
       * Cleans up all the hooks
       */
      cleanUp(): void;
  }
  interface ActiveHook {
      originalObject: StringIndexed;
      field: string;
      debugString: string | undefined;
  }
  export default Hook;
  export { ActiveHook };

}
declare module 'plukit/lib/PluginManager' {
  import PlukitPlugin from "plukit/lib/PlukitPlugin";
  interface PluginManager {
      /**
       * Adds a plugin to the manager
       * @param plugin plugin code
       * @returns if the operation was successful
       */
      add(plugin: PlukitPlugin): boolean;
      /**
       * Removes a plugin from the manager
       * @param id plugin with the id to remove
       */
      remove(id: string): boolean;
      /**
       * Get the plugin with a given id
       * @param id unique plugin id
       */
      get(id: string): PlukitPlugin | undefined;
      /**
       * Get all the plugin ids
       */
      getKeyList(): string[];
      /**
       * Gets all the plugins
       */
      getValueList(): PlukitPlugin[];
      /**
       * Checks if the plugin exists
       */
      has(name: string): boolean;
      /**
       * Clears all the plugins
       */
      clear(): void;
  }
  export default PluginManager;

}
declare module 'plukit/lib/PlukitBuilder' {
  import PluginManager from "plukit/lib/PluginManager";
  import PlukitLib from "plukit/lib/PlukitCore";
  /**
   * The main front end for Plukit.
   *
   * To create a panel, construct
   */
  interface PanelBuilder {
      pluginManager: PluginManager;
      /**
       * Finish building the plugin
       */
      finish(): Promise<PlukitLib>;
  }
  export default PanelBuilder;

}
declare module 'plukit/lib/PlukitCore' {
  import Hook from "plukit/lib/Hook";
  import PluginManager from "plukit/lib/PluginManager";
  import { DisableReason } from "plukit/lib/PlukitPlugin";
  interface PlukitCore {
      readonly version: string;
      isActive: boolean;
      hook: Hook;
      loadedPlugins: PluginManager;
      pluginManager: PluginManager;
      /**
       * Reloads all the plugins
       * @param reason reason to tell plugins that there was a disable
       * @param location current path of the
       */
      reloadPlugins(reason: DisableReason, location: string): Promise<void>;
      /**
       * Loads all the plugins that match the criteria
       */
      loadPlugins(location: string): Promise<void>;
      /**
       * The gateway to Blooket modding, has about anything you need.
       * Originally created by Minesraft2
       * @returns stateNode object
       */
      stateNode(): any;
      /**
       * Cleans up everything and hopefully leave no traces
       */
      cleanUp(): Promise<void>;
  }
  export default PlukitCore;

}
declare module 'plukit/lib/PlukitPlugin' {
  import PlukitLib from "plukit/lib/PlukitCore";
  /**
   * Represents a PlukitPlugin
   */
  interface PlukitPlugin {
      /**
       * Static data that contains the plugin information like the name and version
       */
      readonly meta: PluginMeta;
      /**
       * Function that gets called when the web url gets a match
       * @param panel the panel the called the plugin
       * @see enabledInHeadless
       */
      onEnable(panel: PlukitLib, onLoad: Promise<void>): void;
      /**
       * Function that gets called when the web url is no longer matching
       */
      onDisable(reason: DisableReason): void;
  }
  interface PluginMeta {
      /**
       * The plugin's id
       * Required to have the same regex as a html id attribute (`^[a-zA-Z][\w:.-]*$`)
       */
      readonly pluginId: string;
      /**
       * The plugin's version (use semantic versioning https://semver.org/)
       */
      readonly version: string;
      /**
       * Plugins that the plugin requires to function
       * Include the plugin name and semver versioning
       */
      readonly dependencies?: PluginDependencies;
      /**
       * Plugins that the plugin can interop with but is not required to have
       * Include the plugin name and semver versioning
       */
      readonly softDependencies?: PluginDependencies;
      /**
       * The list of urls and regexps that if matched, will call onEnable
       *
       * Remember that JavaScript RegExps are stateful but can be reset with `regex.lastIndex = 0;`
       * @see onEnable
       * @see enabledInHeadless
       */
      readonly enabledIn?: PluginEnabledIn;
  }
  /**
   * Reason that a plugin's onDisable method gets called
   */
  enum DisableReason {
      /**
       * When url changes and is not in the whitelist
       */
      URL_CHANGE = 0,
      /**
       * When plukit gets disabled
       */
      DISABLED = 1,
      /**
       * When plukit gets shut down and cleaned up
       */
      SHUTDOWN = 2,
      /**
       * For other plugins to call
       * Will never be called by plukit, only other plugins
       */
      PLUGIN = 3
  }
  type PluginDependencies = {
      pluginId: string;
      version: string;
  }[] | undefined;
  type PluginEnabledIn = (string | RegExp)[] | undefined;
  export default PlukitPlugin;
  export { PluginDependencies, PluginEnabledIn, PluginMeta, DisableReason };

}
declare module 'plukit/lib/Priority' {
  enum Priority {
      LOWEST = -2,
      LOW = -1,
      NORMAL = 0,
      HIGH = 1,
      HIGHEST = 2,
      MONITOR = 2147483647
  }
  export default Priority;

}
declare module 'plukit/lib/ProxyEvent' {
  import ProxyEventHandler from "plukit/lib/ProxyEventHandler";
  interface ProxyEventManager<T extends Object> {
      subscribers: Map<string, ProxyEventHandler<T>>;
      subscribe(id: string, handler: ProxyEventHandler<T>): boolean;
      unsubscribe(id: string): boolean;
      /**
       * Calls all the plugins that have hooked into this event
       * DO NOT CALL UNLESS YOU KNOW WHAT YOU ARE DOING.
       */
      emit(funcName: string, args: IArguments): any;
  }
  export default ProxyEventManager;

}
declare module 'plukit/lib/ProxyEventHandler' {
  import Priority from "plukit/lib/Priority";
  interface ProxyEventHandler<T extends object> {
      callback: ProxyHandler<T>;
      priority: Priority;
  }
  export default ProxyEventHandler;

}
declare module 'plukit/lib/Utils' {
  type StringIndexed = {
      [key: string]: any;
  };
  type SymbolIndexed = {
      [key: symbol]: any;
  };
  export { StringIndexed, SymbolIndexed };

}
declare module 'plukit/project/hello_world' {
  export {};

}
declare module 'plukit/project/panel' {
  import { PlukitPlugin } from "plukit/index";
  import PlukitLib from "plukit/lib/PlukitCore";
  import { PluginMeta } from "plukit/lib/PlukitPlugin";
  export default class BlookPanel implements PlukitPlugin {
      meta: PluginMeta;
      panel: ElementManager | undefined;
      onEnable(panel: PlukitLib): void;
      onDisable(): void;
  }
  class ElementManager {
      moduleManager: PanelModuleManager;
      root: HTMLDivElement;
      constructor();
  }
  class PanelModuleManager {
      pluginMap: Map<string, ShadowRoot>;
      root: ShadowRoot;
      constructor(modules: HTMLDivElement);
      /**
       * Allocates an area for a plugin
       * @param id element id (recommended to be your plugin id)
       * @returns assigned shadow root
       * @throws if plugin has already been added to the panel
       */
      add(id: string): ShadowRoot;
      /**
       * Removes an element from the panel, usually called in PlukitPlugin#onDisable()
       * @param id element id
       * @returns if the removal was successful
       */
      remove(id: string): boolean;
      /**
       * Gets the panel and creates a section if it doesn't exist
       * Can be used in modules when you do not care about the order
       * @param id element id
       * @returns assigned shadow root
       */
      getLenient(id: string): ShadowRoot;
      /**
       * Gets the element based on the element id
       * @param id element id
       * @returns shadow root if it was successful
       */
      get(id: string): ShadowRoot | undefined;
      getKeyList(): string[];
      getValueList(): ShadowRoot[];
      private create;
  }
  export {};

}
declare module 'plukit/project/panel_user' {
  export {};

}
declare module 'plukit/project/program' {
  export {};

}
declare module 'plukit' {
  import main = require('plukit/index');
  export = main;
}