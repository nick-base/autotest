export enum Operation {
  Start = 'start',
  End = 'end',
  GOTO = 'goto',
  Click = 'click',
  Focus = 'focus',
  Type = 'type',
  TypeName = 'typeName',
  TypeCertNo = 'typeCertNo',
  WaitForResponse = 'waitForResponse',
}

export interface Step {
  type: Operation;
  url?: string;
  selector?: string;
  typeData?: string;
  requestUrlRegExp?: string;
  relation: 'self' | 'spouse' | 'father' | 'mother' | 'son' | 'daughter';
}

export interface Simulator {
  testMode: boolean;
  search: boolean;
  steps: Step[];
}
