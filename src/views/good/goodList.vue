<template>
    <div class="goodList" >
        <van-nav-bar
            title="商品列表"
            ref="header"
        />
        <div class="searchArea"  ref="searchArea">
            <div class="searchInput">
                <van-search
                    v-model="searchValue"
                    shape="round"
                    placeholder="请输入搜索关键词"
                    show-action
                >
                    <template #action>
                        <div @click="getGoodsList">搜索</div>
                    </template>
            </van-search>
            </div>
            <div class="searchSelect">
                <van-dropdown-menu>
                    <van-dropdown-item v-model="value1" @change="getGoodsList" :options="option1" />
                    <van-dropdown-item v-model="value2" :options="option2" />
                    <van-dropdown-item  @open="openMenu" title="筛选">
                        <div class="selectTab"> 
                            <div class="priceType">
                                <div class="priceInput">
                                    <p>供货价格：</p>
                                    <input class="inputStyle" type="text" v-model="minPrice" placeholder="最低价">
                                    <div style="margin: 0 15px;">一</div>
                                    <input class="inputStyle" type="text" v-model="maxPrice" placeholder="最高价">
                                </div>
                                <div class="priceInput">
                                    <p>零售价格：</p>
                                    <input class="inputStyle" type="text" v-model="minRetailPrice" placeholder="最低价">
                                    <div style="margin: 0 15px;">一</div>
                                    <input class="inputStyle" type="text" v-model="maxRetailPrice" placeholder="最高价">
                                </div>
                            </div>
                            <div class="categrory">
                                <p>类别：</p>
                                <div class="selelctArea">
                                    <div :class="{'selectItem':true,active: activeCategrory===index }"  v-for="(item,index) in categoryList" @click="check(item,index,false)" :key="index">{{item.name}}</div>
                                </div>
                            </div>
                             <div class="categrory" v-show="brandList.length>0">
                                <p>品牌</p>
                                <div class="selelctArea">
                                    <div :class="{'selectItem':true,active: activebrand===index }"  v-for="(item,index) in brandList" @click="check(item,index,true)" :key="index">{{item.name}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="confirmOrReset" style="">
                            <button @click="onReset">重置</button>
                            <button @click="getGoodsList" style="background:#ee0a24;color:#fff">确认</button>
                        </div>
                    </van-dropdown-item>
                </van-dropdown-menu>
            </div>
            <div class="goodsArea" :style="{height: offsetHeight+'px'}">

            </div>
        </div>
    </div>
</template>
<script lang="ts">
declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue } from 'vue-property-decorator';
import { NavBar,Search,Divider,Toast,DropdownMenu, DropdownItem,Field ,Cell ,CellGroup,Button } from 'vant';
import * as utils from '../../utils/utils'
import axios from 'axios'
import noData from '../../components/common/noData.vue'
@Component({
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button
  },
})

export default class goodList extends Vue {
    private brandList: object[] = []
    private categoryList: any[] = []
    private selectedCategoryList: any[] = []
    private selectedBrandList: any[] = []
    private goodsList: any[] = []
    private identity:any = {}
    private maxPrice:any = ""
    private maxRetailPrice:any = ""
    private minPrice:any = ""
    private minRetailPrice:any = ""
    private offsetHeight:number = 0
    private searchValue: string = ""
    private value1: number = 0
    private value2: number = 0
    private activeCategrory: number = -1
    private activebrand: number = -1
    private option1: object[] = [
        { text: '所有', value: 0 },
        { text: '新品', value: 1 },
        { text: '推荐', value: 2 },
        { text: '特销', value: 3 },
    ]
    private option2: object[] = [
        { text: '综合', value: 0 },
        { text: '零售价格↓', value: 1 },
        { text: '零售价格↑', value: 2 },
        { text: '供货价格↓', value: 3 },
        { text: '供货价格↑', value: 4 },
    ]
    mounted(){
        this.identity = JSON.parse(localStorage.getItem("identity") as string);
        let el = this.$refs as any
        this.$nextTick(()=>{
            this.offsetHeight = document.documentElement.offsetHeight-(el.header.$el.offsetHeight+el.searchArea.offsetHeight)
        })
        this.getGoodsList()
    }
    created(){
     
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
            
        })
    }
    async getGoodsList(){
        Toast.loading({
            duration: 10000,
            loadingType: "circular"
        })
        let data: any = {
            attributeValues: [],
            categoryId: this.selectedCategoryList.length>0?this.selectedCategoryList[0].id:'',
            retailerRelation: this.identity.retailerRelationId,
            dealer: this.identity.dealerId,
            goodsName: this.searchValue,
            maxPrice: this.maxPrice,
            maxRetailPrice: this.maxRetailPrice,
            minPrice: this.minPrice,
            minRetailPrice: this.minRetailPrice,
            pageSize: 100,
            pageNo:1,
            orderField: "ND"
        }
        if(this.selectedBrandList.length>0){
            data.brandId = [this.selectedBrandList[0].id]
        }
        switch (this.value1){
            case 1:{
                data.isNew = 1
            }
            case 2:{
                data.isRecommend = 1
            }
            case 3:{
                data.isPromotion = 1
            }
            default:{

            }
        }
        await axios({
            url: window.g.baseURL + apiUrls.goodsList,
            method: "post",
            data:data
        }).then((res:any)=>{
            console.log(res)
        })
    }
    check(item:any,index:number,isBrand:boolean){
        if(isBrand){
            if(this.selectedBrandList.length === 0){
                this.selectedBrandList[0] = item
                this.activebrand = index
            }else{
                if(this.selectedBrandList[0].id === item.id){
                    this.selectedBrandList = []
                    this.activebrand = -1
                }else{
                    this.selectedBrandList[0] = item
                    this.activebrand = index
                }
            }    
        }else{
            if(this.selectedCategoryList.length === 0){
                this.selectedCategoryList[0] = item
                this.activeCategrory = index
                this.getBrandList()
            }else{
                if(this.selectedCategoryList[0].id === item.id){
                    this.brandList = []
                    this.selectedCategoryList = []
                    this.selectedBrandList = []
                    this.activeCategrory = -1
                    this.activebrand = -1
                }else{
                    this.selectedCategoryList[0] = item
                    this.activeCategrory = index
                    this.getBrandList()
                }
            }
        }
        
    }
    async getBrandList(){
        Toast.loading({
            duration: 10000,
            loadingType: "circular"
        })
        let data: object = {
            categoryId: this.selectedCategoryList[0].id,
            dealerId: this.identity.dealerId,
            retailerRelationId: this.identity.retailerRelationId
        }
        await axios({
            url: window.g.baseURL + apiUrls.brandList,
            method: "post",
            data:data
        }).then((res:any)=>{
            Toast.clear()
            this.brandList = res.data.data
        })
    }
    onReset(){
        console.log(111)
    }
    openMenu(){
        this.getCategoryList()
    }
}
</script>
<style lang="scss">
.goodList{
    width: 100%;
    height: 100%;
    overflow: scroll;
    position: relative;
    .searchArea{
        position: sticky;
        top: 0;
        .confirmOrReset{
            position: sticky;bottom:0;
            &>button{
                border: none;
                width: 50%;
                height: 50px;
                line-height: 50px;
                background: #fff;
                color: #000;
                border-radius: 0;
            }
        }
        .selectTab{
            width: 100%;
            height: auto;
            .priceInput{
                display: flex;
                height: 50px;
                border-bottom: 1px solid #eee;
                line-height: 50px;
                padding: 0 20px;
                position: relative;
                .inputStyle{
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 100px;
                    height: 35px;
                    text-align: center;
                    background: #f5f5f5;
                    border-radius: 0;
                    box-shadow: none;
                    border: none;
                    line-height: 35px;
                }
                .inputStyle::placeholder{
                    line-height: 35px;
                    font-size: 14px;
                    text-align: center;
                }
            }
            .categrory{
                min-height: 100px;
                border-bottom: 1px solid #eee;
                padding: 20px;
                color: #000;
                font-size: 15px;
                &>div:last-child{
                    width: 300px;
                    margin: 0 auto;
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 10px;
                    .selectItem{
                        min-width: 60px;
                        font-size: 14px;
                        text-align: center;
                        line-height: 35px;
                        height: 35px;
                        background: #f7f8fa;
                        margin-left: 10px;
                        margin-top: 5px;
                    }
                    .active{
                        color: #ee0a24;
                        background: #FEE7E9;
                    }

                }
            }
        }
    }
}
</style>