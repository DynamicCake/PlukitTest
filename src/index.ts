
import { PluginMeta, PlukitCore, PlukitPlugin, Priority, ProxyEvent, DisableReason } from "plukit/index";

class HelloWorldPlugin implements PlukitPlugin {
    meta: PluginMeta = {
        pluginId: "hello world",
        version: "1.0.0",
    };

    state: ActiveState | undefined

    async onEnable(panel: PlukitCore): Promise<void> {
        let eventManager = panel.hook.getHook({
            originalObject: panel.stateNode(),
            field: "setState",
            debugString: "hello world"
        });
        eventManager.subscribe(this.meta.pluginId, {
            callback: new HelloWorldProxy(),
            priority: Priority.LOWEST
        });

        this.state = {
            eventManager: eventManager
        };

        console.log("Hello World Plugin Enabled!");
    }

    async onDisable(reason: DisableReason): Promise<void> {
        let panel = this.state!
        panel.eventManager.unsubscribe(this.meta.pluginId);

        console.log("Hello World Plugin Disabled! code: " + reason)
    }

}

interface ActiveState {
    eventManager: ProxyEvent<any>
}

class HelloWorldProxy implements ProxyHandler<any> {
    apply(target: any, thisArg: any, argArray: any[]) {
        console.log("Hello world", { target: target, thisArg: thisArg, argArray: argArray })
        return Reflect.apply(target, thisArg, argArray);
    }
}