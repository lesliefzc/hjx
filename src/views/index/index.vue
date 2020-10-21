<template>
    <div class="indexClass">
      <van-nav-bar
        style=""
        :left-text="'好经销-'+(orgType===3?identity.dealerName:identity.retailerName)" 
        @click-left="selectDefault"
      />
      <div class="orderStatus">
        <div>
          <p>待确认订单</p>
          <p>{{orderRise.unconfirmedOrder}}</p>
        </div>
        <div>
          <p>待审核订单</p>
          <p>{{orderRise.nauditedOrder}}</p>
        </div>
        <div>
          <p>待发货订单</p>
          <p>{{orderRise.unshippedOrder}}</p>
        </div>
      </div>
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
      <div class="activityArea" v-if="activityList.length!==0">
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
      <div class="goodsRecommend"  v-if="goodsRecommendList.length!==0">
        <div class="commonTitle">
          <p>倾心推荐</p>
        </div>
        <goodsList :dataList="goodsRecommendList"></goodsList>
      </div>
      <div class="goodsRecommend" v-if="newRecommendList.length!==0">
        <div class="commonTitle">
          <p>新品推荐</p>
        </div>
        <goodsList :dataList="newRecommendList"></goodsList>
      </div>
      <van-popup v-model="selectDefaultShow" position="bottom" style="height:90%;">
        <div class="selectList">
          <div class="selectItems" v-for="(item,index) in retailerList" :key="index" @click="modifyDefault(item)">
              <div class="selectItem">
                <p>{{userMsg.orgType === 2?"零售商名称：":"经销商名称："}}</p>
                <p>{{userMsg.orgType === 2?item.retailerName:item.dealerName}}</p>
              </div>
              <div class="selectItem">
                <p  >{{userMsg.orgType === 2?'下单时间：':'上次下单：'}}</p>
                <p  >{{item.submitTime}}</p>
              </div>
          </div>
        </div>
      </van-popup>
    </div>
</template>
<script lang="ts">
declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue } from 'vue-property-decorator';
import { Tab, Tabs ,Swipe, SwipeItem ,NavBar ,Popup } from 'vant';
import dailyData from '../../components/home/dailyData.vue'
import goodsList from '../../components/home/goodsList.vue'
import * as echarts from 'echarts'
import  axios from 'axios'
import * as utils from '../../utils/utils'
@Component({
  components: {
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      [NavBar.name]: NavBar,
      [Popup.name]: Popup,
      "dailyData": dailyData,
      "goodsList": goodsList
  },
})

export default class Index extends Vue {
  private active:number = 0
  private identity:any = {}
  private dailyData:any = {}
  private timeType: number = 1   //订货金额订货量的时间类型  1 2 3
  private OrderTimeType: number = 4 //图表时间类型 4 5 6
  private activityList:object[] = []
  private echartsActive: number = 0
  private xData: string[] = []
  private YData: number[] = []
  private goodsRecommendList: object[] = []    //商品推荐列表
  private newRecommendList: object[] = []    //新品推荐列表
  private orderRise: any = {}    //新品推荐列表
  private selectDefaultShow: boolean = false
  private userMsg: any = {}
  private retailerList: object[] = []
  private orgType: number = 0
  created(){
    this.getDefault()
  }
  mounted(){
  }
  async getDefault(){    //获取默认经销商
      if(!!this.$store.state.user.userMsg.__ob__){
        this.$store.dispatch("aSetUserMsg",localStorage.getItem("userMsg"));
      }
      this.userMsg = JSON.parse(this.$store.state.user.userMsg)
      this.orgType = this.userMsg.orgType
      await this.$https({
        url: apiUrls.defaultDealer,
        method: "post"
      }).then((res:any)=>{
        if(res.code === 200){
          localStorage.setItem("identity",JSON.stringify(res.data));
          this.$store.dispatch("aSetIdentity",JSON.stringify(res.data));
          this.identity = res.data;
          this.getOrderRise();
          this.getDailyDataList();
          this.getActivityList();
          this.goodsRecommend();
          this.newRecommend();
          this.changeOrderStatistics(0);
        }
        
      })
  }
  async modifyDefault(item:any){    //改变选择零售商门店
    let data: object = {
      dealerId: item.dealerId,
      dealerName: item.dealerName,
      retailerId: item.retailerId,
      retailerName: item.retailerName,
      retailerRelationId: item.retailerRelationId,
      userId: item.userId,
    }
    this.$httpsJson({
      url: apiUrls.ModifyRetailerList,
      method: "post",
      data: data
    }).then((res:any)=>{
      if(res.code === 200){
        this.selectDefaultShow = false;
        this.getDefault();
      }
    })

  }
  async selectDefault(){//选择零售商门店
    this.selectDefaultShow = true;
    let data: object = {
      dealerName: "",
      retailerRelationName: "",
      shippingroute: "",
      userId: this.identity.userId
    }
    this.$httpsJson({
      url: apiUrls.selectRetailerList,
      method: "post",
      data: data
    }).then((res:any)=>{
      res.data.forEach((ele:any) => {
        ele.submitTime = ele.submitTime!==null?utils.timestampToTime(ele.submitTime,true):"";
      });
      this.retailerList = res.data
    })
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
  async getOrderRise(){    //获取订单状态
    let data: object = {
      dealer: this.identity.dealerId,
      retailer: this.identity.retailerId
    }
    this.$https({
      url: apiUrls.orderRise,
      method: "post",
      data:data
    }).then((res:any)=>{
      this.orderRise = res.data
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
  async goodsRecommend(){    //商品推荐列表
    let data: object = {
      retailerRelationId: this.identity.retailerRelationId,
      dealerId: this.identity.dealerId,
    }
    await this.$https({
      url: apiUrls.goodsRecommend,
      method: "post",
      data:data
    }).then((res:any)=>{
      this.goodsRecommendList = res.data
    })
  }
  async newRecommend(){    //商品推荐列表
    let data: object = {
      retailerRelationId: this.identity.retailerRelationId,
      dealerId: this.identity.dealerId,
    }
    await this.$https({
      url: apiUrls.newRecommend,
      method: "post",
      data:data
    }).then((res:any)=>{
      this.newRecommendList = res.data
    })
  }
  
  async changeOrderStatistics(name:number){   //图表切换时触发的函数
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
    toGoodsDetail(goodsId:any,batchId: any){
        this.$router.push({
            path: 'goodDetails',
            query:{
                batchId: batchId,
                goodsId: goodsId
            }
        })
    }
}
</script>
<style lang="scss" scoped>
.indexClass{
  position: relative;
  width: 100%;
  height: auto;
  background: #eee;
  padding-bottom: 20px;
  /deep/.van-nav-bar--fixed{
    z-index: 999;
  }
  .orderStatus{
    width: 100%;
    height: 80px;
    background: #fff;
    margin-bottom: 20px;
    display: flex;
    &>div:nth-of-type(1){
      background: url("../../assets/images/home/bg1.png");
      background-size: 100% 100%;
    }
    &>div:nth-of-type(2){
      background: url("../../assets/images/home/bg2.png");
      background-size: 100% 100%;
    }
    &>div:nth-of-type(3){
      background: url("../../assets/images/home/bg3.png");
      background-size: 100% 100%;
    }
    &>div{
      color: #fff;
      line-height: 25px;
      font-size: 14px;
      width: 33.33%;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      
    }
    
  }
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
    margin-top: 20px;
    #myChart1,#myChart2,#myChart3{
      width: 100%;
      height:250px;
    }
  }
  .goodsRecommend{
    margin-top: 20px;
    width: 100%;
    height: auto;
    background: #fff;
  
  }
  .selectList{
    .selectItems{
      width: 100%;
      height: 80px;
      border-bottom: 1px solid #eee;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      color: #000;
      font-size: 15px;
      .selectItem{
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        &>p:first-child{
          font-weight: 600;
        }
      }
    }
    
  }
}
</style>