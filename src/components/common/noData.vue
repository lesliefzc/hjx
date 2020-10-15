<template>
    <div class="nodata">
        <div class="content">
            <img src="../../assets/images/noData.png" alt="">
            <p>暂无数据</p>
        </div>
    
    </div>
</template>

<style lang="scss" scoped>
.nodata{
    width: 100%;
    .content{
        margin-top: 100px;
        &>img{
            margin: 10px auto;
            display: block;
            width: 100px;
        }
        &>p{
            text-align: center;
        }
    }
    
}
</style>