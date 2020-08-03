export enum Os {
  linux = 'linux',
  windows = 'windows',
}

export interface CommonSettings {
  isPreview?: boolean; // Stack should be labeled as 'preview'
  isDeprecated?: boolean; // Stack should be hidden unless user is already running that stack
  isHidden?: boolean; // Stack should be hidden unless a feature flag is used
  endOfLifeDate?: Date; // Stack end of life date
  isAutoUpdate?: boolean; // Stack should be labeled as 'auto-update'
}

export interface AppInsightsSettings {
  isSupported: boolean;
  isDefaultOff?: boolean;
}

export interface GitHubActionSettings {
  isSupported: boolean;
  supportedVersion?: string;
}
