import React from 'react';
import { Layout, Menu } from 'antd';
import { useRouter } from 'next/router';
import { menu } from './menu';
import styles from './Container.module.scss';

const { Sider, Content } = Layout;

const Container = ({ children }) => {
  const router = useRouter();
  const { asPath } = router;
  const defaultOpenKey = asPath.substring(0, asPath.lastIndexOf('/'));

  return (
    <Layout className={styles.container}>
      <Sider className={styles.sider}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[asPath]}
          defaultOpenKeys={[defaultOpenKey]}
          items={menu}
        />
      </Sider>
      <Content className={styles.content}>{children}</Content>
    </Layout>
  );
};

export default Container;
