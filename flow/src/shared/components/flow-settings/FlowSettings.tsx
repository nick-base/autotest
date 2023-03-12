import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Spin, Button, Select as AntdSelect, message, Divider } from 'antd';
import { createForm, onFormInputChange, onFormValuesChange, onFormInitialValuesChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  Form,
  FormItem,
  FormLayout,
  FormTab,
  FormStep,
  Input,
  Select,
  Cascader,
  DatePicker,
  Submit,
  FormGrid,
  ArrayItems,
  Editable,
  FormButtonGroup,
} from '@/components/formily-antd';
import {
  formValuesSelecter,
  setFormValues,
  cacheNodeListSelecter,
  setCacheNodeList,
} from '@/shared/store/slice.global';
import { useAppSelector, useAppDispatch } from '@/shared/store';
import { schema } from './schema';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    DatePicker,
    Cascader,
    Select,
    ArrayItems,
    Editable,
    FormTab,
    FormStep,
  },
});

const useList = () => {
  const [list, setList] = useState([]);

  const updateList = useCallback(() => {
    fetch('/api/simulator/list')
      .then((response) => response.json())
      .then((response) => {
        setList(response.data);
      });
  }, []);

  useEffect(() => {
    updateList();
  }, []);

  return { list, updateList };
};

const tabList = [
  {
    key: 'tab1',
    tab: '配置',
  },
  {
    key: 'tab2',
    tab: '关键节点',
  },
  {
    key: 'tab3',
    tab: '执行结论',
  }
];

const FLowSettings = () => {
  const formValues = useAppSelector(formValuesSelecter);
  const nodeList = useAppSelector(cacheNodeListSelecter);
  const dispatch = useAppDispatch();
  const { list, updateList } = useList();
  const [selectId, setSelectId] = useState('');
  const [current, setCurrent] = useState({ id: null });
  const [loading, setLoading] = useState<{ search?: boolean }>({});
  const [activeTabKey, setActiveTabKey] = useState<string>('tab1');
  const [executeResult, setExecuteResult] = useState<any>({});

  const displayList = useMemo(() => {
    return list.map((item) => ({
      value: item?.id,
      label: item?.name,
    }));
  }, [list]);

  const form = useMemo(() => {
    setCurrent(formValues);
    setSelectId(formValues?.id);

    return createForm({
      validateFirst: true,
      initialValues: formValues,
      effects() {
        onFormInputChange((form) => {
          const data = JSON.parse(JSON.stringify(form.values));
          dispatch(setFormValues(data));
        });
        onFormInitialValuesChange((form) => {});
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues === null]);

  const execute = async ({ testMode, search }: { testMode?: boolean; search?: boolean }) => {
    form
      .validate()
      .then(() => {
        search && setLoading((pre) => ({ ...pre, search: true }));

        const data = {
          ...form.values,
          testMode,
          search,
        };
        fetch('/api/simulator/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then(async (res) => {
            const { status } = res;
            if (status === 404) {
              message.error('纯净模式不支持该操作！');
            }
            const { result = {} } = await res.json();
            setExecuteResult(result);

            if (search) {
              const { searchData = [] } = result;
              dispatch(setCacheNodeList(searchData));
              setActiveTabKey('tab2');
            } else {
              setActiveTabKey('tab3');
            }
          })
          .catch((res) => {
            message.error(res);
          });
      })
      .finally(() => {
        setLoading((pre) => ({ ...pre, search: false }));
      });
  };

  const save = (add = false) => {
    form.validate().then(() => {
      const data = { ...form.values };
      if (add) {
        delete data.id;
      }
      fetch('/api/simulator/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((response) => {
          form.setValues(response.data);
          setCurrent(response.data);
          setSelectId(response.data.id);
          updateList();
        });
    });
  };

  const apply = () => {
    if (!selectId) return;
    const item = list.find((item) => item.id === selectId);

    if (!item) return;
    const data = JSON.parse(JSON.stringify(item));
    form.setValues(data);
    setCurrent(data);
    setSelectId(data.id);
  };

  const title = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <AntdSelect
        onChange={(id) => setSelectId(id)}
        onClear={() => {
          const data = { ...(form.values || {}) };
          delete data.id;
          form.setValues(data);
          setCurrent(data);
        }}
        value={selectId}
        showSearch
        allowClear
        style={{ width: '200px', margin: '0 20px' }}
        placeholder="配置搜素"
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
        options={displayList}
      />
      <Button onClick={apply}>应用</Button>
    </div>
  );

  const contentList: Record<string, React.ReactNode> = {
    tab1: (
      <Spin spinning={false}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 25 }}>
          <AntdSelect
            onChange={(id) => setSelectId(id)}
            onClear={() => {
              const data = { ...(form.values || {}) };
              delete data.id;
              form.setValues(data);
              setCurrent(data);
            }}
            value={selectId}
            showSearch
            allowClear
            style={{ width: '200px', margin: '0 20px' }}
            placeholder="配置搜素"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={displayList}
          />
          <Button onClick={apply}>应用</Button>
        </div>
        <Form form={form} labelCol={5} wrapperCol={16} onAutoSubmit={console.log}>
          <SchemaField schema={schema} />
          <FormButtonGroup.FormItem>
            <Submit block size="large" onClick={() => save(true)}>
              另存为
            </Submit>
            |
            <Submit block size="large" onClick={() => save(false)}>
              保存
            </Submit>
            |
            <Submit loading={loading.search} block size="large" onClick={() => execute({ search: true })}>
              节点查找
            </Submit>
            |
            <Submit block size="large" onClick={() => execute({ testMode: true })}>
              测试
            </Submit>
            |
            <Submit block size="large" onClick={() => execute({ testMode: false })}>
              执行
            </Submit>
            {/* {current?.id && (
              <Submit danger block size="large" onClick={() => {}}>
                删除
              </Submit>
            )} */}
          </FormButtonGroup.FormItem>
        </Form>
      </Spin>
    ),
    tab2: (
      <div>
        <div>
          <Button
            onClick={() => {
              dispatch(setCacheNodeList([]));
            }}>
            清除缓存
          </Button>
        </div>
        <div style={{ lineHeight: '35px', height: '75vh', overflow: 'auto', marginTop: 20 }}>
          {nodeList &&
            nodeList.map((nodeItem, index) => {
              const id = `${nodeItem}-${index}`;
              return (
                <div key={index} style={{ display: 'flex' }}>
                  <div style={{ marginRight: 20 }}>
                    <Button
                      onClick={() => {
                        window.getSelection().selectAllChildren(document.getElementById(id));
                        document.execCommand('copy');
                        window.getSelection().removeAllRanges();
                        message.success(`复制成功 ${nodeItem}`);
                      }}
                      type="primary"
                      size="small">
                      复制
                    </Button>
                  </div>
                  <div id={id}>{nodeItem}</div>
                </div>
              );
            })}
        </div>
      </div>
    ),
    tab3: (
      <div
        style={{ whiteSpace: 'pre' }}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(executeResult, null, 2),
        }}
      />
    ),
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Card
        title={null}
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={(key) => {
          setActiveTabKey(key);
        }}
        style={{ width: '100%' }}>
        {contentList[activeTabKey]}
      </Card>
    </div>
  );
};

export default FLowSettings;
