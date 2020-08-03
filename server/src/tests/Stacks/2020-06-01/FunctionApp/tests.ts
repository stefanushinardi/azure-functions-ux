import { StacksService20200601 } from '../../../../stacks/2020-06-01/stacks.service';
import { Os } from '../../../../stacks/2020-06-01/stacks.model';
import {
  validateAllStackLength,
  validateWindowsStacks,
  validateLinuxStacks,
  validateNotHiddenStacks,
  validateDotnetCoreInStacks,
  validateNodeInStacks,
  validatePythonInStacks,
  validateJavaInStacks,
  validatePowershellInStacks,
  validateDotnetFrameworkInStacks,
  validateCustomInStacks,
  validateDotnetCoreFilter,
  validateNodeStackFilter,
  validatePythonStackFilter,
  validateJavaStackFilter,
  validatePowershellStackFilter,
  validateDotnetFrameworkStackFilter,
  validateCustomStackFilter,
} from './validations';

const stacksService = new StacksService20200601();

describe('FunctionApp Stacks Test 2020-06-01', () => {
  // Test length of all stacks
  describe('Test all stack length', () => {
    it('should validate all stacks are returned', done => {
      const stacks = stacksService.getFunctionAppStacks();
      validateAllStackLength(stacks);
      done();
    });
  });

  // Test length of windows stacks
  describe('Test windows stack length', () => {
    it('should validate all stacks with windows are returned', done => {
      const stacks = stacksService.getFunctionAppStacks(Os.windows);
      validateWindowsStacks(stacks);
      done();
    });
  });

  // Test length of linux stacks
  describe('Test linux stack length', () => {
    it('should validate all stacks with linux are returned', done => {
      const stacks = stacksService.getFunctionAppStacks(Os.linux);
      validateLinuxStacks(stacks);
      done();
    });
  });

  // Test length of not hidden stacks
  describe('Test remove hidden stack length', () => {
    it('should validate no stacks with hidden are returned', done => {
      const stacks = stacksService.getFunctionAppStacks(undefined, undefined, true);
      validateNotHiddenStacks(stacks);
      done();
    });
  });

  // Test .NET Core stack
  describe('Test the .NET Core stack', () => {
    it('should validate the .NET Core stack', done => {
      const stacks = stacksService.getFunctionAppStacks();
      validateDotnetCoreInStacks(stacks);
      done();
    });
  });

  // Test .NET Core stack filter
  describe('Test the .NET Core stack filter', () => {
    it('should validate the .NET Core stack filter', done => {
      const stacks = stacksService.getFunctionAppStacks(undefined, 'dotnetCore');
      validateDotnetCoreFilter(stacks);
      done();
    });
  });

  // Test Node stack
  describe('Test the Node.js stack', () => {
    it('should validate the Node.js stack', done => {
      const stacks = stacksService.getFunctionAppStacks();
      validateNodeInStacks(stacks);
      done();
    });
  });

  // Test Node stack filter
  describe('Test the Node.js stack filter', () => {
    it('should validate the Node.js stack filter', done => {
      const stacks = stacksService.getFunctionAppStacks(undefined, 'node');
      validateNodeStackFilter(stacks);
      done();
    });
  });

  // Test Python stack
  describe('Test the Python stack', () => {
    it('should validate the Python stack', done => {
      const stacks = stacksService.getFunctionAppStacks();
      validatePythonInStacks(stacks);
      done();
    });
  });

  // Test Python stack filter
  describe('Test the Python stack filter', () => {
    it('should validate the Python stack filter', done => {
      const stacks = stacksService.getFunctionAppStacks(undefined, 'python');
      validatePythonStackFilter(stacks);
      done();
    });
  });

  // Test Java stack
  describe('Test the Java stack', () => {
    it('should validate the Java stack', done => {
      const stacks = stacksService.getFunctionAppStacks();
      validateJavaInStacks(stacks);
      done();
    });
  });

  // Test Java stack filter
  describe('Test the Java stack filter', () => {
    it('should validate the Java stack filter', done => {
      const stacks = stacksService.getFunctionAppStacks(undefined, 'java');
      validateJavaStackFilter(stacks);
      done();
    });
  });

  // Test PowerShell stack
  describe('Test the PowerShell stack', () => {
    it('should validate the PowerShell stack', done => {
      const stacks = stacksService.getFunctionAppStacks();
      validatePowershellInStacks(stacks);
      done();
    });
  });

  // Test PowerShell stack filter
  describe('Test the PowerShell stack filter', () => {
    it('should validate the PowerShell stack filter', done => {
      const stacks = stacksService.getFunctionAppStacks(undefined, 'powershell');
      validatePowershellStackFilter(stacks);
      done();
    });
  });

  // Test .NET Framework stack
  describe('Test the .NET Framework stack', () => {
    it('should validate the .NET Framework stack', done => {
      const stacks = stacksService.getFunctionAppStacks();
      validateDotnetFrameworkInStacks(stacks);
      done();
    });
  });

  // Test .NET Framework stack filter
  describe('Test the .NET Framework stack filter', () => {
    it('should validate the .NET Framework stack', done => {
      const stacks = stacksService.getFunctionAppStacks(undefined, 'dotnetFramework');
      validateDotnetFrameworkStackFilter(stacks);
      done();
    });
  });

  // Test Custom stack
  describe('Test the Custom stack', () => {
    it('should validate the Custom stack', done => {
      const stacks = stacksService.getFunctionAppStacks();
      validateCustomInStacks(stacks);
      done();
    });
  });

  // Test Custom stack filter
  describe('Test the Custom stack filter', () => {
    it('should validate the Custom stack filter', done => {
      const stacks = stacksService.getFunctionAppStacks(undefined, 'custom');
      validateCustomStackFilter(stacks);
      done();
    });
  });
});
