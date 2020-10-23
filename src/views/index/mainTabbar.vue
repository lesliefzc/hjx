<template>
  <div class="mainTabbar">
    <div :style="{'height':routerViewHeight+'px','overflow':'scroll'}">
      <router-view />
    </div>
      <van-tabbar route ref="tabbar" :fixed="false" :placeholder="true" :safe-area-inset-bottom="true" v-model="active">
          <van-tabbar-item icon="home-o" :to="{name:'home',query:{height: routerViewHeight}}" >首页</van-tabbar-item>
          <van-tabbar-item icon="goods-collect-o"   :to="{name:'goods',query:{height: routerViewHeight}}"  >商品</van-tabbar-item>
          <van-tabbar-item icon="friends-o"   to="/dynamicSales">动销</van-tabbar-item>
          <van-tabbar-item icon="shopping-cart-o"   to="/car">购物车</van-tabbar-item>
          <van-tabbar-item icon="setting-o"  to="/templateOrder">模板下单</van-tabbar-item>
          <van-tabbar-item icon="manager-o"  to="/account">我的</van-tabbar-item>
      </van-tabbar>
  </div>
</template>
<script lang="ts">
declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue } from 'vue-property-decorator';
import {Tabbar,TabbarItem} from 'vant'
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
      this.$nextTick(()=>[
      this.routerViewHeight = document.documentElement.offsetHeight - el.$el.offsetHeight
    ])
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