import { IdNumber, randomArea, nameUtils, IdNumberParams } from './core';
import { random } from '../utils';

const genMember = (relation: string, params?: IdNumberParams, familyName?: string) => {
  const idNumber = IdNumber.generate(params);
  const instance = new IdNumber(idNumber);

  return {
    certNo: idNumber,
    area: instance.areaName,
    age: instance.age,
    birthday: instance.birthday,
    sex: instance.sex,
    name: (instance.sex % 2 === 0 ? nameUtils.femaleName : nameUtils.maleName)(familyName),
    relation,
  };
};

export const genMembers = () => {
  const date = new Date();
  const nowYear = date.getFullYear();
  const nowMonth = date.getMonth() + 1;
  const arr: any[] = Array.from({ length: 5 }).fill(1);

  const familyName = nameUtils.familyName();
  const area = randomArea();

  return {
    self: arr.map(() => genMember('self', { year: random(nowYear - 37, nowYear - 27), sex: 1, area }, familyName)),
    spouse: arr.map(() => genMember('spouse', { year: random(nowYear - 37, nowYear - 27), sex: 0 })),
    father: arr.map(() => genMember('parent', { year: nowYear - 37 - random(17, 25), sex: 1, area }, familyName)),
    mother: arr.map(() => genMember('parent', { year: nowYear - 37 - random(17, 25), sex: 0 })),
    son: arr.map(() => genMember('children', { year: nowYear - 27 + random(17, 25), sex: 1, area }, familyName)),
    daughter: arr.map(() => genMember('children', { year: nowYear - 27 + random(17, 25), sex: 0, area }, familyName)),
    days30: [
      ...arr.map(() =>
        genMember(
          'children',
          { year: nowYear, month: nowMonth, day: random(1, date.getDate()), sex: 0, area },
          familyName
        )
      ),
      ...arr.map(() =>
        genMember(
          'children',
          { year: nowYear, month: nowMonth, day: random(1, date.getDate()), sex: 1, area },
          familyName
        )
      ),
    ],
    old: [51, 56, 59, 61, 66, 69, 71, 76, 79, 81, 86, 89, 91].flatMap((age) => [
      genMember('parent', { year: nowYear - age, sex: 1, area }, familyName),
      genMember('parent', { year: nowYear - age, sex: 0 }),
    ]),
  };
};
