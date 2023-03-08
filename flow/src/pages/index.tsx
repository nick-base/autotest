import styles from '../styles/index.module.scss';
import FlowSettings from '@/shared/components/flow-settings';

const IndexPage = ({ data: propsData = {} }) => {
  return (
    <div className={styles.page}>
      <div className={styles.frame}>
        <iframe src="https://cn.bing.com/" name="iframe-1"></iframe>
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
