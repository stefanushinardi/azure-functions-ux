import { FunctionAppStack } from '../../models/FunctionAppStackModel';
import { getDateString } from '../date-utilities';

const getPythonStack: (useIsoDateFormat: boolean) => FunctionAppStack = (useIsoDateFormat: boolean) => {
  const python2EOL = getDateString(new Date(2020, 1, 1), useIsoDateFormat);
  const python3point6EOL = getDateString(new Date(2021, 12, 23), useIsoDateFormat);
  const python3point7EOL = getDateString(new Date(2023, 6, 27), useIsoDateFormat);
  const python3point8EOL = getDateString(new Date(2024, 10, 14), useIsoDateFormat);
  const python3point9EOL = getDateString(new Date(2025, 10, 5), useIsoDateFormat);

  return {
    displayText: 'Python',
    value: 'python',
    preferredOs: 'linux',
    majorVersions: [
      {
        displayText: 'Python 3',
        value: '3',
        minorVersions: [
          {
            displayText: 'Python 3.9',
            value: '3.9',
            stackSettings: {
              linuxRuntimeSettings: {
                runtimeVersion: 'Python|3.9',
                remoteDebuggingSupported: false,
                isPreview: false,
                isDefault: false,
                appInsightsSettings: {
                  isSupported: true,
                },
                gitHubActionSettings: {
                  isSupported: true,
                  supportedVersion: '3.9',
                },
                appSettingsDictionary: {
                  FUNCTIONS_WORKER_RUNTIME: 'python',
                },
                siteConfigPropertiesDictionary: {
                  use32BitWorkerProcess: false,
                  linuxFxVersion: 'Python|3.9',
                },
                supportedFunctionsExtensionVersions: ['~4', '~3'],
                endOfLifeDate: python3point9EOL,
              },
            },
          },
          {
            displayText: 'Python 3.8',
            value: '3.8',
            stackSettings: {
              linuxRuntimeSettings: {
                runtimeVersion: 'Python|3.8',
                remoteDebuggingSupported: false,
                appInsightsSettings: {
                  isSupported: true,
                },
                gitHubActionSettings: {
                  isSupported: true,
                  supportedVersion: '3.8',
                },
                appSettingsDictionary: {
                  FUNCTIONS_WORKER_RUNTIME: 'python',
                },
                siteConfigPropertiesDictionary: {
                  use32BitWorkerProcess: false,
                  linuxFxVersion: 'Python|3.8',
                },
                supportedFunctionsExtensionVersions: ['~4', '~3'],
                endOfLifeDate: python3point8EOL,
              },
            },
          },
          {
            displayText: 'Python 3.7',
            value: '3.7',
            stackSettings: {
              linuxRuntimeSettings: {
                runtimeVersion: 'Python|3.7',
                remoteDebuggingSupported: false,
                appInsightsSettings: {
                  isSupported: true,
                },
                gitHubActionSettings: {
                  isSupported: true,
                  supportedVersion: '3.7',
                },
                appSettingsDictionary: {
                  FUNCTIONS_WORKER_RUNTIME: 'python',
                },
                siteConfigPropertiesDictionary: {
                  use32BitWorkerProcess: false,
                  linuxFxVersion: 'Python|3.7',
                },
                supportedFunctionsExtensionVersions: ['~4', '~3', '~2'],
                endOfLifeDate: python3point7EOL,
              },
            },
          },
          {
            displayText: 'Python 3.6',
            value: '3.6',
            stackSettings: {
              linuxRuntimeSettings: {
                runtimeVersion: 'Python|3.6',
                isDeprecated: true,
                remoteDebuggingSupported: false,
                appInsightsSettings: {
                  isSupported: true,
                },
                gitHubActionSettings: {
                  isSupported: true,
                  supportedVersion: '3.6',
                },
                appSettingsDictionary: {
                  FUNCTIONS_WORKER_RUNTIME: 'python',
                },
                siteConfigPropertiesDictionary: {
                  use32BitWorkerProcess: false,
                  linuxFxVersion: 'Python|3.6',
                },
                supportedFunctionsExtensionVersions: ['~2', '~3'],
                endOfLifeDate: python3point6EOL,
              },
            },
          },
        ],
      },
    ],
  };
};

export const pythonStackNonIsoDates: FunctionAppStack = getPythonStack(false);

export const pythonStack: FunctionAppStack = getPythonStack(true);
