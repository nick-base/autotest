import configDev from './config.dev';
import configPrd from './config.prd';

const config = process.env.NODE_ENV === 'production' ? configPrd : configDev;

export default config;
