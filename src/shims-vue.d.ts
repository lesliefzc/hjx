import { Toast } from "vant";
import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import { iteratee } from "lodash";
import echarts from 'echarts'
// declare module '*.vue' {
//   import Vue from 'vue'
//   export default Vue
// }
declare module "vue/types/vue"{
  interface Vue{
    $https:any,
    $toast:Toast,
    $router: VueRouter
  }
}
declare global {
  interface Window{
    g: any
  }
}
