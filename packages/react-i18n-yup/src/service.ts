import { Injectable, Inject, InjectToken } from '@ts-phoenix/di';
import { EventManager } from '@ts-phoenix/event-manager';
import { LocaleChangedEvent } from '@ts-phoenix/react-i18n';
import * as yup from 'yup';

import { PACKAGE_CONFIG_TOKEN } from './config';
import { PackageConfigType } from './defs';
import {
  translationsWithPaths,
  translationsWithoutPaths,
} from './translations';

@Injectable()
export class Yup {
  constructor(
    @Inject(EventManager) private eventManager: EventManager,
    @InjectToken(PACKAGE_CONFIG_TOKEN) private config: PackageConfigType,
  ) {
    this.eventManager.addListener({
      event: LocaleChangedEvent,
      handler: this.onLocaleChange,
    });
  }

  private get translationPaths() {
    return this.config.usePathsInTranslations
      ? translationsWithPaths
      : translationsWithoutPaths;
  }

  private onLocaleChange = (event: LocaleChangedEvent) => {
    const locale = event.data!.locale;

    yup.setLocale(this.translationPaths[locale as never]);
  };
}

export { yup };
