<template>
  <div class="dailyData">
     <div class="dataArea ">
        <div >
            <p>订货金额（元）</p>
            <p class="moneyRed">{{orderAmount}}</p>
        </div>
        <div >
            <p>订货量（笔）</p>
            <p>{{orderQuantity}}</p>
        </div>
    </div>
    <div class="dataArea">
        <div >
            <p>发货金额（元）</p>
            <p class="moneyRed">{{deliveryAmount}}</p>
        </div>
        <div>
            <p>发货量（笔）</p>
            <p>{{deliveryQuantity}}</p>
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
        orderAmount:{
            type: String,
            default: "0"
        },
        orderQuantity:{
            type: String,
            default: "0"
        },
        deliveryAmount:{
            type: String,
            default: "0"
        },
        deliveryQuantity:{
            type: String,
            default: "0"
        },
    }
})
export default class dailyData extends Vue {
    
}
</script>
<style lang="scss" scoped>
.dailyData{
    .dataArea{
        width: 100%;
        height: 60px;
        border-top: 1px solid #eee;
        padding: 0 20px;
        font-size: 14px;
        display: flex;
        &>div{
        display: flex;
            flex-direction: column;
            justify-content: space-around;
            width: 100%;
            text-align: center;
        }
    }
    .moneyRed{
        color: red;
    }
}
</style>