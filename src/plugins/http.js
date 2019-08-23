import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
    axios.defaults.baseURL = 'http://3.112.132.86:8878/api/private/v1/'

    
    // 添加请求拦截器
    axios.interceptors.request.use(function (config) {
       
        if (config.url !== 'login') {
            //获取token   统一设置拦截器，除了登录都会设置请求头
            const AUTH_TOKEN = sessionStorage.getItem("token");
            //使用axios文档中的携带请求头key和token value发送请求
            config.headers["Authorization"] = AUTH_TOKEN;
        }

         // 在发送请求之前做些什么
         return config
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 添加响应拦截器
    axios.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        return response;
    }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });



    Vue.prototype.$http = axios
}

export default MyHttpServer