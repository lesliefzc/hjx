<template>
  <div class="mainTabbar">
    <div :style="{'height':routerViewHeight+'px','overflow':'scroll'}">
      <router-view />
    </div>
      <van-tabbar ref="tabbar" :fixed="false" :placeholder="true" :safe-area-inset-bottom="true" v-model="active">
          <van-tabbar-item icon="home-o" replace to="/home">首页</van-tabbar-item>
          <van-tabbar-item icon="goods-collect-o"  replace to="/goods">商品</van-tabbar-item>
          <van-tabbar-item icon="friends-o"  replace to="/dynamicSales">动销</van-tabbar-item>
          <van-tabbar-item icon="shopping-cart-o"  replace to="/car">购物车</van-tabbar-item>
          <van-tabbar-item icon="setting-o" replace to="/templateOrder">模板下单</van-tabbar-item>
          <van-tabbar-item icon="manager-o" replace to="/account">我的</van-tabbar-item>
      </van-tabbar>
  </div>
</template>
<script lang="ts">

import {Tabbar,TabbarItem} from 'vant'
declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue } from 'vue-property-decorator';
@Component({
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
})
export default class Home extends Vue {
   private active: number = 0
   private authorityKeyList:any[] = []
   private routerViewHeight:number = 0
   mounted(){
     let el: any = this.$refs.tabbar as any
     this.routerViewHeight = document.documentElement.offsetHeight - el.$el.offsetHeight ;
   }

}
</script>
<style lang="scss" scoped>
.mainTabbar{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>