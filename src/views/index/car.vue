<template>
    <div class="car" ref="car">
        <van-nav-bar left-text="快速下单" @click-left="quickOrder" class="header" title="购物车" ref="header" />
            <div class="panel-box" >
                <div class="cart-list" :style="{height: height+'px'}"  v-show="cartList.goodsList.length>0">
                    <div class="cart-list-item" v-for="item in cartList.goodsList" :key="item.batchid">
                    <div v-if="item.hasActivity">
                        <van-notice-bar
                        v-for="(activity,index) in item.activityInfos"
                        :key="index"
                        text
                        color="#1989fa"
                        background="#ecf9ff"
                        >
                        <div slot="default">
                            {{activity.name}}
                            <!-- <span
                            class="ml10"
                            >买{{item.activityInfo.items[0].value1}}送{{item.activityInfo.results[0].value1}}</span>-->
                            <span class="ml10">{{activity.skuName}}</span>
                        </div>
                        </van-notice-bar>
                    </div>

                    <van-card :title="item.name" class="cart-item" style="padding-left:5px;" @click="toGoodsDetail(item.id,item.batchid)">
                        <van-row type="flex" slot="thumb">
                        <van-col class="check-box-col" span="9">
                            <van-checkbox v-if="item.status!=0" @click.native.stop="itemChange(item)"  v-model="item.checked" checked-color="red"></van-checkbox>
                            <span v-else style="margin-right: 2px;">已失效</span>
                        </van-col>

                        <van-col span="18" >
                            <img class="img" v-if="item.imgs.simg" :src="'http://www.topzh.net:16350'+item.imgs.simg" alt />
                            <img class="img" v-else src="../../assets/images/swipe1.png" alt />
                        </van-col>
                        </van-row>
                        <div slot="num" class="stepper" @click.stop>
                        <van-stepper
                            :name="item.batchid"
                            :disabled="onChangeflag"
                            v-model.number="item.number"
                            integer
                            @focus ="onFocus(...arguments,item)"
                            @change="onChange"
                        />
                        <span class="board" @click="openCartNumberKeyBoard(item)"></span>
                        </div>

                        <div slot="desc" style="margin-top:5px">
                        批次：{{item.batchname}}
                        </div>
                        <div slot="tags" class="desc">
                        <span
                            class="supply-price"
                            v-if="priceType ==3 || priceType ==1"
                        >供货价：￥{{(item.price/100).toFixed(2)}}
                            <span
                                v-if="item.type == 2"
                                class="origin-price"
                            >￥{{(item.defaultPrice/100).toFixed(2)}}</span>
                        <span
                            v-if="item.batchtype == 2"
                            class="origin-price"
                        >￥{{(item.defaultPrice/100).toFixed(2)}}</span>
                        </span>
                        <p style="margin-top:5px;" v-if="priceType ==4 || priceType ==1">零售价：￥{{(item.retailPrice/100).toFixed(2)}}</p>
                        </div>
                        <!-- <div slot="price" class="mt10 amount">小计：￥{{(item.amount/100).toFixed(2)}}</div> -->
                        <div slot="price" v-if="priceType!=2" class="mt10 amount" style="margin-top:0.2rem">小计：￥{{priceType ==3 || priceType ==1 ? (item.amount/100).toFixed(2) :(item.retailamount/100).toFixed(2)}}</div>
                        <van-row slot="footer">
                        <van-icon @click.stop="deleteGoods(item)" class="delete-icon" size="20px" name="close"></van-icon>
                        </van-row>
                    </van-card>

                    <div v-if="item.hasActivity">
                        <div class="activity-info" v-for="(activity,index) in item.activityInfos" :key="index">
                        <span>[赠品]</span>
                        <div class="give-name">{{activity.gift.name}}</div>
                        <span>x{{activity.gift.number}}</span>
                        </div>
                    </div>
                </div>

            </div>
            <div v-show="cartList.goodsList.length===0" :style="{height: height+'px'}"  class="nodata-text">您的购物车暂时没有商品!</div>
        </div>
        <van-dialog v-model="show" show-cancel-button style="padding: 10px;" @confirm="inputNumConfirm" @cancel="show=false;num=1" >
            <van-field ref="num" label="请输入数量：" type="digit"  v-model="num"/>
        </van-dialog>
        <van-popup v-model="quickShow" position="bottom" style="height:90%;" @close="getCarList">
          <quickOrder :identity ="identity" :priceType="priceType" ref="quickOrderRef"></quickOrder>
        </van-popup>
        <div ref="submitBar" class="submitBar" >
            <van-checkbox @click="allChecked" v-model="checked" checked-color="red">全选</van-checkbox>
            <div class="allPrice" style="width:50%;text-align:center;" v-if="priceType!==2">
                合计：<span style="color:red;font-size:0.5rem;">¥ </span><span>{{priceType===1||priceType===3?(cartList.amountAll?(cartList.amountAll/100).toFixed(2):0):(cartList.retailamountAll?(cartList.retailamountAll/100).toFixed(2):0)}}</span>
            </div>
            <div @click="onSubmit" class="submitBtn">提交订单</div>
        </div>
    </div>
</template>
<script lang="ts">
declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue,Watch } from 'vue-property-decorator';
import { NavBar ,Card ,Col,Row ,Icon,Stepper,Checkbox,NoticeBar,Dialog,Field ,Popup,Search } from 'vant';
import * as utils from '../../utils/utils'
import back from '../../mixin/back'
import quickOrder from '../../components/car/quickOrder.vue'
@Component({
  components: {
    [NavBar.name]: NavBar,
    [Card.name]: Card ,
    [Col.name]: Col,
    [Row.name]: Row,
    [Icon.name]: Icon,
    [Stepper.name]: Stepper,
    [Checkbox.name]: Checkbox,
    [NoticeBar.name]: NoticeBar,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Search.name]: Search,
    "van-dialog": Dialog.Component,
    "quickOrder": quickOrder
  },
})
export default class goodDetails extends back {
    private identity:any = {}
    private priceType: any = 0
    private cartList: any = {
        goodsList: []
    }
    private onChangeflag: boolean = false
    private currentTime: any = 0
    private show: boolean = false
    private num: number = 1
    private chosedItem: any
    private height:any = 0
    private checked: boolean = false
    private quickShow: boolean = false
    
    mounted(){
        this.$nextTick(()=>{
            let el = this.$refs as any;
            this.height = document.documentElement.offsetHeight - 50 - el.header.$el.offsetHeight - el.submitBar.offsetHeight
        })
        
    }
    created(){
        this.identity = JSON.parse(localStorage.getItem("identity") as string);
        this.priceType = this.identity.priceType
        this.getCarList()
    }
    async getCarList(){
        let data = {
            retailerId: this.identity.retailerId,
            dealerId: this.identity.dealerId
        }
        let flag = true;
        await this.$https({
            url: apiUrls.getCartList,
            method:"post",
            data
        }).then((res:any)=>{
            this.checked = true
            res.data.goodsList.forEach((item:any) => {
                if(item.checkStatus === 2){
                    this.checked = false
                }
                if (item.activityInfos && item.activityInfos.length > 0) {
                    item.hasActivity = true;
                } else {
                    item.hasActivity = false;
                }
                    item.checked = item.checkStatus == 1 ? true : false;
                    item.originNumber = item.number;
                if (item.checkStatus == 2 && item.status!=0) {
                    flag = false;
                }

            });
            this.cartList = res.data
        })
    }
    deleteGoods(item:any){
        Dialog.confirm({
            message: "是否删除?"
        }).then(()=>{
            const{id,batchid} = item
            let data = [{ id,batchid }];
            this.$httpsJson({
                url: apiUrls.deleteSkus,
                method: "post",
                data: data
            }).then((res:any)=>{
                if(res.code===200){
                    this.getCarList()
                }
            })
        }).catch(cancel=>{
            console.log(cancel)
        })
    }
    async itemChange(item:any) {
      let data = {
        batchid: item.batchid,
        checkStatus: !item.checked?1:2,
        id: item.id
      }
      await this.$httpsJson({
          url: apiUrls.updateGoodsSkusCheckStatus,
          method: "post",
          data: [data],
      }).then((res:any)=>{
          if(res.code === 200){
              this.getCarList()
          }
      })
    }
    openCartNumberKeyBoard(){

    }
    onFocus(event:any,item:any) {
        event.target.blur()
        this.chosedItem = item
        this.show = true
       
    }
    inputNumConfirm(){
        if(this.num<1){
            this.$toast.fail("数量必须大于1")
            this.num = 1
            return;
        }
        let data = {
            name: this.chosedItem.batchid
        }
        this.onChange(this.num,data)
        this.num = 1
    }
    allChecked(){
        let data:any = []
        this.cartList.goodsList.forEach((ele:any) => {
            let ob = {
                batchid: ele.batchid,
                checkStatus: this.checked?1:2,
                id: ele.id
            } 
            data.push(ob)           
        });
        this.$httpsJson({
            url: apiUrls.updateGoodsSkusCheckStatus,
            method: "post",
            data: data,
        }).then((res:any)=>{
            if(res.code === 200){
                this.getCarList()
            }
        })
    }
    async onChange(value:any, detail:any) {
        if (this.onChangeflag) return;
        this.onChangeflag = true;
        let id = detail.name;
        let item = this.cartList.goodsList.find((goods:any) => {
            return goods.batchid == id;
        });
        let originNumber = item.originNumber;
        let offsetNum = value - originNumber;
        let price = item.price;
        let goodsName = item.goodsName;
        let data = {
            id: item.id,
            name: item.name,
            number: offsetNum,
            batchid: item.batchid,
            batchname:item.batchname
        };
        await this.$httpsJson({
            url: apiUrls.toCar,
            method: "post",
            data: data
        }).then((res:any)=>{
            if(res.code ===200){
                this.getCarList()
                this.onChangeflag = false;
            }
        })
    }
    toGoodsDetail(goodsId:any,batchId:any){
        this.$router.push({
            path: '/goodDetails',
            query:{
                goodsId,
                batchId
            }
        })
    }
    onSubmit(){
        this.$router.push({
            path: '/submitOrder'
        })
    }
    quickOrder(){
        this.quickShow = true
        this.$nextTick(()=>{
            let el = this.$refs as any
            el.quickOrderRef.onSearch()
        })
      
    }
}
</script>
<style lang="scss">
.car{
    width: 100%;
    height: 100%;
    position: relative;
    .header{
        position: sticky;
        top: 0;
    }
    .submitBar{
        height: 45px;
        display: flex;
        border: 1px solid #eee;
        box-sizing: border-box;
        padding: 0 5px;
        line-height: 45px;
        justify-content: space-evenly;
        .allPrice>span{
            color: red;
            font-size: 22px;
        }
        .submitBtn{
            width: 100px;
            height: 40px;
            background: linear-gradient(90deg,#ff6034,#ee0a24);
            color: #fff;
            text-align: center;
            line-height: 40px;
            border-radius: 20px;
            
        }
    }
    .panel-box {
    .nodata-text {
      height: 100%;
      line-height: 50px;
      text-align: center;
      background-color: transparent;
      font-size: 16px;
      color: gray;
    }
    .cart-list {
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      .cart-list-item {
        border-bottom: 1px solid #ddd;
        margin-bottom: 10px;
        .van-card {
          margin-top: 0 !important;
          position: relative;

          .delete-icon {
            position: absolute;
            right: 15px;
            top: 5px;
          }
          .van-card__thumb {
            width: 120px;
          }
        }
        .img {
          width: 90px;
          height: 90px;
        }
        .check-box-col {
          display: flex;
          align-items: center;
        }
      }
    }
    .goods-card {
      margin: 0;
      background-color: #fff;
    }

    .delete-button {
      height: 100%;
    }
    .activity-info {
        font-size: 12px;
        height: 20px;
        display: flex;
        color: gray;
        padding: 0 10px;
        background-color: #fafafa;
        .give-name {
            width: 250px;
            margin: 0 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .cart-item .van-card__title {
        width: 200px;
    }
    .amount {
        font-size: 14px;
        font-weight: bold;
    }
  }
}
</style>