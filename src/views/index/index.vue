<template>
    <div class="indexClass">
      <div class="dailyData">
        <div class="cell">
          <p>业务概览</p>
        </div>
        <van-tabs v-model="active" >
          <van-tab title="今天">
            <dailyData  :orderAmount="123" :orderQuantity="456" :deliveryAmount="123" :deliveryQuantity="456"></dailyData>
          </van-tab>
          <van-tab title="本周">
            <dailyData :orderAmount="123" :orderQuantity="456" :deliveryAmount="123" :deliveryQuantity="456"></dailyData>
          </van-tab>
          <van-tab title="本月">
            <dailyData :orderAmount="123" :orderQuantity="456" :deliveryAmount="123" :deliveryQuantity="456"></dailyData>
          </van-tab>
        </van-tabs>
      </div>
    </div>
</template>
<script lang="ts">
declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue } from 'vue-property-decorator';
import { Tab, Tabs } from 'vant';
import dailyData from '../../components/home/dailyData.vue'
@Component({
  components: {
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      "dailyData": dailyData
  },
})
export default class Home extends Vue {
  private active:number = 0
   identity :any = {}
  created(){
    this.getDefault()
  }
  getDefault(){
      if(!this.$store.state.user.userMsg){
        this.$store.dispatch("aSetUserMsg",localStorage.getItem("userMsg"));
      }
      this.$https({
        url: "/api/index/select/default",
        method: "post"
      }).then((res:any)=>{
        localStorage.setItem("identity",JSON.stringify(res.data));
        this.$store.dispatch("aSetIdentity",JSON.stringify(res.data));
        this.identity = res.data
      })
    console.log(this.identity)
      // this.getDailyDataList()
  }
  getDailyDataList(){
    console.log(this.identity)
    // let data: object = {
    //   timeType: 1,
    //   dealer: this.identity.dealerId,
    //   retailer: this.identity.retailerId
    // }
    //  this.$https({
    //     url: "/order/index_order_overview",
    //     method: "post",
    //     data:data
    //   }).then((res:any)=>{
    //     console.log(res)
    //     // localStorage.setItem("identity",JSON.stringify(res.data));
    //     // this.$store.dispatch("aSetIdentity",JSON.stringify(res.data));
    //   })
  }
}
</script>
<style lang="scss" scoped>
.indexClass{
  width: 100%;
  height: 100%;
  .dailyData{
    width: 100%;
    overflow: hidden;
    height: auto;
    border-bottom: 1px solid #eee;
  }
  .cell{
    width: 100%;
    height: 40px;
    line-height: 40px;
    border: 1px solid #eee;
    padding: 0 20px;
    font-size: 14px;
  }
  .dataArea{
    width: 100%;
    height: 60px;
    border: 1px solid #eee;
    padding: 0 20px;
    font-size: 14px;
    display: flex;
    &>div{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 100%;
      text-align: center;
    }
  }
}
</style>