import Polyglot from 'node-polyglot';

import { Inject, InjectToken, Injectable } from '@ts-chimera/react-di';
import { EventManager } from '@ts-chimera/event-manager';

import { AllPhrases, Config } from './defs';
import { LanguageChangedEvent } from './events';
import { I18N_CONFIG } from './tokens';

@Injectable()
export class I18n {
  private polyglots!: Map<string, Polyglot>;

  public activePolyglot!: Polyglot;

  constructor(
    @InjectToken(I18N_CONFIG) private config: Config,
    @Inject(EventManager) private eventManager: EventManager,
  ) {
    this.polyglots = new Map();

    for (const locale of Object.keys(config.translations)) {
      const phrases =
        config.translations[locale as keyof typeof config.translations];

      const polyglot = new Polyglot({
        locale,
        phrases: [],
        interpolation: {
          prefix: '{{ ',
          suffix: ' }}',
        },
      });

      polyglot.extend(phrases);
      this.polyglots.set(locale, polyglot);
    }

    this.activePolyglot = this.polyglots.get(
      this.config.defaultLocale,
    ) as Polyglot;
  }

  public async onLanguageChange(language: string) {
    this.activePolyglot = this.polyglots.get(language) as Polyglot;

    await this.eventManager.emitAsync(
      new LanguageChangedEvent({
        language,
      }),
    );
  }

  public t<T extends AllPhrases>(
    phrase: T,
    options?: number | Polyglot.InterpolationOptions | undefined,
  ) {
    return this.activePolyglot.t(phrase, options);
  }
}