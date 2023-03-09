import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Spin, message } from 'antd';
import { createForm, onFormInputChange } from '@formily/core';
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

const FLowSettings = () => {
  const formValues = useAppSelector(formValuesSelecter);
  const dispatch = useAppDispatch();

  const form = useMemo(() => {
    return createForm({
      validateFirst: true,
      initialValues: formValues,
      effects() {
        onFormInputChange((form) => {
          const data = JSON.parse(JSON.stringify(form.values));
          console.info(data);
          dispatch(setFormValues(data));
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues === null]);

  const execute = () => {
    fetch('/api/simulator/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.values),
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
  };

  const save = () => {
    const data = {
      data: form.values,
      id: null,
    };
    fetch('/api/simulator/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Card title="配置" style={{ width: '100%' }}>
        <Spin spinning={false}>
          <Form form={form} labelCol={5} wrapperCol={16} onAutoSubmit={console.log}>
            <SchemaField schema={schema} />
            <FormButtonGroup.FormItem>
              <Submit block size="large" onClick={save}>
                保存
              </Submit>
              <Submit block size="large" onClick={execute}>
                执行
              </Submit>
            </FormButtonGroup.FormItem>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default FLowSettings;
