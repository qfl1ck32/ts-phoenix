import { Package, PackageConfigToken, PartialConfig } from '@ts-phoenix/core';
import { Injectable } from '@ts-phoenix/di';

import { PACKAGE_CONFIG_TOKEN } from './config';
import { PackageConfigType } from './defs';
import { SessionStorage } from './service';

@Injectable()
export class SessionStoragePackage extends Package<PackageConfigType> {
  getConfigToken(): PackageConfigToken<PackageConfigType> {
    return PACKAGE_CONFIG_TOKEN;
  }

  initialiseServices() {
    return [SessionStorage];
  }

  getDefaultConfig(): PartialConfig<PackageConfigType, null> {
    return {
      localStorageKey: 'session-storage',
    };
  }
}
