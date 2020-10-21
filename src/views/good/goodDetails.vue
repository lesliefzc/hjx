<template>
    <div class="goodDetails" ref="goodDetails">
         <van-nav-bar
            title="商品详情"
            ref="header"
            left-arrow
            @click-left="back"
        />
        <div class="swipeImage">
            <van-swipe  :autoplay="2000" indicator-color="white">
                <van-swipe-item>
                    <img :src="!!goodDetails.bImg1?baseURL+goodDetails.bImg1:require('../../assets/images/swipe1.png') " alt="">
                </van-swipe-item>
                <van-swipe-item>
                    <img :src="!!goodDetails.bImg2?baseURL+goodDetails.bImg2:require('../../assets/images/swipe1.png') " alt="">
                </van-swipe-item>
                <van-swipe-item>
                    <img :src="!!goodDetails.bImg3?baseURL+goodDetails.bImg3:require('../../assets/images/swipe1.png') " alt="">
                </van-swipe-item>
                <van-swipe-item>
                    <img :src="!!goodDetails.bImg4?baseURL+goodDetails.bImg4:require('../../assets/images/swipe1.png') " alt="">
                </van-swipe-item>
                <van-swipe-item>
                    <img :src="!!goodDetails.bImg5?baseURL+goodDetails.bImg5:require('../../assets/images/swipe1.png') " alt="">
                </van-swipe-item>
            </van-swipe>
        </div>
        <div class="goodsDesc">
            <div class="price" v-show="identity.priceType!==2" >
                <div v-show="identity.priceType===3 || identity.priceType ===1" style="margin-right: 20px;">
                    <span class="pricetitle"   >供货价：</span><span>¥</span><span class="priceNum">{{goodDetails.price}}</span><span class="originPrice">{{goodDetails.defaultPrice}}</span>
                </div>
                <div v-show="identity.priceType===4 || identity.priceType ===1">
                    <span class="pricetitle" >零售价：</span><span>¥</span><span  class="priceNum">{{goodDetails.retailPrice}}</span>
                </div>
            </div>
            <p class="goodsName">{{goodDetails.goodsName}}</p>
            <div class="item">
                <p>商品简介：</p>
                <p>{{goodDetails.desc}}</p>
            </div>
             <div class="item flexItem">
                <p>商品属性</p>
                <p>{{goodDetails.attributeValueNames}}</p>
            </div>
            <div class="item flexItem">
                <p>条形码</p>
                <p>{{goodDetails.barCode}}</p>
            </div>
            <div class="item flexItem">
                <p>商品批次</p>
                <p>{{goodDetails.batchNo}}</p>
            </div>
            <div class="item flexItem">
                <p>备注</p>
                <p>{{goodDetails.batchMemo}}</p>
            </div>
            <van-divider style="margin:5px auto; "  v-show="goodDetails.memo!==null">产品详情</van-divider>
            <div style="padding: 10px;img:width:100%;background:#fff;" v-show="goodDetails.memo!==null" v-html="goodDetails.memo"></div>
        </div>
        <div style="position:relative;bottom:0;height:1.33333rem;"></div>
        <van-goods-action >
            <van-goods-action-icon icon="cart-o" text="购物车" to="/car" />
            <van-goods-action-button
                type="danger"
                text="加入购物车"
                @click="addToCar"
            />
        </van-goods-action>
    </div>
</template>
<script lang="ts">
declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue } from 'vue-property-decorator';
import { NavBar,Search,Divider,Swipe,SwipeItem,GoodsAction, GoodsActionIcon, GoodsActionButton } from 'vant';
import * as utils from '../../utils/utils'
import back from '../../mixin/back'
@Component({
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Divider.name]: Divider,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton .name]: GoodsActionButton 
  },
})

export default class goodDetails extends back {
    private identity:any = {}
    private goodDetails:any = {}
    private baseURL: string = 'http://www.topzh.net:16350'
    private goodsId:any = {}
    private batchId:any = {}

    
    mounted(){
        this.identity = JSON.parse(localStorage.getItem("identity") as string);
        this.goodsId = this.$route.query.goodsId
        this.batchId = this.$route.query.batchId
        this.getGoodDetails()
    }
    getGoodDetails(){
        let data = {
            retailerRelationId: this.identity.retailerRelationId,
            goodsId: this.goodsId,
            batchId: this.batchId
        }
        this.$https({
            url: apiUrls.goodDetails,
            method: "post",
            data:data
        }).then((res:any)=>{
            this.goodDetails = res.data
            this.goodDetails.defaultPrice = this.goodDetails.defaultPrice/100
            this.goodDetails.price = this.goodDetails.price/100
            this.goodDetails.retailPrice = this.goodDetails.retailPrice/100

        })
    }
    addToCar(){
        console.log(this.goodDetails)
        let data = {
            id: this.$route.query.goodsId,
            batchid: this.$route.query.batchId,
            batchname: this.goodDetails.batchNo,
            name: this.goodDetails.goodsName,
            number: 1
        }
        this.$httpsJson({
            url: apiUrls.toCar,
            method: "post",
            data: data
        }).then((res:any)=>{
            if(res.code === 200){
                this.$toast.success("添加成功")
            }
        })
    }
}
</script>
<style lang="scss">
.goodDetails{
    widows: 100%;
    height: 100%;
    background: #eee;
    color: #000;
    font-size: 15px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .swipeImage{
        .van-swipe{
            height: 220px;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .goodsDesc{
        word-break: break-all;
        .pricetitle{
            background: #fff;
            color:#000;font-size:15px;
        }
        .price{
            display: flex;
            background: #fff;
            padding: 10px;
            color: red;
            .priceNum{
                font-size: 25px;
                margin-left: 5px;
            }
            .originPrice{
                text-decoration: line-through;
                margin-left: .13333rem;
                color: grey;
            }
        }
        .goodsName{
            padding: 10px;
            font-weight: 600;
            background: #fff;
        }
        .item{
            background: #fff;
            margin-top: 5px;
            padding: 10px;
            &>p:first-child{
                color: #999;
            }
            &>p:last-child{
                line-height: 30px;
            }
        }
        .flexItem{
            &>p:first-child{
                width: 25%;
            }
            min-height: 25px;
            line-height: 25px;
            display: flex;
        }
    }
}
</style>