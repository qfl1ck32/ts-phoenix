import { Package, PartialConfig } from '@ts-phoenix/core';
import { EventManagerServiceToken } from '@ts-phoenix/event-manager';
import { I18nPackage, LocaleChangedEvent } from '@ts-phoenix/react-i18n';

import { I18nYupPackageConfigToken, I18nYupServiceToken } from './constants';
import { II18nYupPackageConfig } from './defs';
import { I18nYupService } from './service';

export class I18nYupPackage extends Package<II18nYupPackageConfig> {
  getDependencies() {
    return [I18nPackage];
  }

  bind() {
    this.bindConfig(I18nYupPackageConfigToken);

    this.core.container
      .bind(I18nYupServiceToken)
      .to(I18nYupService)
      .inSingletonScope();
  }

  getDefaultConfig(): PartialConfig<II18nYupPackageConfig, null> {
    return {
      usePathsInTranslations: true,
    };
  }

  async initialise() {
    const i18nYupService = this.core.container.get(I18nYupServiceToken);
    const eventManagerService = this.core.container.get(
      EventManagerServiceToken,
    );

    eventManagerService.addListener({
      event: LocaleChangedEvent,
      handler: i18nYupService.onLocaleChange,
    });
  }
}
