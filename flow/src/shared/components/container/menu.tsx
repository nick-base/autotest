import React from 'react';
import Link from 'next/link';

interface MenuItemParams {
  key?: string;
  path: string;
  label: string;
  children?: any[];
}

const MenuItem = ({ key, path, label, children }: MenuItemParams) => ({
  key: key || path,
  path,
  label: children?.length > 0 ? label : <Link href={path}>{label}</Link>,
  children,
});

export const menu = [
  MenuItem({
    path: '',
    label: '工具',
    children: [
      MenuItem({
        path: '/',
        label: '身份证号批量生成',
      }),
    ],
  }),
];
