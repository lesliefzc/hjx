import axios,{AxiosInstance,AxiosRequestConfig,AxiosResponse} from 'axios'
import VueRouter, { Route } from "vue-router";
import Vue from 'vue'
import {Toast} from 'vant'
import router from '@/router';
import qs from 'qs'
Vue.use(Toast)

export interface ResopnseData {
    code: number;
    data?: any;
    message: string;
}
let service: AxiosInstance | any;
service = axios.create({
    baseURL: window.g.baseURL,
    timeout: 30000,
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    withCredentials:true,
    transformRequest:[
        data=>{
            return qs.stringify(data)
        }
    ]
})

service.interceptors.request.use(
    (config:AxiosRequestConfig)=>{
        let token =window.localStorage.getItem('token')
        if(token) {
            config.headers.common['TOKEN'] = token
        }
        return config;
    },
    (error: any)=>{
        console.error("error",error);
        Promise.reject(error);
    }

)
service.interceptors.response.use(
    (res:AxiosResponse)=>{
        if(res.status === 200){
            const data : any = res.data;
            if(data.code === 200){
                return data;
            }else if( data.code === 401){
                Toast.fail(data.msg);
                setTimeout(() => {
                    router.push({
                        path: '/login'
                    })
                }, 1000);
            }else{
                Toast.fail(data.msg);
                return data
            }
        }else{
            Toast.fail("网络错误")
            return Promise.reject(new Error(res.data.message || "Error"))
        }
    },
    (error: any) => {
        Toast.fail("网络错误")
        return Promise.reject(error)
    }
);

export default service;