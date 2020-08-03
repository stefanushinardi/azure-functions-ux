import { Injectable } from '@nestjs/common';
import { ArrayUtil } from '../../utilities/array.util';
import { WebAppConfigStack, WebAppCreateStack, WebAppCreateStackVersionPlatform, WebAppCreateStackVersion } from './webapp/stack.model';
import { aspDotnetWindowsConfigStack } from './webapp/stacks/config/windows/aspDotnet';
import { nodeWindowsConfigStack } from './webapp/stacks/config/windows/node';
import { pythonWindowsConfigStack } from './webapp/stacks/config/windows/python';
import { phpWindowsConfigStack } from './webapp/stacks/config/windows/php';
import { dotnetCoreWindowsConfigStack } from './webapp/stacks/config/windows/dotnetCore';
import { javaWindowsConfigStack } from './webapp/stacks/config/windows/java';
import { javaContainerWindowsConfigStack } from './webapp/stacks/config/windows/javaContainer';
import { nodeLinuxConfigStack } from './webapp/stacks/config/linux/node';
import { pythonLinuxConfigStack } from './webapp/stacks/config/linux/python';
import { phpLinuxConfigStack } from './webapp/stacks/config/linux/php';
import { dotnetCoreLinuxConfigStack } from './webapp/stacks/config/linux/dotnetCore';
import { rubyLinuxConfigStack } from './webapp/stacks/config/linux/ruby';
import { java8LinuxConfigStack } from './webapp/stacks/config/linux/java8';
import { java11LinuxConfigStack } from './webapp/stacks/config/linux/java11';
import { aspDotnetCreateStack } from './webapp/stacks/create/aspDotnet';
import { nodeCreateStack } from './webapp/stacks/create/node';
import { pythonCreateStack } from './webapp/stacks/create/python';
import { phpCreateStack } from './webapp/stacks/create/php';
import { dotnetCoreCreateStack } from './webapp/stacks/create/dotnetCore';
import { rubyCreateStack } from './webapp/stacks/create/ruby';
import { java8CreateStack } from './webapp/stacks/create/java8';
import { java11CreateStack } from './webapp/stacks/create/java11';
import { FunctionAppStack, FunctionAppStackVersionPlatform, FunctionAppStackVersion } from './functionapp/stack.model';
import { dotnetCoreStack } from './functionapp/stacks/dotnetCore';
import { nodeStack } from './functionapp/stacks/node';
import { pythonStack } from './functionapp/stacks/python';
import { javaStack } from './functionapp/stacks/java';
import { powershellStack } from './functionapp/stacks/powershell';
import { customStack } from './functionapp/stacks/custom';

@Injectable()
export class StacksService20200501 {
  getWebAppConfigStacks(os?: 'linux' | 'windows'): WebAppConfigStack[] {
    const windowsStacks = [
      aspDotnetWindowsConfigStack,
      nodeWindowsConfigStack,
      pythonWindowsConfigStack,
      phpWindowsConfigStack,
      dotnetCoreWindowsConfigStack,
      javaWindowsConfigStack,
      javaContainerWindowsConfigStack,
    ];

    const linuxStacks = [
      nodeLinuxConfigStack,
      pythonLinuxConfigStack,
      phpLinuxConfigStack,
      dotnetCoreLinuxConfigStack,
      rubyLinuxConfigStack,
      java8LinuxConfigStack,
      java11LinuxConfigStack,
    ];

    if (os === 'linux') {
      return linuxStacks;
    }
    if (os === 'windows') {
      return windowsStacks;
    }
    return windowsStacks.concat(linuxStacks);
  }

  getWebAppCreateStacks(os?: 'linux' | 'windows'): WebAppCreateStack[] {
    const aspDotnetCreateStackCopy = JSON.parse(JSON.stringify(aspDotnetCreateStack));
    const nodeCreateStackCopy = JSON.parse(JSON.stringify(nodeCreateStack));
    const pythonCreateStackCopy = JSON.parse(JSON.stringify(pythonCreateStack));
    const phpCreateStackCopy = JSON.parse(JSON.stringify(phpCreateStack));
    const dotnetCoreCreateStackCopy = JSON.parse(JSON.stringify(dotnetCoreCreateStack));
    const rubyCreateStackCopy = JSON.parse(JSON.stringify(rubyCreateStack));
    const java8CreateStackCopy = JSON.parse(JSON.stringify(java8CreateStack));
    const java11CreateStackCopy = JSON.parse(JSON.stringify(java11CreateStack));

    const stacks: WebAppCreateStack[] = [
      aspDotnetCreateStackCopy,
      nodeCreateStackCopy,
      pythonCreateStackCopy,
      phpCreateStackCopy,
      dotnetCoreCreateStackCopy,
      rubyCreateStackCopy,
      java8CreateStackCopy,
      java11CreateStackCopy,
    ];

    if (!os) {
      return stacks;
    }

    // remove all supported platforms which do not support the provided os.
    stacks.forEach(stack =>
      stack.versions.forEach(version =>
        ArrayUtil.remove<WebAppCreateStackVersionPlatform>(version.supportedPlatforms, platform => platform.os !== os)
      )
    );

    // remove all versions which do not have any platforms.
    stacks.forEach(stack => ArrayUtil.remove<WebAppCreateStackVersion>(stack.versions, version => version.supportedPlatforms.length === 0));

    // remove all stacks which do not have any versions.
    ArrayUtil.remove<WebAppCreateStack>(stacks, stackItem => stackItem.versions.length === 0);

    return stacks;
  }

  getWebAppGitHubActionStacks(os?: 'linux' | 'windows'): WebAppCreateStack[] {
    const stacks = this.getWebAppCreateStacks(os);

    // remove all supported platforms which are not github action supported.
    stacks.forEach(stack =>
      stack.versions.forEach(version =>
        ArrayUtil.remove<WebAppCreateStackVersionPlatform>(
          version.supportedPlatforms,
          platform => !platform.githubActionSettings || !platform.githubActionSettings.supported
        )
      )
    );

    // remove all versions which do not have any platforms.
    stacks.forEach(stack => ArrayUtil.remove<WebAppCreateStackVersion>(stack.versions, version => version.supportedPlatforms.length === 0));

    // remove all stacks which do not have any versions.
    ArrayUtil.remove<WebAppCreateStack>(stacks, stackItem => stackItem.versions.length === 0);

    return stacks;
  }

  getFunctionAppStacks(removeHiddenStacks?: boolean): FunctionAppStack[] {
    const dotnetCoreStackCopy = JSON.parse(JSON.stringify(dotnetCoreStack));
    const nodeStackCopy = JSON.parse(JSON.stringify(nodeStack));
    const pythonStackCopy = JSON.parse(JSON.stringify(pythonStack));
    const javaStackCopy = JSON.parse(JSON.stringify(javaStack));
    const powershellStackCopy = JSON.parse(JSON.stringify(powershellStack));
    const customStackCopy = JSON.parse(JSON.stringify(customStack));

    const stacks: FunctionAppStack[] = [
      dotnetCoreStackCopy,
      nodeStackCopy,
      pythonStackCopy,
      javaStackCopy,
      powershellStackCopy,
      customStackCopy,
    ];

    if (!removeHiddenStacks) {
      return stacks;
    }

    // remove all supported platforms where isHidden is true
    stacks.forEach(stack =>
      stack.versions.forEach(version =>
        ArrayUtil.remove<FunctionAppStackVersionPlatform>(version.supportedPlatforms, platform => platform.isHidden)
      )
    );

    // remove all versions which do not have any platforms
    stacks.forEach(stack => ArrayUtil.remove<FunctionAppStackVersion>(stack.versions, version => version.supportedPlatforms.length === 0));

    // remove all stacks which do not have any versions
    ArrayUtil.remove<FunctionAppStack>(stacks, stackItem => stackItem.versions.length === 0);

    return stacks;
  }
}
