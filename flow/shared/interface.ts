export enum Operation {
  GOTO = 'goto',
  Click = 'click',
  Focus = 'focus',
  Type = 'type',
  WaitForResponse = 'waitForResponse',
}

export interface Step {
  type: Operation;
  url?: string;
  selector?: string;
  typeData?: string;
  requestUrlRegExp?: string;
}

export interface Simulator {
  testMode: boolean;
  search: boolean;
  steps: Step[];
}
