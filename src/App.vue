<template>
  <div id="app">
    <router-view/>
    <!-- <van-button>222</van-button> -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
// import { Row, Col, Icon, Cell, CellGroup,Button } from 'vant';

export default Vue.extend({
  components: {
    // [Button.name]: Button,
    // [Col.name]: Col,
    // [Icon.name]: Icon,
    // [Cell.name]: Cell,
    // [CellGroup.name]: CellGroup,
  },
});
</script>
<style lang="scss">
@import url('./assets/scss/app/index.scss');
@import url('./assets/scss/app/vantModify.scss');
#app{
  width: 100%;
  height: 100%;
}
html,body{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
body{
  font-size: 16px!important;
}
#app{
  margin: 0;
  padding: 0;
}

</style>
