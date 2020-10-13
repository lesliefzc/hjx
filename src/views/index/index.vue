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
      <div class="echartsArea">
        <div class="commonTitle">
          <p>订货统计</p>
        </div>
        <van-tabs v-model="echartsActive" @click="changeOrderStatistics" animated swipeable >
          <van-tab title="近七天">
            <div id="myChart1" ></div>
          </van-tab>
          <van-tab title="近一个月">
             <div id="myChart2" ></div>
          </van-tab>
          <van-tab title="近三个月">
             <div id="myChart3" ></div>
          </van-tab>
        </van-tabs>
      </div>
      <div class="activityArea">
        <div class="commonTitle">
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
import * as echarts from 'echarts'
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
  private timeType: number = 1   //订货金额订货量的时间类型  1 2 3
  private OrderTimeType: number = 4 //图表时间类型 4 5 6
  private activityList:object[] = []
  private echartsActive: number = 0
  private xData: string[] = []
  private YData: number[] = []
  created(){
    this.getDefault()
  }
  mounted(){
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
      this.changeOrderStatistics(0)
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
  async getOrderStatistics(){   //获取echarts图表的数据
    let data: object = {
      retailer: this.identity.retailerId,
      dealer: this.identity.dealerId,
      type: 1,
      timeType: this.OrderTimeType
    }
    this.xData = []
    this.YData = []
    await this.$https({
      url: apiUrls.OrderStatistics,
      method: "post",
      data:data
    }).then((res:any)=>{
      res.data.forEach((ele:any) => {
          this.xData.push(ele.date)
          this.YData.push((ele.amount/100))
      });
    })
  }
  async changeOrderStatistics(name:number){
    this.OrderTimeType = name + 4
    await this.getOrderStatistics();
    if(name===0){
      let myChart = echarts.init(document.getElementById("myChart1") as HTMLDivElement)
      this.drawLine(myChart)
      // 绘制图表
    }else if(name===1){
      let myChart = echarts.init(document.getElementById("myChart2") as HTMLDivElement)
      this.drawLine(myChart)
    }else{
      let myChart = echarts.init(document.getElementById("myChart3") as HTMLDivElement)
      this.drawLine(myChart)
    }
  }
  async drawLine(myChart:any){
    // 基于准备好的dom，初始化echarts实例
    let options = {
        tooltip: {},
        xAxis: {
            data: this.xData
        },
        yAxis: {
          max: Math.max(...this.YData) + 50
        },
        series: [{
            name: '销量',
            type: 'line',
            data: this.YData
        }],
        grid:{
          top: 20,
          left: "15%"
        }
      }
      this.$nextTick(()=>{
        myChart.setOption(options);
      })  
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
  .commonTitle{
    height: 45px;
    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    line-height: 45px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    p:nth-child(2){
      color: red;
      
    }
  }
  .activityArea{
    background: #fff;
    width: 100%;
    height: 250px;
    margin-top: 20px;
    .my-swipe{
      width: 100%;
      height: 205px;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .echartsArea{
    width: 100%;
    height: 320px;
    background: #fff;
    #myChart1,#myChart2,#myChart3{
      width: 100%;
      height:250px;
    }
  }
}
</style>