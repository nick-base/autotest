import { Row, Button, Switch, Radio, Checkbox, Space, message, RadioChangeEvent } from 'antd';
import React, { useEffect, useState } from 'react';
import { showDetailSelecter, setShowDetail } from '@/shared/store/slice.global';
import { useAppSelector, useAppDispatch } from '@/shared/store';
import styles from './members.module.scss';

type Relation = 'self' | 'spouse' | 'children' | 'parent';

interface DataItem {
  name: string;
  certNo: string;
  age: number;
  birthday: string;
  area: string;
  relation: Relation;
}

export interface Data {
  self: DataItem[];
  spouse: DataItem[];
  father: DataItem[];
  mother: DataItem[];
  son: DataItem[];
  daughter: DataItem[];
  old: DataItem[];
  days30: DataItem[];
}

interface ItemProps {
  group: string;
  list: DataItem[];
  isSelf?: boolean;
  holder?: DataItem;
  setHolder?: Function;
  showDetail?: boolean;
}

const genCode = ({ holder, insured }: { holder: DataItem; insured: DataItem[] }) => {
  const relations = {
    self: 1,
    spouse: 2,
    children: 3,
    parent: 4,
  };

  const policyHolder = holder
    ? {
        name: holder.name,
        certNo: holder.certNo,
        certType: 'I',
        phone: '',
        smsCode: '888888',
      }
    : {};

  const insuredList = insured.map((item) => {
    return {
      certType: 'I',
      hasHealthInform: 1,
      hasSocialInsurance: 'Y',
      relationToPH: relations[item.relation],
      name: item.name,
      certNo: item.certNo,
    };
  });

  return `function update() {
  const query = Object.fromEntries(new URLSearchParams(window.location.search.slice(1)));
  const key = \`__storejs_template_browser_\${query.goodsCode}_\${query.version}__value\`;
  const data = JSON.parse(sessionStorage.getItem(key));

  const newData = {
      ...data,
      insuredList: ${JSON.stringify(insuredList)},
  };
  if (Object.keys(${JSON.stringify(policyHolder)}).length > 0) {
    newData['policyHolder'] = ${JSON.stringify(policyHolder)};
  }
  sessionStorage.setItem(key, JSON.stringify(newData));
  window.location.reload();
}
update();
`;
};

const genCode2 = ({ holder, insured }: { holder: DataItem; insured: DataItem[] }) => {
  const policyHolder = holder
    ? {
        name: holder.name,
        certNo: holder.certNo,
        certType: 'I',
        phoneNo: '',
        validateCode: '123456',
      }
    : {};

  const insuredList = insured.map((item) => {
    return {
      holderRelation: item.relation,
      person: {
        certType: 'I',
        hasSocialInsurance: 'D',
        name: item.name,
        certNo: item.certNo,
      },
    };
  });

  return `function update() {
  const query = Object.fromEntries(new URLSearchParams(window.location.search.slice(1)));
  const key = \`__storejs_template_browser_\${query.insureConfigId}_\${query.goodsId}__persist:value\`;
  const data = JSON.parse(localStorage.getItem(key));

  const newData = {
      ...data,
      insuredList: ${JSON.stringify(insuredList)},
  };
  if (Object.keys(${JSON.stringify(policyHolder)}).length > 0) {
    newData['holder'] = ${JSON.stringify({ person: holder })};
  }
  localStorage.setItem(key, JSON.stringify(newData));
  window.location.reload();
}
update();
`;
};

const Item: React.FC<ItemProps> = ({ group, list = [], isSelf, holder, setHolder, showDetail }) => {
  const copy = (id) => {
    window.getSelection().selectAllChildren(document.querySelector(`#id-${id}`));
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    message.success('已复制至粘贴板');
  };

  const ontHolderChange = (e: RadioChangeEvent) => {
    setHolder && setHolder(e.target.value);
  };

  return (
    <div className={styles.member}>
      <div className={styles.title}>{group}</div>
      <div>
        <table>
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <td style={{ width: '80px' }}>{item.name}</td>
                <td style={{ width: '40px' }}>{item.age}岁</td>
                <td style={{ width: '180px' }}>
                  <span id={`id-${item.certNo}`}>{item.certNo}</span>
                </td>
                <td style={{ width: '230px' }}>
                  <Space>
                    <Button size="small" type="primary" onClick={() => copy(item.certNo)}>
                      复制
                    </Button>
                    {isSelf && (
                      <Radio value={item} onChange={ontHolderChange}>
                        投保人
                      </Radio>
                    )}
                    {(!isSelf || item === holder) && <Checkbox value={item}>被保人</Checkbox>}
                  </Space>
                </td>
                {showDetail && (
                  <>
                    <td style={{ width: '150px' }}>{item.birthday}</td>
                    <td>{item.area}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const list = [
  { key: 'spouse', group: '配偶' },
  { key: 'father', group: '父亲' },
  { key: 'mother', group: '母亲' },
  { key: 'son', group: '儿子' },
  { key: 'daughter', group: '女儿' },
  { key: 'old', group: '高龄' },
  { key: 'days30', group: '不满30天' },
];

const Members: React.FC<{ data?: Data }> = ({ data }) => {
  const [holder, setHolder] = useState<DataItem>();
  const [insured, setInsured] = useState<any[]>([]);
  const [code, setCode] = useState<string>();
  const [code2, setCode2] = useState<string>();

  const showDetail = useAppSelector(showDetailSelecter);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setHolder(null);
    setInsured([]);
  }, [data]);

  useEffect(() => {
    const list = insured?.filter((item: DataItem) => item.relation !== 'self' || item.certNo === holder?.certNo) || [];
    if (list.length !== insured.length) {
      setInsured(list);
    }
  }, [holder]);

  useEffect(() => {
    setCode(genCode({ holder, insured }));
    setCode2(genCode2({ holder, insured }));
  }, [holder, insured]);

  const onShowDetailChange = (checked: boolean) => {
    dispatch(setShowDetail(checked));
  };

  const copyCode = (id) => {
    if (!holder && insured?.length === 0) {
      message.error('投被保人信息为空');
      return;
    }
    window.getSelection().selectAllChildren(document.querySelector(id));
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    message.success('已复制至粘贴板');
  };

  const copyCode3 = () => {
    message.error('功能开发中');
  };

  if (!data) return null;

  return (
    <div className={styles.members}>
      <Space>
        <Switch
          onChange={onShowDetailChange}
          checked={showDetail}
          checkedChildren="显示详情"
          unCheckedChildren="隐藏详情"
        />
        <Button size="small" type="primary" onClick={() => copyCode('#update')}>
          复制代码 [投保H5]
        </Button>
        <Button size="small" type="primary" onClick={() => copyCode('#update2')}>
          复制代码 [商品中心2.0]
        </Button>
        <Button disabled size="small" type="primary" onClick={() => copyCode3()}>
          复制代码 [商品中心2.0] [序列化]
        </Button>
      </Space>
      <Checkbox.Group value={insured} onChange={setInsured} className={styles['checkbox-group']}>
        <Radio.Group value={holder}>
          <Item group="本人" list={data?.self} isSelf showDetail={showDetail} holder={holder} setHolder={setHolder} />
        </Radio.Group>
        {list.map(({ key, group }) => (
          <Row key={key}>
            <Item group={group} list={data[key]} showDetail={showDetail} />
          </Row>
        ))}
      </Checkbox.Group>
      <pre style={{ position: 'absolute', top: '-1000px' }} id="update">
        {code}
      </pre>
      <pre style={{ position: 'absolute', top: '-1000px' }} id="update2">
        {code2}
      </pre>
    </div>
  );
};

export default Members;
