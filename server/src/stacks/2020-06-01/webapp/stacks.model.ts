// NOTE (allisonm): Any change to existing properties requires a new API version!

import { CommonSettings, Os, AppInsightsSettings, GitHubActionSettings } from '../stacks.model';

export interface WebAppStack<T extends WebAppRuntimes | JavaContainers> {
  displayText: string;
  value: string;
  majorVersions: WebAppMajorVersion<T>[];
  preferredOs?: Os;
}

export interface WebAppMajorVersion<T> {
  displayText: string;
  value: string;
  minorVersions: WebAppMinorVersion<T>[];
}

export interface WebAppMinorVersion<T> {
  displayText: string;
  value: string;
  stackSettings: T;
}

export interface WebAppRuntimes {
  linuxRuntimeSettings?: WebAppRuntimeSettings;
  windowsRuntimeSettings?: WebAppRuntimeSettings;
}

export interface WebAppRuntimeSettings extends CommonSettings {
  runtimeVersion: string;
  remoteDebuggingSupported: boolean;
  appInsightsSettings: AppInsightsSettings;
  gitHubActionSettings: GitHubActionSettings;
}

export interface JavaContainers {
  linuxContainerSettings?: LinuxJavaContainerSettings;
  windowsContainerSettings?: WindowsJavaContainerSettings;
}

export interface WindowsJavaContainerSettings extends CommonSettings {
  javaContainer: string;
  javaContainerVersion: string;
}

export interface LinuxJavaContainerSettings extends CommonSettings {
  java11Runtime?: string;
  java8Runtime?: string;
}
