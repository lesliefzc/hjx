<template>
  <div class="mainTabbar">
      <router-view />
       <van-tabbar fixed v-model="active">
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
   private authorityKeyList:[] = []

}
</script>
<style lang="scss" scoped>
.mainTabbar{
  width: 100%;
  height: 100%;
}
</style>