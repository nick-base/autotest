import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Spin, Button, Select as AntdSelect, message } from 'antd';
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
import { formValuesSelecter, setFormValues } from '@/shared/store/slice.global';
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

const FLowSettings = () => {
  const formValues = useAppSelector(formValuesSelecter);
  const dispatch = useAppDispatch();
  const { list, updateList } = useList();
  const [selectId, setSelectId] = useState('');
  const [current, setCurrent] = useState({ id: null });

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

  const execute = async (testMode = false) => {
    form.validate().then(() => {
      const data = {
        ...form.values,
        testMode,
      };
      fetch('/api/simulator/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          const { status } = res;
          if (status === 404) {
            message.error('纯净模式不支持该操作！');
          }
        })
        .catch((res) => {
          message.error(res);
        });
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
      <div>配置</div>
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

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Card title={title} style={{ width: '100%' }}>
        <Spin spinning={false}>
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
              <Submit block size="large" onClick={() => execute(true)}>
                测试
              </Submit>
              |
              <Submit block size="large" onClick={() => execute(false)}>
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
      </Card>
    </div>
  );
};

export default FLowSettings;
