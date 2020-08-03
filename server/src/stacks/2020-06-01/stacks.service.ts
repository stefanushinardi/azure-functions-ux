import { Injectable } from '@nestjs/common';
import { ArrayUtil } from '../../utilities/array.util';
import { WebAppStack, WebAppRuntimes, WebAppMajorVersion, JavaContainers, WebAppMinorVersion } from './webapp/stacks.model';
import { FunctionAppStack, FunctionAppMajorVersion, FunctionAppMinorVersion, StackValue } from './functionapp/stacks.model';
import { dotnetCoreStack as WebAppDotnetCoreStack } from './webapp/stacks/dotnetCore';
import { javaStack as WebAppJavaStack } from './webapp/stacks/java';
import { aspDotnetStack as WebAppAspDotnetStack } from './webapp/stacks/aspDotnet';
import { nodeStack as WebAppNodeStack } from './webapp/stacks/node';
import { rubyStack as WebAppRubyStack } from './webapp/stacks/ruby';
import { pythonStack as WebAppPythonStack } from './webapp/stacks/python';
import { phpStack as WebAppPhpStack } from './webapp/stacks/php';
import { javaContainersStack as WebAppJavaContainersStack } from './webapp/stacks/javaContainers';
import { dotnetCoreStack as FunctionAppDotnetCoreStack } from './functionapp/stacks/dotnetCore';
import { nodeStack as FunctionAppNodeStack } from './functionapp/stacks/node';
import { pythonStack as FunctionAppPythonStack } from './functionapp/stacks/python';
import { javaStack as FunctionAppJavaStack } from './functionapp/stacks/java';
import { powershellStack as FunctionAppPowershellStack } from './functionapp/stacks/powershell';
import { dotnetFrameworkStack as FunctionAppDotnetFrameworkStack } from './functionapp/stacks/dotnetFramework';
import { customStack as FunctionAppCustomStack } from './functionapp/stacks/custom';
import { Os } from './stacks.model';

@Injectable()
export class StacksService20200601 {
  getWebAppStacks(os?: Os): WebAppStack<WebAppRuntimes | JavaContainers>[] {
    const runtimeStacks = [
      WebAppAspDotnetStack,
      WebAppNodeStack,
      WebAppPythonStack,
      WebAppPhpStack,
      WebAppDotnetCoreStack,
      WebAppRubyStack,
      WebAppJavaStack,
    ];
    const containerStacks = [WebAppJavaContainersStack];

    if (!os) {
      const allStacks: WebAppStack<WebAppRuntimes | JavaContainers>[] = [...runtimeStacks, ...containerStacks];
      return allStacks;
    }

    const filteredStacks: WebAppStack<WebAppRuntimes | JavaContainers>[] = [
      ...this._filterRuntimeStacks(runtimeStacks, os),
      ...this._filterContainerStacks(containerStacks, os),
    ];
    return filteredStacks;
  }

  getFunctionAppStacks(os?: Os, stackValue?: StackValue, removeHiddenStacks?: boolean): FunctionAppStack[] {
    const dotnetCoreStackCopy = JSON.parse(JSON.stringify(FunctionAppDotnetCoreStack));
    const nodeStackCopy = JSON.parse(JSON.stringify(FunctionAppNodeStack));
    const pythonStackCopy = JSON.parse(JSON.stringify(FunctionAppPythonStack));
    const javaStackCopy = JSON.parse(JSON.stringify(FunctionAppJavaStack));
    const powershellStackCopy = JSON.parse(JSON.stringify(FunctionAppPowershellStack));
    const dotnetFrameworkStackCopy = JSON.parse(JSON.stringify(FunctionAppDotnetFrameworkStack));
    const customStackCopy = JSON.parse(JSON.stringify(FunctionAppCustomStack));

    let stacks: FunctionAppStack[] = [
      dotnetCoreStackCopy,
      nodeStackCopy,
      pythonStackCopy,
      javaStackCopy,
      powershellStackCopy,
      dotnetFrameworkStackCopy,
      customStackCopy,
    ];

    if (stackValue) {
      stacks = [stacks.find(stack => stack.value === stackValue)];
    }

    return !os && !removeHiddenStacks ? stacks : this._filterStacks(stacks, os, removeHiddenStacks);
  }

  private _filterStacks(stacks: FunctionAppStack[], os?: Os, removeHiddenStacks?: boolean): FunctionAppStack[] {
    stacks.forEach((stack, i) => {
      stack.majorVersions.forEach((majorVersion, j) => {
        majorVersion.minorVersions.forEach((minorVersion, k) => {
          // Set Runtimes Settings as undefined if they do not meet filters
          this._setUndefinedByOs(stacks, i, j, k, os);
          this._setUndefinedByHidden(stacks, i, j, k, removeHiddenStacks);
        });
        // Remove Minor Versions without Runtime Settings
        ArrayUtil.remove<FunctionAppMinorVersion>(majorVersion.minorVersions, minorVersion => {
          return !minorVersion.stackSettings.windowsRuntimeSettings && !minorVersion.stackSettings.linuxRuntimeSettings;
        });
      });
      // Remove Major Versions without Minor Versions
      ArrayUtil.remove<FunctionAppMajorVersion>(stack.majorVersions, majorVersion => {
        return majorVersion.minorVersions.length === 0;
      });
    });

    // Remove Stacks without Major Versions
    ArrayUtil.remove<FunctionAppStack>(stacks, stack => stack.majorVersions.length === 0);
    return stacks;
  }

  private _setUndefinedByOs(stacks: FunctionAppStack[], i: number, j: number, k: number, os?: Os): void {
    if (os === Os.linux) {
      stacks[i].majorVersions[j].minorVersions[k].stackSettings.windowsRuntimeSettings = undefined;
    } else if (os === Os.windows) {
      stacks[i].majorVersions[j].minorVersions[k].stackSettings.linuxRuntimeSettings = undefined;
    }
  }

  private _setUndefinedByHidden(stacks: FunctionAppStack[], i: number, j: number, k: number, removeHiddenStacks?: boolean): void {
    if (removeHiddenStacks) {
      const windowsRuntimeSettings = stacks[i].majorVersions[j].minorVersions[k].stackSettings.windowsRuntimeSettings;
      const linuxRuntimeSettings = stacks[i].majorVersions[j].minorVersions[k].stackSettings.linuxRuntimeSettings;

      if (windowsRuntimeSettings && windowsRuntimeSettings.isHidden) {
        stacks[i].majorVersions[j].minorVersions[k].stackSettings.windowsRuntimeSettings = undefined;
      }

      if (linuxRuntimeSettings && linuxRuntimeSettings.isHidden) {
        stacks[i].majorVersions[j].minorVersions[k].stackSettings.linuxRuntimeSettings = undefined;
      }
    }
  }

  private _filterRuntimeStacks(stacks: WebAppStack<WebAppRuntimes>[], os: Os): WebAppStack<WebAppRuntimes | JavaContainers>[] {
    const filteredStacks: WebAppStack<WebAppRuntimes | JavaContainers>[] = [];
    stacks.forEach(stack => {
      const newStack = this._buildNewStack(stack);
      stack.majorVersions.forEach(majorVersion => {
        const newMajorVersion = this._buildNewMajorVersion(majorVersion);
        majorVersion.minorVersions.forEach(minorVersion => {
          this._addCorrectMinorVersionsForRuntime(newMajorVersion, minorVersion, os);
        });
        this._addMajorVersion(newStack, newMajorVersion);
      });
      this._addStack(filteredStacks, newStack);
    });
    return filteredStacks;
  }

  private _filterContainerStacks(stacks: WebAppStack<JavaContainers>[], os: Os): WebAppStack<WebAppRuntimes | JavaContainers>[] {
    const filteredStacks: WebAppStack<WebAppRuntimes | JavaContainers>[] = [];
    stacks.forEach(runtimeStack => {
      const newStack = this._buildNewStack(runtimeStack);
      runtimeStack.majorVersions.forEach(majorVersion => {
        const newMajorVersion = this._buildNewMajorVersion(majorVersion);
        majorVersion.minorVersions.forEach(minorVersion => {
          this._addCorrectMinorVersionsForContainer(newMajorVersion, minorVersion, os);
        });
        this._addMajorVersion(newStack, newMajorVersion);
      });
      this._addStack(filteredStacks, newStack);
    });
    return filteredStacks;
  }

  private _buildNewStack(stack: WebAppStack<WebAppRuntimes | JavaContainers>): WebAppStack<WebAppRuntimes | JavaContainers> {
    return {
      displayText: stack.displayText,
      value: stack.value,
      preferredOs: stack.preferredOs,
      majorVersions: [],
    };
  }

  private _buildNewMajorVersion(
    majorVersion: WebAppMajorVersion<WebAppRuntimes | JavaContainers>
  ): WebAppMajorVersion<WebAppRuntimes | JavaContainers> {
    return {
      displayText: majorVersion.displayText,
      value: majorVersion.value,
      minorVersions: [],
    };
  }

  private _addMajorVersion(
    newStack: WebAppStack<WebAppRuntimes | JavaContainers>,
    newMajorVersion: WebAppMajorVersion<WebAppRuntimes | JavaContainers>
  ) {
    if (newMajorVersion.minorVersions.length > 0) {
      newStack.majorVersions.push(newMajorVersion);
    }
  }

  private _addStack(
    filteredStacks: WebAppStack<WebAppRuntimes | JavaContainers>[],
    newStack: WebAppStack<WebAppRuntimes | JavaContainers>
  ) {
    if (newStack.majorVersions.length > 0) {
      filteredStacks.push(newStack);
    }
  }

  private _addCorrectMinorVersionsForRuntime(
    newMajorVersion: WebAppMajorVersion<WebAppRuntimes | JavaContainers>,
    minorVersion: WebAppMinorVersion<WebAppRuntimes>,
    os: Os
  ) {
    if (os === Os.linux && minorVersion.stackSettings.linuxRuntimeSettings !== undefined) {
      this._addNewMinorVersionLinuxRuntime(newMajorVersion, minorVersion);
    } else if (os === Os.windows && minorVersion.stackSettings.windowsRuntimeSettings !== undefined) {
      this._addNewMinorVersionWindowsRuntime(newMajorVersion, minorVersion);
    }
  }

  private _addNewMinorVersionLinuxRuntime(
    newMajorVersion: WebAppMajorVersion<WebAppRuntimes | JavaContainers>,
    minorVersion: WebAppMinorVersion<WebAppRuntimes>
  ) {
    const newMinorVersion: WebAppMinorVersion<WebAppRuntimes> = {
      displayText: minorVersion.displayText,
      value: minorVersion.value,
      stackSettings: {
        linuxRuntimeSettings: minorVersion.stackSettings.linuxRuntimeSettings,
      },
    };
    newMajorVersion.minorVersions.push(newMinorVersion);
  }

  private _addNewMinorVersionWindowsRuntime(
    newMajorVersion: WebAppMajorVersion<WebAppRuntimes | JavaContainers>,
    minorVersion: WebAppMinorVersion<WebAppRuntimes>
  ) {
    const newMinorVersion: WebAppMinorVersion<WebAppRuntimes> = {
      displayText: minorVersion.displayText,
      value: minorVersion.value,
      stackSettings: {
        windowsRuntimeSettings: minorVersion.stackSettings.windowsRuntimeSettings,
      },
    };
    newMajorVersion.minorVersions.push(newMinorVersion);
  }

  private _addCorrectMinorVersionsForContainer(
    newMajorVersion: WebAppMajorVersion<WebAppRuntimes | JavaContainers>,
    minorVersion: WebAppMinorVersion<JavaContainers>,
    os: Os
  ) {
    if (os === Os.linux && minorVersion.stackSettings.linuxContainerSettings !== undefined) {
      this._addNewMinorVersionLinuxContainer(newMajorVersion, minorVersion);
    } else if (os === Os.windows && minorVersion.stackSettings.windowsContainerSettings !== undefined) {
      this._addNewMinorVersionWindowsContainer(newMajorVersion, minorVersion);
    }
  }

  private _addNewMinorVersionLinuxContainer(
    newMajorVersion: WebAppMajorVersion<WebAppRuntimes | JavaContainers>,
    minorVersion: WebAppMinorVersion<JavaContainers>
  ) {
    const newMinorVersion: WebAppMinorVersion<JavaContainers> = {
      displayText: minorVersion.displayText,
      value: minorVersion.value,
      stackSettings: {
        linuxContainerSettings: minorVersion.stackSettings.linuxContainerSettings,
      },
    };
    newMajorVersion.minorVersions.push(newMinorVersion);
  }

  private _addNewMinorVersionWindowsContainer(
    newMajorVersion: WebAppMajorVersion<WebAppRuntimes | JavaContainers>,
    minorVersion: WebAppMinorVersion<JavaContainers>
  ) {
    const newMinorVersion: WebAppMinorVersion<JavaContainers> = {
      displayText: minorVersion.displayText,
      value: minorVersion.value,
      stackSettings: {
        windowsContainerSettings: minorVersion.stackSettings.windowsContainerSettings,
      },
    };
    newMajorVersion.minorVersions.push(newMinorVersion);
  }
}
