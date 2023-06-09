import { Core } from '@ts-phoenix/core';
import { EventManagerPackage } from '@ts-phoenix/event-manager';

import { I18nServiceToken } from '@src/index';
import { I18nPackage } from '@src/package';

declare module '@src/defs' {
  interface Translations {
    hi: string;
  }
}

describe('react-i18n', () => {
  it('should return the correct translation', async () => {
    const translations = {
      en: {
        hi: 'Hello',
      },
      ro: {
        hi: 'Buna',
      },
    };

    const core = new Core({
      packages: [
        new EventManagerPackage(),

        new I18nPackage({
          defaultLocale: 'en',
          translations,
        }),
      ],
    });

    await core.initialise();

    const i18n = core.container.get(I18nServiceToken);

    expect(i18n.t('hi')).toBe(translations.en.hi);

    i18n.onLocaleChange('ro');

    expect(i18n.t('hi')).toBe(translations.ro.hi);
  });
});
