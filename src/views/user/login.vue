<template>
  <div class="login">
      <img src="../../assets/images/login/logo.png">
      <div class="inputArea">
        <div class="inputItem">
            <div class="title">账号</div>
            <input type="text" placeholder="请输入账号" maxlength="11" v-model="userForm.username">
        </div>
        <div class="inputItem">
            <div class="title">密码</div>
            <input type="password" max="11" placeholder="请输入密码" v-model="userForm.password">
        </div>
        <div @click="toLogin" class="loginBtn">登陆</div>
      </div>
  </div>
</template>
<script lang="ts">

declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue } from 'vue-property-decorator';
// import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
Component.registerHooks([
    'beforeRouteEnter'
])
@Component({
  components: {
  },
})
export default class Home extends Vue {
    // private username: string = ""
    beforeRouteEnter(to:any, from:any, next:any){
        if(!!localStorage.getItem("token")){
            next('/index')
        }else{
            next()
        }
    }
    private userForm: any = {
        username: '',
        password: ''
    }
    toLogin():void{
      if(this.userForm.username!==""&&this.userForm.password!==""){
        this.$https({
            url: apiUrls.login,
            method: "post",
            data: this.userForm
        }).then((res:any)=>{
            if(res.code == 200){
                this.$store.dispatch('aSetUserMsg',JSON.stringify(res.data.user));
                localStorage.setItem("userMsg",JSON.stringify(res.data.user))
                localStorage.setItem("token",res.data.token);
                this.$toast.success("登录成功")
                setTimeout(() => {
                    this.$router.push({
                        path: "/index"
                    })
                }, 1000);
            }
        })
      }else{
          this.$toast.fail("账号与密码不能为空");
      }
    }
}
</script>
<style lang="scss" scoped>
.login{
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    &>img{
        display: block;
        width: 70%;
        margin: 100px auto 20px auto;
    }
    .inputItem{
        display: flex;
        width: 90%;
        height: 50px;
        margin: 20px auto;
        border-radius: 30px;
        background: #eee;
        line-height: 50px;
        font-size: 17px;
        justify-content: space-between;
        padding: 0 30px; 
        box-sizing: border-box;
        &>input{
            border: none;
            background: #eee;
            width: 70%;
        }
    }
    .loginBtn{
        width: 90%;
        height: 40px;
        border-radius: 30px;
        margin: 30px auto;
        background: rgb(209, 46, 25);
        line-height: 40px;
        text-align: center;
        color: #fff;
    }
}
</style>