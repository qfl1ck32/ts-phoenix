import inquirer from 'inquirer';
import inquirer_autocomplete from 'inquirer-autocomplete-prompt';

import { Inject, Injectable } from '@ts-chimera/di';
import { Logger } from '@ts-chimera/logger';

import { MicroserviceType } from './defs';

inquirer.registerPrompt('autocomplete', inquirer_autocomplete);

@Injectable()
export class CLI {
  constructor(@Inject(Logger) private readonly logger: Logger) {}

  async run() {
    // this.logger.info("Let's go!");

    const { create } = await inquirer.prompt([
      {
        type: 'list',
        name: 'create',
        message: 'Select what do you want to create:',
        choices: ['microservice', 'package'],
      },
    ]);

    switch (create) {
      case 'microservice':
        await this.createMicroservice();
        break;

      case 'package':
        await this.createPackage();
        break;
    }
  }

  async search(options: string[], _: any, input: string) {
    return input
      ? options.filter((option) =>
          option.toLowerCase().startsWith(input.toLowerCase()),
        )
      : options;
  }

  async promptForName(message: string): Promise<string> {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: message,
        validate: (input: string) =>
          input.trim() !== '' || 'Please enter a valid name.',
      },
    ]);
    return name;
  }

  async createMicroservice(): Promise<void> {
    const options = Object.values(MicroserviceType);

    const { component } = await inquirer.prompt([
      {
        type: 'autocomplete',
        name: 'component',
        message: 'Choose the microservice component:',
        source: this.search.bind(this, options),
      },
    ]);

    const name = await this.promptForName(`Enter the ${component} name:`);
    this.logger.info(
      `You have created a ${component} microservice with the name "${name}".`,
    );
  }

  async createPackage(): Promise<void> {
    const packageName = await this.promptForName('Enter the package name:');
    this.logger.info(
      `You have created a package with the name "${packageName}".`,
    );
  }
}