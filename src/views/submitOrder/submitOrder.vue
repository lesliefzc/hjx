<template>
    <div class="submitOrder" ref="submitOrder">
        <van-nav-bar left-arrow class="header" title="购物车" ref="header" />
            <div class="panel-box" :style="{height: height+'px'}">
                <div>
                    <van-contact-card
                        type="edit"
                        :name="defaultAddress.consignee"
                        :tel="defaultAddress.phone"
                        @click="toAddressList"
                    />
                    <div class="address">收货地址：{{defaultAddress.address}}</div>
                </div>
                <div class="payWay">
                    <van-radio-group v-model="payWay" @change="changePayWay" direction="horizontal">
                        <span>业务类型： </span>
                        <van-radio :name="1">分期付款</van-radio>
                        <van-radio :name="2">普通销售</van-radio>
                    </van-radio-group>
                </div>
                <div class="cart-list">
                    <div class="cart-list-item" v-for="item in cartList.goodsList" :key="item.batchid">
                    <van-card :title="item.name" class="cart-item" style="padding-left:5px;">
                        <div  slot="thumb">
                            <img class="img" v-if="item.imgs.simg" :src="'http://www.topzh.net:16350'+item.imgs.simg" alt />
                            <img class="img" v-else src="../../assets/images/swipe1.png" alt />
                        </div>
                        <div slot="num" class="stepper" @click.stop>
                            <div>x{{item.number}}</div>
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
                    </van-card>

                    <div v-if="item.hasActivity&&payWay!==2">
                        <div class="activity-info" v-for="(activity,index) in item.activityInfos" :key="index">
                        <span>[赠品]</span>
                        <div class="give-name">{{activity.gift.name}}</div>
                        <span>x{{activity.gift.number}}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <van-submit-bar ref="submitBar"  :price="priceType===1||priceType===3?cartList.amountAll:cartList.retailamountAll" button-text="提交订单" @submit="onSubmit" >
                <template #tip>
                    <van-field label="备注：" type="text" placeholder="请输入备注" v-model="memo"/>
                </template>
        </van-submit-bar>
    </div>
</template>
<script lang="ts">
declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue,Watch } from 'vue-property-decorator';
import { NavBar ,Card ,Col,Row ,Icon,Dialog,Field,SubmitBar,ContactCard,RadioGroup, Radio } from 'vant';
import * as utils from '../../utils/utils'
import back from '../../mixin/back'
@Component({
  components: {
    [NavBar.name]: NavBar,
    [Card.name]: Card ,
    [Col.name]: Col,
    [Row.name]: Row,
    [Icon.name]: Icon,
    [Field.name]: Field,
    [SubmitBar.name]: SubmitBar,
    [ContactCard.name]: ContactCard,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    "van-dialog": Dialog.Component,
  },
})
export default class goodDetails extends back {
    private identity:any = {}
    private priceType: any = 0
    private cartList: any = {
        goodsList: []
    }
    private memo: string = ""
    private defaultAddress: any = {}
    private height: number = 0
    private payWay : number = 1 //付款方式 1分期付款  2普通销售 
    mounted(){
        this.$nextTick(()=>{
            let el = this.$refs as any
            this.height = document.documentElement.offsetHeight -  el.submitBar.offsetHeight - el.header.$el.offsetHeight
        })
    }
    created(){
        this.identity = JSON.parse(localStorage.getItem("identity") as string);
        this.priceType = this.identity.priceType
        this.getCarList()
        this.getDefaultAddress()
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
            res.data.goodsList.forEach((item:any) => {
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
    getDefaultAddress(){
        this.$https({
            url: apiUrls.selectDefault,
            method: 'post',
            data:{
                retailer: this.identity.retailerId
            }
        }).then((res:any)=>{
            this.defaultAddress = res.data
        })
    }
    toAddressList(){
        this.$router.push({
            path: "/addressList"
        })
    }
    changePayWay(e:any){
      if(e === 2){
        this.$dialog.alert({
          message: "普通销售不参与活动"
        })
        
      }
    }
    onSubmit(){}
}
</script>
<style lang="scss">
.submitOrder{
    width: 100%;
    height: 100%;
    position: relative;
    .header{
        position: sticky;
        top: 0;
    }
    .address {
        line-height: 30px;
        padding: 0 20px;
        font-size: 16px;
        position: relative;
    }
    .address::before {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 0.05333rem;
        background: -webkit-repeating-linear-gradient(
        135deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%
        );
        background: repeating-linear-gradient(
        -45deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%
        );
        background-size: 2.13333rem;
        content: "";
    }
    .van-submit-bar{
        .van-cell{
            padding: 0
        }
    }
    .submitBar{
        height: 45px;
        display: flex;
        border: 1px solid #eee;
        box-sizing: border-box;
        padding: 0 5px;
        line-height: 45px;
        justify-content: space-evenly;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
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
        overflow-x: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .payWay{
            width: 100%;
            height: 50px;
            line-height: 50px;
            position: relative;
            padding: 0 15px;
            span{
            margin-right: 10px;
            font-size: 15px;
            }
            /deep/.van-radio-group{
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            }
        }
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
            padding: 0 10px;
            box-sizing: border-box;
            .van-card {
            margin-top: 0 !important;
            position: relative;
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
        .amount {
            font-size: 14px;
            font-weight: bold;
        }
    }
}
</style>