<template>
 <div class="goodList">
    <div class="goodsItem" v-for="(item,index) in dataList" :key="index">
        <div class="imageArea">
            <img src="../../assets/images/swipe2.jpg" alt="">
        </div>
        <div class="goodsIntroduction">
            <p>{{item.goodsName}}</p>
            <p>{{item.desc}}</p>
        </div>
    </div>
</div>
</template>
<script lang="ts">
declare function require(img: string): string
import { Component, Vue } from 'vue-property-decorator';
@Component({
  components: {
      
  },
  props:{
        dataList: {
            type: Array,
            default: []
        }
    }
})
export default class dailyData extends Vue {
    
}
</script>
<style lang="scss" scoped>
.goodList{
    .goodsItem{
        width: 100%;
        height: 120px;
        border-top: 1px solid #eee;
        display: flex;
        padding: 0 10px;
        box-sizing: border-box;
        position: relative;
        justify-content: space-between;
        img{
            display: block;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            width: 100px;
            height: 100px;
        }
        .goodsIntroduction{
            padding: 20px 0;
            width: 65%;
            font-size: 14px;
            &>p:nth-of-type(1){
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-bottom: 10px;
            }
            &>p:nth-of-type(2){
                color: #999;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
            }
        }
    }
}
</style>