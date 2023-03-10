import styles from '../styles/index.module.scss';
import FlowSettings from '@/shared/components/flow-settings';
import { Input, Button } from 'antd';
import { useEffect, useRef, useState } from 'react';

const DEFAULT_URL = 'https://i-test.zhongan.com/2D5wRH';

const IndexPage = ({ data: propsData = {} }) => {
  const ref = useRef();
  const [url, setUrl] = useState<string>(DEFAULT_URL);

  useEffect(() => {
    ref.current.onload =() => {
      console.log('document', document.getElementById('iframe-1')?.contentDocument);
    };
  }, []);

  return (
    <div className={styles.page}>
      <div>
        <Input.Group compact style={{ margin: '20px 0' }}>
          <Input
            style={{ width: 'calc(100% - 80px)' }}
            defaultValue={DEFAULT_URL}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            type="primary"
            onClick={() => {
              ref.current && (ref.current.src = url);
            }}>
            Go
          </Button>
        </Input.Group>
        <div className={styles.frame}>
          <iframe ref={ref} src={DEFAULT_URL} name="iframe-1" id="iframe-1"></iframe>
        </div>
      </div>
      <div className={styles.form}>
        <FlowSettings />
      </div>
    </div>
  );
};

export default IndexPage;

export async function getServerSideProps() {
  return {
    props: {},
  };
}
