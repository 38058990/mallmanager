import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
    axios.defaults.baseURL = 'http://3.112.132.86:8878/api/private/v1/'
    Vue.prototype.$http = axios
}

export default MyHttpServer