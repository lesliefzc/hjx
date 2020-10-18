<template>
    <div class="goods" ref="goods">
       <div class="search" ref="search">
        <van-nav-bar :placeholder="true"   title="商品分类" />
           <van-search
                v-model="searchValue"
                shape="round"
                placeholder="请输入搜索关键词"
                show-action
            >
                <template #action>
                    <div @click="search">搜索</div>
                </template>
            </van-search>
        </div>
        <div class="goodsArea" >
            <div class="slider"  :style="{height: height+'px'}">
                <div v-for="(item,index) in categoryList" :key="index" :class="{'active': active === index}"  :data-id="index" @click="changeCategory(item,index)">{{item.name}}</div>
            </div>
            <div class="categoryArea" :style="{height: height+'px'}">
                <div class="categoryTop">
                    <img :src="'http://www.topzh.net:16350/' + currentCategory.img" alt="">
                </div>
                <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 10px' }">{{currentCategory.name}}</van-divider>
                <div class="brandContent" v-if="brandList.length > 0"> 
                    <div @click="toGoodList(item)" class="brandItem" v-for="(item,index) in brandList" :key="index">
                        <img :src="'http://www.topzh.net:16350/'+ item.img" alt="">
                        <p>{{item.name}}</p>
                    </div>
                </div>
                <noData v-else></noData>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue } from 'vue-property-decorator';
import { NavBar,Search,Divider} from 'vant';
import * as utils from '../../utils/utils'
import noData from '../../components/common/noData.vue'
@Component({
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Divider.name]: Divider,
    "noData": noData
  },
})

export default class goods extends Vue {
    private identity:any = {}
    private searchValue: string = ""
    private active: number = 0
    private categoryList: any[] = []
    private brandList: object[] = []
    private contentHeight: number = 0
    private currentCategory: any = ""
    private height: any = 0
    mounted(){ 
        this.$nextTick(()=>{
            let ro = this.$route.query as any
            let el = this.$refs as any
            this.height = ro.height - el.search.offsetHeight
        })
        this.identity = JSON.parse(localStorage.getItem("identity") as string);
        this.getCategoryList()
    }
    changeCategory(e:any,index:number){
        this.active = index
        this.currentCategory = this.categoryList[this.active]
        this.getBrandList()
    }
    async getCategoryList(){
        let data: object = {
            parentCategoryId: 0
        }
        await this.$https({
            url: apiUrls.categoryList,
            method: "post",
            data:data
        }).then((res:any)=>{
            this.categoryList = res.data;
            this.currentCategory = this.categoryList[this.active]
            this.getBrandList();
        })
    }
    async getBrandList(){
        let data: object = {
            categoryId: this.categoryList[this.active].id,
            dealerId: this.identity.dealerId,
            retailerRelationId: this.identity.retailerRelationId
        }
        await this.$httpsJson({
            url: apiUrls.brandList,
            method: "post",
            data:data
        }).then((res:any)=>{
           this.brandList = res.data
        })
    }
    toGoodList(item:any){
        this.$router.push({
            path: "/goodList",
            query:{
                brandId: item.id,
                categoryId: this.categoryList[this.active].id
            }
        })
    }
    search(){
        this.$router.push({
            path: '/goodList',
            query:{
                goodsName: this.searchValue
            }
        })
    }
}
</script>
<style lang="scss">
.goods{
    width: 100%;
    height: 100%;
    position: relative;
    .search{
        position: sticky;
        top: 0;
    }
    .goodsArea{
        display: flex;
        .slider{
            width:80px;
            overflow: scroll;
            -webkit-overflow-scrolling: touch;
            background: #f5f5f5;
            width: 25%;
            &>div{
                width: 100%;
                min-height: 50px;
                word-break: break-all;
                text-align: center;
                line-height: 50px;
            }
            .active{
                background: #fff;
            }
        }
        .categoryArea{
            width: 75%;
            overflow: scroll;
            -webkit-overflow-scrolling: touch;
            .categoryTop{
                &>img{
                    display: block;
                    margin: 0 auto;
                    width: 90%;
                    height: 150px;
                    border-radius: 10px;
                    border: 1px solid #eee;
                }
            }
        }
        .brandContent{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 0 10px;
            .brandItem{
                width: 120px;
                height: 120px;
                border: 1px solid #eee;
                border-radius: 10px;
                margin-bottom: 10px;
                padding: 10px 0;
                box-sizing: border-box;
                &>img{
                    display: block;
                    width: 80px;
                    height: 80px;
                    margin: 0 auto;
                }
                &>p{
                    text-align: center;
                    font-size: 15px;
                }
            }
        }
    }
    
}
</style>