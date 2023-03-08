import { FEMALE_NAMES } from './constants/femaleName';
import { MALE_NAMES } from './constants/maleName';
import { FAMILY_NAMES } from './constants/familyName';
import { ARERS } from './constants/areas';
import { random } from '../utils';

const ID_NUMBER_15_REGEX = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;

const ID_NUMBER_18_REGEX =
  /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

const isLeap = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const padding = (num: number) => `${num <= 9 ? '0' : ''}${num}`;

const areakeys = Object.keys(ARERS);

export const randomArea = () => areakeys[random(0, areakeys.length - 1)];

const randomDay = (year: number, month: number) => {
  if (month === 2) {
    return random(1, isLeap(year) ? 29 : 28);
  } else if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
    return random(1, 31);
  } else {
    return random(1, 30);
  }
};

export interface IdNumberParams {
  year?: number;
  month?: number;
  day?: number;
  sex?: 1 | 0;
  area?: string;
}

export class IdNumber {
  idNumber: string;
  areaId: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;

  constructor(idNumber: string) {
    this.idNumber = idNumber;
    this.areaId = idNumber.substring(0, 6);
    this.birthYear = idNumber.substring(6, 10);
    this.birthMonth = idNumber.substring(10, 12);
    this.birthDay = idNumber.substring(12, 14);
  }

  get areaName(): string {
    return ARERS[this.areaId];
  }

  get birthday(): string {
    return `${this.birthYear}-${this.birthMonth}-${this.birthDay}`;
  }

  get age(): number {
    const now = new Date();
    const [ny, nm, nd] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
    const [y, m, d] = [this.birthYear, this.birthMonth, this.birthDay].map((item) => Number(item));

    if (ny === y) return 0;

    if (nm !== m) return ny - y - (nm - m < 0 ? 1 : 0);

    return ny - y - (nd - d < 0 ? 1 : 0);
  }

  get sex(): number {
    return Number(this.idNumber.substring(16, 17)) % 2;
  }

  get checkDigit() {
    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');

    var cardTemp = 0;
    for (let i = 0; i < 17; i++) {
      cardTemp += Number(this.idNumber[i]) * arrInt[i];
    }
    return arrCh[cardTemp % 11];
  }

  static verifyId(idNumber) {
    if (ID_NUMBER_18_REGEX.test(idNumber)) {
      return new IdNumber(idNumber).checkDigit === idNumber[17];
    } else {
      return ID_NUMBER_15_REGEX.test(idNumber);
    }
  }

  static generate(params: IdNumberParams = {}) {
    const {
      year = random(1960, 2021),
      month = random(1, 12),
      day = randomDay(year, month),
      sex = random(0, 1),
      area = randomArea(),
    } = params;

    const sexItem = ((random(0, 10) * 2) % 10) + sex;
    const idNumber = `${area}${year}${padding(month)}${padding(day)}${random(10, 99)}${sexItem}`;
    return idNumber + new IdNumber(idNumber).checkDigit;
  }
}

export const nameUtils = {
  familyName() {
    return FAMILY_NAMES[random(0, FAMILY_NAMES.length - 1)];
  },
  femaleName(familyName?: string) {
    const name = FEMALE_NAMES[random(0, FEMALE_NAMES.length - 1)];
    return `${familyName || nameUtils.familyName()}${name}`;
  },
  maleName(familyName?: string) {
    const name = MALE_NAMES[random(0, MALE_NAMES.length - 1)];
    return `${familyName || nameUtils.familyName()}${name}`;
  },
};
