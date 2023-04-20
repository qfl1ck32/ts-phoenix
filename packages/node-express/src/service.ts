import { createServer, Server as ServerType } from 'http';
import { AddressInfo } from 'net';

import { Injectable, Inject, InjectToken } from '@ts-phoenix/di';
import { EventManager } from '@ts-phoenix/event-manager';
import { Logger } from '@ts-phoenix/logger';
import express from 'express';

import { PACKAGE_CONFIG_TOKEN } from './config';
import { PackageConfigType, Application } from './defs';
import {
  BeforeServerStartEvent,
  AfterServerStartEvent,
  BeforeServerStopEvent,
} from './events';

@Injectable()
export class Express {
  private app: Application;
  private server!: ServerType;

  constructor(
    @Inject(EventManager) private eventManager: EventManager,
    @Inject(Logger) private logger: Logger,
    @InjectToken(PACKAGE_CONFIG_TOKEN) private config: PackageConfigType,
  ) {
    this.logger = this.logger.getWithPrefix('Express');

    this.app = express();
    this.server = createServer(this.app);
  }

  async start() {
    this.logger.info('Starting...');

    await this.eventManager.emitSync(
      new BeforeServerStartEvent({ app: this.app, server: this.server }),
    );

    await new Promise((resolve) =>
      this.server.listen(this.config.port, () => {
        resolve(null);
      }),
    );

    await this.eventManager.emitSync(
      new AfterServerStartEvent({ app: this.app, server: this.server }),
    );

    const { port } = this.server.address() as AddressInfo;

    this.logger.info(`Listening on port ${port}.`);
  }

  async stop() {
    this.logger.info('Stopping...');

    await this.eventManager.emitSync(
      new BeforeServerStopEvent({ app: this.app, server: this.server }),
    );

    await new Promise((resolve) => this.server.close(resolve));

    this.logger.info('Stopped.');
  }
}
