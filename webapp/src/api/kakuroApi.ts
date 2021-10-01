import axios from 'axios';

const kakuroApi = axios.create({
  baseURL: process.env.REACT_APP_KAKURO_API_ENDPOINT || 'http://192.168.168.4:5000'
});

export default kakuroApi;
