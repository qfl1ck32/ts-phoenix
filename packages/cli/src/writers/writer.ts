import fs from 'fs';
import path from 'path';

import { Inject } from '@ts-phoenix/core';
import { ILoggerService, LoggerServiceToken } from '@ts-phoenix/logger';

interface Replacement {
  original: string;
  new: string;
}

export class Writer {
  constructor(
    @Inject(LoggerServiceToken) protected readonly logger: ILoggerService,
  ) {}

  public copyTemplate(
    srcDir: string,
    destDir: string,
    ignoreList: string[] = [],
    replacements: Replacement[] = [],
  ) {
    if (!fs.existsSync(srcDir)) {
      console.error(`Source directory "${srcDir}" does not exist.`);
      return;
    }

    this.createDestinationDirectory(destDir);
    this.copyFiles(srcDir, destDir, ignoreList, replacements);
  }

  private createDestinationDirectory(destDir: string) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
  }

  private copyFiles(
    source: string,
    destination: string,
    ignoreList: string[],
    replacements: Replacement[],
  ) {
    const files = fs.readdirSync(source);

    files.forEach((file) => {
      if (ignoreList.includes(file)) {
        return;
      }

      const srcPath = path.join(source, file);
      const destPath = path.join(destination, file);

      this.logger.info(`Writing ${destPath}...`);

      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        this.createDestinationDirectory(destPath);
        this.copyFiles(srcPath, destPath, ignoreList, replacements);
      } else {
        const content = fs.readFileSync(srcPath, 'utf8');
        const newContent = this.applyReplacements(content, replacements);
        fs.writeFileSync(destPath, newContent, 'utf8');
      }
    });
  }

  private applyReplacements(
    content: string,
    replacements: Replacement[],
  ): string {
    let newContent = content;

    replacements.forEach((replacement) => {
      newContent = newContent.split(replacement.original).join(replacement.new);
    });

    return newContent;
  }
}
