<template>
  <div class="home">
    <van-button type="primary">111</van-button>
    <div class="test"></div>
  </div>
</template>
<script lang="ts">
import * as apiUrls from '../utils/apiUrl'
import { Component, Vue } from 'vue-property-decorator';
// import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import {Button,Toast } from 'vant'
@Component({
  components: {
    [Button.name]: Button
  },
})
export default class Home extends Vue {
  mounted(){
    this.getList()
  }
  getList():void{
    this.$https({
      url: apiUrls.login,
      method: 'POST',
    }).then((res:any)=>{
      console.log(res)
    })
  }
}
// export default Vue.extend ({
//   components:{
//     [Button.name]: Button
//   }
// })
</script>
<style lang="scss" scoped>
.home{
  margin: 0;
  padding: 0;
  .test{
    width:100px;
    height:100px;
    background:#999;
  }
}
</style>