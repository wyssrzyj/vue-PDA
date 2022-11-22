<template>
	<view class="com-outsourcing">
		<view class="com-search">
			<view class="com-search-input">
				<u--input 
					placeholder="包号/颜色/尺码" 
					prefixIcon="search" 
					prefixIconStyle="font-size: 44rpx;color: #909399"
					v-model="dataForm.key"
					fontSize="28rpx" 
					:clearable="true">
				</u--input>
			</view>
			<view class="com-search-text" @click="getData">
				搜索
			</view>
		</view>
		<view class="com-nav">
			<view class="com-nav-title">
				<view class="com-title">
					外协信息
				</view>
				<view class="com-nav-grid-alllist">
					<view class="com-nav-grid-all-list">
						<view class="com-name">类型：</view>
						<view class="code">{{getDictLabel($store.state.dicts,'outsourcing_type',assistForm.billType)}}</view>
					</view>
					<view class="com-nav-grid-all-list">
						<view class="com-name">工厂：</view>
						<view class="com-code">{{assistForm.customerName}}</view>
					</view>
					<view class="com-nav-grid-all-list">
						<view class="com-name">交期：</view>
						<view class="com-code" style="margin-top: 6rpx;">{{assistForm.deliverTime}}</view>
					</view>
					<view class="com-nav-grid-all-list">
						<view class="com-name">添加：</view>
						<view class="com-code" style="margin-top: 6rpx;">{{assistForm.createDate}}</view>
					</view>
					<view class="com-nav-grid-all-list">
						<view class="com-name">数量：</view>
						<view class="com-code" style="margin-top: 6rpx;">{{assistForm.num}}</view>
					</view>
					<view class="com-nav-grid-all-list">
						<view class="com-name">部位：</view>
						<view class="com-code" style="margin-top: 6rpx;">{{assistForm.position}}</view>
					</view>
				</view>
			</view>
			<view class="com-nav-table">
				<wyh-table :rightBorder="true" :items="items" :thList="thList" @switch-change="handleSwitchChange"></wyh-table>
			</view>
		</view>
	</view>
</template>

<script>
	import { getDictLabel } from '@/utils/index.js'
	import Api from "@/service/api.js"
	export default{
		data(){
			return {
				dataForm:{
					key:"",
					assistId:""
				},
				items:[],
				thList:[],
				assistForm:{}
			}
		},
		 onLoad(option){
			 this.dataForm.assistId=option.id
			 this.getData()
		},
		methods:{
			getDictLabel,
			async getData(){
				const res=await Api.outsourcingComplete({...this.dataForm})
				this.assistForm=res.data.mesAssistDTO
				if(res.data.tableRow){
					this.items=res.data.tableRow.slice(1)
					this.thList=Object.keys(res.data.tableRow[0]).filter(i=>i!=='id').map(item=>{
						if(item==='color'||item==='packNum'){ //颜色和包好
							return {fixed:true,text:res.data.tableRow[0][item],dataKey:item,width:'150rpx'}
						}else if(item==='size'){ //尺码
							return {fixed:true,text:res.data.tableRow[0][item],dataKey:item,width:'180rpx'}
						}else if(item==='supportingOrNot'){ //已完成
							return {text:res.data.tableRow[0][item],dataKey:item,isSwitch:true,width:'180rpx'}
						}else{ //部位字段
							return {text:res.data.tableRow[0][item],dataKey:item,isColor:true,width:'150rpx'}
						}
					})
				}else{
					this.items=[]
				}
			},
			async handleSwitchChange(item,th){
				const res=await Api.outsourcingManualComplete({assistBarCodeId:item.id})
				await this.getData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.com-outsourcing{
		.com-search {
			width: 100%;
			height: 100%;
			display: flex;
			background-color: $theme-color;
			border-top: 1px solid #fff;
			color: white;
			align-items: center;
			justify-content: space-between;
			font-size: 34rpx;
			padding: 20rpx;
		
			.com-search-input {
				width: 606rpx;
				border-radius: 10rpx;
				background-color: white;
			}
			.com-search-text {
				padding: 0 20rpx;
				font-weight: bold;
			}
		}
		.com-nav {
			width: 100vw;
			padding: 10rpx;
			display: flex;
			flex-wrap: wrap;
			background-color: white;
		
			.com-nav-title {
				display: flex;
				flex-wrap: wrap;
				margin-left: 20rpx;
		
				.com-title {
					margin-top: 10rpx;
					height: 45rpx;
					width: 200rpx;
					font-size: 30rpx;
					font-weight: bold;
				}
		
				.com-nav-grid-alllist {
					width: 100%;
					display: flex;
					flex-wrap: wrap;
		
					.com-nav-grid-all-list {
						width: 50%;
						display: flex;
						margin-top: 6rpx;
						align-items: center;
						.com-name {
							color: #999;
							width: 84rpx;
						}
						.com-code {
							width: 200rpx;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}
					}
				}
			}
			.com-nav-table {
				padding: 0;
				margin: 0;
				width: 100%;
				margin-top: 10rpx;
			}
		}
	}
</style>