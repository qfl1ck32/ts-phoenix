import { Injectable } from '@ts-chimera/react-di';
import { Package, PartialConfig } from '@ts-chimera/core';
import { Session } from './service';
import { Config, RequiredConfig } from './defs';
import { SESSION_CONFIG } from './tokens';
import { PartialBy } from '@ts-chimera/typings';

@Injectable()
export class SessionPackage extends Package<Config, RequiredConfig> {
  async initialise() {
    this.setConfigToken(SESSION_CONFIG);
  }

  public getServices() {
    return [Session];
  }

  getDefaultConfig(): PartialConfig<Config, RequiredConfig> {
    return {
      storage: undefined,
    };
  }
}