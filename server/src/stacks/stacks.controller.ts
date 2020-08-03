import { Controller, Query, HttpException, Post, Get } from '@nestjs/common';
import { Versions, WebAppVersions } from './versions';
import { StacksService20200501 } from './2020-05-01/stacks.service';
import { StacksService20200601 } from './2020-06-01/stacks.service';
import { Os, StackValue } from './2020-06-01/functionapp/stack.model';

@Controller('stacks')
export class StacksController {
  constructor(private _stacksService20200501: StacksService20200501, private _stacksService20200601: StacksService20200601) {}

  @Post('webAppCreateStacks')
  webAppCreateStacks(@Query('api-version') apiVersion: string) {
    this._validateApiVersion(apiVersion, WebAppVersions);

    if (apiVersion === Versions.version20200501) {
      return this._stacksService20200501.getWebAppCreateStacks();
    }
  }

  @Post('webAppConfigStacks')
  webAppConfigStacks(@Query('api-version') apiVersion: string, @Query('os') os?: 'linux' | 'windows') {
    this._validateApiVersion(apiVersion, WebAppVersions);
    this._validateOs(os);

    if (apiVersion === Versions.version20200501) {
      return this._stacksService20200501.getWebAppConfigStacks(os);
    }
  }

  @Post('webAppGitHubActionStacks')
  webAppGitHubActionStacks(@Query('api-version') apiVersion: string, @Query('os') os?: 'linux' | 'windows') {
    this._validateApiVersion(apiVersion, WebAppVersions);
    this._validateOs(os);

    if (apiVersion === Versions.version20200501) {
      return this._stacksService20200501.getWebAppGitHubActionStacks(os);
    }
  }

  @Post('functionAppStacks')
  functionAppStacksPost(@Query('api-version') apiVersion: string, @Query('removeHiddenStacks') removeHiddenStacks?: string) {
    this._validateApiVersion(apiVersion, [Versions.version20200501]);
    this._validateRemoveHiddenStacks(removeHiddenStacks);
    const removeHidden = removeHiddenStacks && removeHiddenStacks.toLowerCase() === 'true';

    if (apiVersion === Versions.version20200501) {
      return this._stacksService20200501.getFunctionAppStacks(removeHidden);
    }
  }

  @Get('functionAppStacks')
  functionAppStacks(
    @Query('api-version') apiVersion: string,
    @Query('os') os?: Os,
    @Query('stack') stack?: StackValue,
    @Query('removeHiddenStacks') removeHiddenStacks?: string
  ) {
    this._validateApiVersion(apiVersion, [Versions.version20200601]);
    this._validateOs(os);
    this._validateStack(stack);
    this._validateRemoveHiddenStacks(removeHiddenStacks);
    const removeHidden = removeHiddenStacks && removeHiddenStacks.toLowerCase() === 'true';

    if (apiVersion === Versions.version20200601) {
      return this._stacksService20200601.getFunctionAppStacks(os, stack, removeHidden);
    }
  }

  @Get('webAppStacks')
  webAppStacks(@Query('api-version') apiVersion: string, @Query('os') os?: 'linux' | 'windows') {
    this._validateApiVersion(apiVersion, [Versions.version20200601]);
    this._validateOs(os);

    if (apiVersion === Versions.version20200601) {
      return this._stacksService20200601.getWebAppStacks(os);
    }
  }

  private _validateOs(os?: 'linux' | 'windows') {
    if (os && os !== 'linux' && os !== 'windows') {
      throw new HttpException(`Incorrect os '${os}' provided. Allowed os values are 'linux' or 'windows'.`, 400);
    }
  }

  private _validateApiVersion(apiVersion: string, acceptedVersions: string[]) {
    if (!apiVersion) {
      throw new HttpException(`Missing 'api-version' query parameter. Allowed versions are: ${acceptedVersions.join(', ')}.`, 400);
    }

    if (!acceptedVersions.includes(apiVersion)) {
      throw new HttpException(`Incorrect api-version '${apiVersion}' provided. Allowed versions are: ${acceptedVersions.join(', ')}.`, 400);
    }
  }

  private _validateStack(stack?: StackValue) {
    const stackValues: StackValue[] = ['dotnetCore', 'dotnetFramework', 'java', 'node', 'powershell', 'python', 'custom'];
    if (stack && !stackValues.includes(stack)) {
      throw new HttpException(`Incorrect stack '${stack}' provided. Allowed stack values are ${stackValues.join(', ')}.`, 400);
    }
  }

  private _validateRemoveHiddenStacks(removeHiddenStacks?: string) {
    if (removeHiddenStacks && removeHiddenStacks.toLowerCase() !== 'true' && removeHiddenStacks.toLowerCase() !== 'false') {
      throw new HttpException(
        `Incorrect removeHiddenStacks '${removeHiddenStacks}' provided. Allowed removeHiddenStacks values are 'true' or 'false'.`,
        400
      );
    }
  }
}
