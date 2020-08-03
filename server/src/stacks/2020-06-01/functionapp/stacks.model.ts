import { CommonSettings, Os, AppInsightsSettings, GitHubActionSettings } from '../stacks.model';

export type StackValue = 'dotnetCore' | 'dotnetFramework' | 'java' | 'node' | 'powershell' | 'python' | 'custom';

type FunctionsExtensionVersion = '~1' | '~2' | '~3';
type FunctionsWorkerRuntime = 'dotnet' | 'node' | 'python' | 'java' | 'powershell' | 'custom';

export interface FunctionAppStack {
  displayText: string;
  value: StackValue;
  majorVersions: FunctionAppMajorVersion[];
  preferredOs?: Os;
}

export interface FunctionAppMajorVersion {
  displayText: string;
  value: string;
  minorVersions: FunctionAppMinorVersion[];
}

export interface FunctionAppMinorVersion {
  displayText: string;
  value: string;
  stackSettings: FunctionAppRuntimes;
}

export interface FunctionAppRuntimes {
  linuxRuntimeSettings?: FunctionAppRuntimeSettings;
  windowsRuntimeSettings?: FunctionAppRuntimeSettings;
}

export interface FunctionAppRuntimeSettings extends CommonSettings {
  runtimeVersion: string;
  remoteDebuggingSupported: boolean;
  appInsightsSettings: AppInsightsSettings;
  gitHubActionSettings: GitHubActionSettings;
  appSettingsDictionary: AppSettingsDictionary;
  siteConfigPropertiesDictionary: SiteConfigPropertiesDictionary;
  supportedFunctionsExtensionVersions: FunctionsExtensionVersion[];
}

export interface AppSettingsDictionary {
  FUNCTIONS_WORKER_RUNTIME?: FunctionsWorkerRuntime;
  WEBSITE_NODE_DEFAULT_VERSION?: string;
}

export interface SiteConfigPropertiesDictionary {
  use32BitWorkerProcess: boolean;
  linuxFxVersion?: string;
  javaVersion?: string;
  powerShellVersion?: string;
}
