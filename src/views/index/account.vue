<template>
    <div class="account">
       <van-button type="danger" size="large" @click="loginOut">退出登录</van-button>
    </div>
</template>
<script lang="ts">
declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue } from 'vue-property-decorator';
import { Button } from 'vant';
import * as utils from '../../utils/utils'
@Component({
  components: {
      [Button.name]: Button,

  },
})

export default class account extends Vue {
    loginOut(){
        this.$https({
            url: apiUrls.loginOut,
            method: "post"
        }).then((res: any)=>{
           
        })
    }
}
</script>