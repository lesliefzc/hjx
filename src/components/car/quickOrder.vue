<template>
    <div class="quickOrder" ref="quickOrder">
         <van-search
            v-model="goodsNameOrCode"
            show-action
            placeholder="请输入商品名称或商品编码"
            @search="onSearch(true)"
            ref="search"
        >
            <template #action>
                <div @click="onSearch">搜索</div>
            </template>
        </van-search>
        <div class="goodsList" :style="{height: height+'px'}">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onSearch(false)"
                :immediate-check="false"
            >
            <div class="goodItem" v-for="(item,index) in goodsList" :key="index">
               <p>{{item.goodsName}}</p>
               <p class="batch">批次：{{item.batchNo}}</p>
               <div>
                   <div>
                        <p>供货价：{{(item.price/100).toFixed(2)}}</p>
                        <p>零售价：{{(item.retailPrice/100).toFixed(2)}}</p>
                   </div>
                   <van-icon @click="addToCar(item)" name="cart" size="20"/>
               </div>
            </div>
            </van-list>
        </div>
    </div>
</template>
<script lang="ts">
declare function require(img: string): string
import { Component, Vue } from 'vue-property-decorator';
import {Search,List,Icon} from 'vant'
import * as apiUrls from '../../utils/apiUrl'
@Component({
  components: {
    [Search.name]: Search,
    [List.name]: List,
    [Icon.name]: Icon
  },
  props:{
        identity:{
            type: Object,
            default: {}
        },
        priceType: {
            type: Number,
            default: 0
        }
    }
})
export default class dailyData extends Vue {
    private goodsNameOrCode: string = ""
    private identity:any 
    private priceType: any 
    private goodsList:any[] = []
    private height: number = 0
    private loading: boolean = false
    private finished: boolean = false
    private currentPage: number = 1
    mounted(){
        this.$nextTick(()=>{
            let el = this.$refs as any
            this.height = document.documentElement.offsetHeight*0.9 - el.search.offsetHeight
        })
    }
    onSearch(isClick:boolean){
        if(isClick){
            this.goodsList = []
            this.currentPage = 1
            this.finished = false
        }
        let data = {
            dealer: this.identity.dealerId,
            goodsNameOrErpcode: this.goodsNameOrCode,
            pageNo: this.currentPage,
            pageSize: 10,
            retailerRelation: this.identity.retailerRelationId,
        }
        this.$httpsJson({
            url: apiUrls.goodsList,
            method: "post",
            data: data
        }).then((res:any)=>{
            this.goodsList = this.goodsList.concat(res.data.list)
            if(res.data.list.length!==0){
                this.currentPage++
                this.loading = false
            }else{
                this.finished = true
            }
        })
    }
    addToCar(item:any){
        let data = {
            id: item.goodsId,
            batchid: item.batchId,
            batchname: item.batchNo,
            name: item.goodsName,
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
<style lang="scss" scoped>
.quickOrder{
    position: relative;
    .goodsList{
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .goodItem{
        min-height: 70px;
        border-bottom: 1px solid #eee;   
        padding: 10px 15px;
        box-sizing: border-box;
        &>*{
            margin-bottom: 5px;
        }
        .batch{
            font-size: 15px;
            color: #999;
        }
        &>div{
            display: flex;
            justify-content: space-between;
            &>div{
                display: flex;
                &>p{
                    margin-right: 20px;
                    font-size: 15px;
                }
            }
            
        }
    }
}
</style>