<template>
  <div class="commonHeader">
    <van-nav-bar
        :title="title"
        :left-text="leftText"
        :right-text="rightText"
        :left-arrow="arrow"
        :fixed="fixed"
        @click-left="clickLeft"
    >

    </van-nav-bar>
  </div>
</template>
<script lang="ts">
declare function require(img: string): string
import { Component, Vue } from 'vue-property-decorator';
import {NavBar} from 'vant'
@Component({
  components: {
      [NavBar.name]: NavBar
  },
  props:{
        title:{
            type: String,
            default: ""
        },
        leftText:{
            type: String,
            default: ""
        },
        rightText:{
            type: String,
            default: ""
        },
        arrow:{
            type: Boolean,
            default: false
        },
        fixed:{
            type: Boolean,
            default: true
        }
    }
})
export default class dailyData extends Vue {
    clickLeft(){
        
    }
}
</script>
<style lang="scss" scoped>

</style>