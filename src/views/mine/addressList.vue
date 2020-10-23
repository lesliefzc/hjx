<template>
    <div class="addressList" ref="addressList">
        <van-nav-bar title="地址列表" @click-left="back" left-arrow />
        <van-address-list
            v-model="chosenAddressId"
            :list="list"
            default-tag-text="默认"
            @add="onAdd"
            @edit="onEdit"
            @select="onSelect"
        />
        <van-popup v-model="addOrEditShow" position="bottom" style="height:90%;">
            <van-address-edit
                :area-list="areaList"
                :address-info="addressInfo"
                show-delete
                show-set-default
                :area-columns-placeholder="['请选择', '请选择', '请选择']"
                @save="onSave"
                @delete="onDelete"
              
            />
        </van-popup>
    </div>
</template>
<script lang="ts">
declare function require(img: string): string
import { Component, Vue } from 'vue-property-decorator';
import {AddressList ,NavBar,Popup,AddressEdit } from 'vant'
import * as apiUrls from '../../utils/apiUrl'
import back from '../../mixin/back'
import area from '../../assets/js/area'
@Component({
  components: {
    [AddressList .name]: AddressList,
    [NavBar .name]: NavBar,
    [Popup .name]: Popup,
    [AddressEdit .name]: AddressEdit,
  },
})
export default class dailyData extends back {
    private chosenAddressId: string = ""
    private identity: any = {}
    private list: any[] = []
    private addOrEditShow: boolean = false;
    private areaList: any = area
    private addressInfo: any = {}
    private isEdit: boolean = false
    created(){
        this.identity = JSON.parse(localStorage.getItem("identity") as string);
        this.getAddressList()
    }
    onSave(item:any){
        let data:any = {
            address: item.addressDetail,
            area: item.county,
            city: item.city,
            consignee: item.name,
            isDefault: item.isDefault?1:0,
            phone: item.tel,
            province: item.province,
            retailer: this.identity.retailerId,
            street: item.areaCode,
        }
        if(this.isEdit){
            data.id = item.id
            this.$httpsJson({
                url: apiUrls.modifyAddress,
                method: 'post',
                data:data
            }).then((res:any)=>{
                if(res.code === 200){
                    this.$toast("保存成功")
                }
            })
        }else{
            this.$httpsJson({
                url: apiUrls.addAddress,
                method: 'post',
                data:data
            }).then((res:any)=>{
                if(res.code === 200){
                    this.$toast("保存成功")
                }
            })
        }
        this.addOrEditShow = false;
        this.getAddressList()
    }
    onEdit(item:any){
        this.addOrEditShow = true
        this.isEdit = true
        this.addressInfo = {
            name: item.name,
            areaCode: item.acreCode,
            addressDetail: item.addressDetail,
            tel: item.tel,
            isDefault: item.isDefault,
            id: item.id
        }
    }
    onDelete(item:any){
        this.$https({
            url: apiUrls.removeAddress,
            method: 'post',
            data:{
                id: item.id
            }
        }).then((res:any)=>{
           if(res.code === 200){
               this.$toast("删除成功")
               this.addOrEditShow = false;
               this.getAddressList()
           }
        })
    }
    getAddressList(){
        this.list = []
        this.$https({
            url: apiUrls.getAddressList,
            method: 'post',
            data:{
                retailer: this.identity.retailerId
            }
        }).then((res:any)=>{
            res.data.forEach((ele:any,index:number) => {
                if(ele.isDefault){
                    this.chosenAddressId = ele.id
                }
                let data = {
                    id: ele.id,
                    name: ele.consignee,
                    tel: ele.phone,
                    address: ele.province+ele.city+ele.area+ele.address,
                    isDefault: ele.isDefault===1?true:false,
                    acreCode: ele.street,
                    addressDetail: ele.address
                }
                this.list.push(data)
            });
        })
    }
    onAdd(){
        this.addressInfo = {}
        this.addOrEditShow = true
    }
    onSelect(item:any){
        console.log(item)
         this.$https({
            url: apiUrls.setDefault,
            method: 'post',
            data:{
                retailer: this.identity.retailerId,
                id: item.id
            }
        }).then((res:any)=>{
           this.getAddressList()
        })
    }
}
</script>
<style lang="scss" scoped>
.addressList{
    
}
</style>