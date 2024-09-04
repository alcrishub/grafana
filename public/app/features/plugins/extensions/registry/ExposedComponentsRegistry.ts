import { PluginExtensionExposedComponentConfig } from '@grafana/data';

import { extensionPointEndsWithVersion } from '../validators';

import { Registry, RegistryType, PluginExtensionConfigs } from './Registry';

export type ExposedComponentRegistryItem<Props = {}> = {
  pluginId: string;
  title: string;
  description: string;
  component: React.ComponentType<Props>;
};

export class ExposedComponentsRegistry extends Registry<
  ExposedComponentRegistryItem,
  PluginExtensionExposedComponentConfig
> {
  constructor(initialState: RegistryType<ExposedComponentRegistryItem> = {}) {
    super({
      initialState,
    });
  }

  mapToRegistry(
    registry: RegistryType<ExposedComponentRegistryItem>,
    { pluginId, configs }: PluginExtensionConfigs<PluginExtensionExposedComponentConfig>
  ): RegistryType<ExposedComponentRegistryItem> {
    if (!configs) {
      return registry;
    }

    for (const config of configs) {
      const { id, description, title } = config;
      const log = this.logger.child({ id, description, title, pluginId });

      if (!id.startsWith(pluginId)) {
        log.warning(
          `Could not register exposed component with id '${id}'. Reason: The component id does not match the id naming convention. Id should be prefixed with plugin id. e.g 'myorg-basic-app/my-component-id/v1'.`
        );
        continue;
      }

      if (!extensionPointEndsWithVersion(id)) {
        log.warning(
          `Exposed component with id '${id}' does not match the convention. It's recommended to suffix the id with the component version. e.g 'myorg-basic-app/my-component-id/v1'.`
        );
      }

      if (registry[id]) {
        log.warning(
          `Could not register exposed component with id '${id}'. Reason: An exposed component with the same id already exists.`
        );
        continue;
      }

      if (!title) {
        log.warning(`Could not register exposed component with id '${id}'. Reason: Title is missing.`);
        continue;
      }

      if (!description) {
        log.warning(`Could not register exposed component with id '${id}'. Reason: Description is missing.`);
        continue;
      }

      registry[id] = { ...config, pluginId };
    }

    return registry;
  }
}
