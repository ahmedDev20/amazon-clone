import axios from 'axios';
import * as config from './config.json';

const instance = axios.create({
  //The Cloud function URL
  baseURL: config.axiosBaseAPI,
});

export default instance;
