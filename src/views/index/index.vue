<template>
    <div class="indexClass">
      <div class="dailyData">
        <div class="cell">
          <p>业务概览</p>
        </div>
        <van-tabs v-model="active" @click="changeTabs"  animated swipeable >
          <van-tab title="今天">
            <dailyData  :orderAmount="dailyData.orderGoodsAmount" :orderQuantity="dailyData.orderGoodsQty" :deliveryAmount="dailyData.deliverGoodsAmount" :deliveryQuantity="dailyData.deliverGoodsQty"></dailyData>
          </van-tab>
          <van-tab title="本周">
            <dailyData :orderAmount="dailyData.orderGoodsAmount" :orderQuantity="dailyData.orderGoodsQty" :deliveryAmount="dailyData.deliverGoodsAmount" :deliveryQuantity="dailyData.deliverGoodsQty"></dailyData>
          </van-tab>
          <van-tab title="本月">
            <dailyData :orderAmount="dailyData.orderGoodsAmount" :orderQuantity="dailyData.orderGoodsQty" :deliveryAmount="dailyData.deliverGoodsAmount" :deliveryQuantity="dailyData.deliverGoodsQty"></dailyData>
          </van-tab>
        </van-tabs>
      </div>
      <div class="activityArea">
        <div class="acivityTitle">
          <p>营销活动</p>
          <p>更多</p>
        </div>
        <div>
          <van-swipe class="my-swipe" :autoplay="2000" indicator-color="white">
            <van-swipe-item v-for="(item,index) in activityList" :key="index">
              <img v-if="item.img!=''&&item.img!=null" :src="'http://www.topzh.net:16350/'+item.img" alt="">
              <img v-else src="../../assets/images/swipe1.png" alt="">
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </div>
</template>
<script lang="ts">
declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue } from 'vue-property-decorator';
import { Tab, Tabs ,Swipe, SwipeItem  } from 'vant';
import dailyData from '../../components/home/dailyData.vue'
@Component({
  components: {
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      "dailyData": dailyData
  },
})

export default class Home extends Vue {
  private active:number = 0
  private identity:any = {}
  private dailyData:any = {}
  private timeType: number = 1
  private activityList:object[] = []

  created(){
    this.getDefault()
  }
  async getDefault(){    //获取默认经销商
      if(!this.$store.state.user.userMsg){
        this.$store.dispatch("aSetUserMsg",localStorage.getItem("userMsg"));
      }
      await this.$https({
        url: apiUrls.defaultDealer,
        method: "post"
      }).then((res:any)=>{
        localStorage.setItem("identity",JSON.stringify(res.data));
        this.$store.dispatch("aSetIdentity",JSON.stringify(res.data));
        this.identity = res.data
      })
      this.getDailyDataList();
      this.getActivityList();
  }
  async getDailyDataList(){    //获取每日/本周/本月的数据
    let data: object = {
      timeType: this.timeType,
      dealer: this.identity.dealerId,
      retailer: this.identity.retailerId
    }
     this.$https({
        url: apiUrls.orderOverview,
        method: "post",
        data:data
      }).then((res:any)=>{
        let item: any;
        for(item in res.data){
          res.data[item] = res.data[item].toFixed(2)
        }
        this.dailyData = res.data
      })
  }
  async getActivityList(){    //获取活动列表
    let data: object = {
      retailerRelationId: this.identity.retailerRelationId,
      dealerId: this.identity.dealerId,
      queryNum: 5
    }
    await this.$https({
        url: apiUrls.activityList,
        method: "post",
        data:data
      }).then((res:any)=>{
        this.activityList = res.data
      })
  }
  changeTabs(name:number){
    this.timeType = name + 1
    this.getDailyDataList()
  }
}
</script>
<style lang="scss" scoped>
.indexClass{
  width: 100%;
  height: 100%;
  background: #eee;
  .dailyData{
    background: #fff;
    width: 100%;
    overflow: hidden;
    height: auto;
    margin-bottom: 1px;
  }
  .cell{
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #eee;
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
  .activityArea{
    background: #fff;
    width: 100%;
    height: 250px;
    margin-top: 20px;
    .acivityTitle{
      height: 45px;
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
      line-height: 45px;
      border-bottom: 1px solid #eee;
      p:nth-child(2){
        color: red;
        font-size: 14px;
      }
    }
    .my-swipe{
      width: 100%;
      height: 205px;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>