<template>
    <div class="goodList" >
        <van-nav-bar
            title="商品列表"
            ref="header"
            left-arrow
            @click-left="onClickLeft"
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
                        <div @click="getGoodsList(true)">搜索</div>
                    </template>
            </van-search>
            </div>
            <div class="searchSelect">
                <van-dropdown-menu>
                    <van-dropdown-item v-model="value1" @change="getGoodsList(true)" :options="option1" />
                    <van-dropdown-item v-model="value2" @change="getGoodsList(true)"  :options="option2" />
                    <van-dropdown-item  @open="openMenu" title="筛选" ref="dropDown">
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
                            <button @click="getGoodsList(true)" style="background:#ee0a24;color:#fff">确认</button>
                        </div>
                    </van-dropdown-item>
                </van-dropdown-menu>
            </div>
            <div class="goodsArea" :style="{height: offsetHeight+'px'}">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    :immediate-check= false 
                    @load="getGoodsList(false)"
                     v-if="goodsList.length!==0"
                >
                <div class="goodsItem" style="margin-bottom:5px;" v-for="(item,index) in goodsList" :key="index">
                    <van-card
                        @click="toGoodsDetail(item.goodsId,item.batchId)"
                        :tag="item.activityInfoList.length?'活动':''"
                        :thumb="item.sImg!==null?'http://www.topzh.net:16350'+item.sImg:require('../../assets/images/swipe2.jpg')"
                        :title="item.goodsName"
                        >
                        <div slot="price">
                            <p
                            class="supply-price"
                            v-if="priceType ==3 || priceType ==1"
                            >供货价：¥{{(item.price/100).toFixed(2)}}
                            <span
                                v-if="item.type == 2"
                                class="origin-price"
                            >￥{{(item.defaultPrice/100).toFixed(2)}}</span>
                            </p>
                            <p v-if="priceType ==4 || priceType ==1">零售价：¥{{(item.retailPrice/100).toFixed(2)}}</p>
                        </div>
 
                        <div slot="tags" style="margin: 10px 0;">
                            <van-tag plain v-if="item.isNew == 1" type="danger">新品</van-tag>
                            <van-tag plain v-if="item.isRecommend == 1" type="danger">推荐</van-tag>
                            <van-tag plain v-if="item.type != 1" type="danger">特销</van-tag>
                        </div>
                    </van-card>
                </div>
                </van-list>
                <noData v-else></noData>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
declare function require(img: string): string
import * as apiUrls from '../../utils/apiUrl'
import { Component, Vue ,Mixins} from 'vue-property-decorator';
import { NavBar,Search,Divider,Toast,DropdownMenu, DropdownItem,Field ,Cell ,CellGroup,Button,Card ,Tag ,List} from 'vant';
import * as utils from '../../utils/utils'
import noData from '../../components/common/noData.vue'
import back from '../../mixin/back'
@Component({
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Card.name]: Card,
    [Tag.name]: Tag,
    [List.name]: List,
    "noData": noData
  },

})
export default class goodList extends back{
    private loading: boolean = false;    //分页插件参数  loading 控制加载
    private finished: boolean = false;   //分页插件参数 为true代表加载完成不再触发函数
    private pageSize:number = 10     //每次请求页面的大小
    private pageNo:number = 1    //当前请求的页面
    private brandList: object[] = []    //品牌列表
    private priceType: any = ''    // 价格权限
    private categoryList: any[] = []    //品类列表
    private selectedCategoryList: any[] = []    //被选中的品类列表
    private selectedBrandList: any[] = []    //被选中的品牌列表
    private goodsList: any[] = []   //商品列表
    private identity:any = {}   //当前零售商身份信息
    private maxPrice:any = ""   //最大供货价格
    private maxRetailPrice:any = ""  //最大零售价格
    private minPrice:any = ""  //最小供货价格
    private minRetailPrice:any = "" //最小零售价格
    private offsetHeight:number = 0  //商品列表页面的长度
    private searchValue: string = ''   //搜索商品名称的参数
    private value1: number = 0   //所有，新品，推荐，特销参数
    private value2: number = 0  //控制价格排序的参数
    private activeCategrory: number = -1    //当前选中种类
    private activebrand: number = -1  //当前选中的品牌
    private option1: object[] = [   //下拉列表的数据
        { text: '所有', value: 0 },
        { text: '新品', value: 1 },
        { text: '推荐', value: 2 },
        { text: '特销', value: 3 },
    ]
    private option2: object[] = [    //下拉列表的数据
        { text: '综合', value: 0 },
        { text: '零售价格↓', value: 1 },
        { text: '零售价格↑', value: 2 },
        { text: '供货价格↓', value: 3 },
        { text: '供货价格↑', value: 4 },
    ]
    mounted(){
        this.identity = JSON.parse(localStorage.getItem("identity") as string);
        this.priceType = this.identity.priceType
        let el = this.$refs as any
        this.$nextTick(()=>{
            this.offsetHeight = document.documentElement.offsetHeight-(el.header.$el.offsetHeight+el.searchArea.offsetHeight)
        })
        if(this.$route.query.goodsName){   
            this.searchValue = this.$route.query.goodsName as string
        }
        if(this.$route.query.brandId){
            this.selectedBrandList = [{id:this.$route.query.brandId}]
        }
        if(this.$route.query.brandId){
            this.selectedCategoryList = [{id:this.$route.query.categoryId}]
        }
        
        this.getGoodsList(false);
    }

    async getGoodsList(isCondition:boolean){   //获取商品列表
        if(isCondition){   //控制是否为条件搜索而非加载下一页触发的操作，条件搜索则需把当前页面初始化，加载下一页则不需要
            this.pageNo = 1;
            this.goodsList = [];
            this.finished = false;
        }
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
            pageSize: this.pageSize,
            pageNo:this.pageNo,
            orderField: "ND"
        }
        if(this.selectedBrandList.length>0){  //奇怪后端，加这个参数为空报异常，这个参数为空不要传这个参数
            data.brandId = [this.selectedBrandList[0].id]
        }
        switch (this.value1){
            case 1:
                data.isNew = 1
                break;
            case 2:
                data.isRecommend = 1
                break;
            case 3:
                data.isPromotion = 1
                break;
            default:
                break;
        }
        switch (this.value2){
            case 1:
                data.orderField = "RPD"
                break;
            case 2:
                data.orderField = "RPA"
                break;
            case 3:
                data.orderField = "PD"
                break;
            case 4:
                data.orderField = "PA"
                break;
            default:
                break;
        }
        await this.$httpsJson({
            url: apiUrls.goodsList,
            method: "post",
            data:data
        }).then((res:any)=>{
            let el = this.$refs as any
            el.dropDown.toggle(false);
            if(res.data.list.length === 0){
                this.finished = true;
            }else{
                this.goodsList = this.goodsList.concat(res.data.list)
                this.loading = false;
                this.pageNo++
            }
            
        })
    }

    async getCategoryList(){   //获取种类列表
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

    check(item:any,index:number,isBrand:boolean){    //点击选中品牌品类函数
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
    async getBrandList(){   //获取品牌列表
        Toast.loading({
            duration: 10000,
            loadingType: "circular"
        })
        let data: object = {
            categoryId: this.selectedCategoryList[0].id,
            dealerId: this.identity.dealerId,
            retailerRelationId: this.identity.retailerRelationId
        }
        await this.$httpsJson({
            url: apiUrls.brandList,
            method: "post",
            data:data
        }).then((res:any)=>{
            Toast.clear()
            this.brandList = res.data
        })
    }
    onReset(){   //条件清空
        this.maxPrice = ""
        this.maxRetailPrice = ""
        this.minRetailPrice = ""
        this.minPrice = ""
        this.selectedCategoryList = []
        this.selectedBrandList = []
        this.brandList = []
        this.activeCategrory = -1
        this.activebrand = -1,
        this.pageNo = 1
    }
    openMenu(){ 
        this.getCategoryList()
    }
    toGoodsDetail(){

    }
    onClickLeft(){
       this.back()  //mixins混入的参数，返回
    }
}
</script>
<style lang="scss">
.goodList{
    width: 100%;
    height: 100%;
    overflow: scroll;
    position: relative;
    .goodsArea{
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }
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