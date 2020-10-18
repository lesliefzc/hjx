import { Component, Mixins,Vue } from 'vue-property-decorator';
const mui  = require('../assets/js/mui')
@Component   //不加这个钩子函数不执行
export default class back extends Vue {
    public back(){
        this.$router.go(-1)
    }
    mounted(){
        let that = this;
        let aa = window.navigator.userAgent;
        if (aa.indexOf("Android") > -1 || aa.indexOf("Adr") > -1) {
        //  plus.key.addEventListener("backbutton",that.backEvent,false);
            mui.back = function() {
                that.back();
            };
        }
    }
    destroyed() {
        let that = this;
        let aa = window.navigator.userAgent;
        if (aa.indexOf("Android") > -1 || aa.indexOf("Adr") > -1) {
            mui.back = null;
        }
    }
}