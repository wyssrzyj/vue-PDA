<template>
	<view class="main" v-if="showSelect">
		<view class="mask" @touchmove.stop.prevent="()=>{}" @click="maskClick"></view>
		<view class="select">
			<view class="uni-list">例：192.168.99.140:8081</view>
			<input type="text" v-model="api" class="input" placeholder="请选择或输入环境地址">
			<button @click="query" class="btn">确定</button>
		</view>
	</view>
</template>

<script>
import {changeApi} from '../../service/api'
export default{
	data() {
		return {
			showSelect:false,
			api:''
		}
	},
	mounted() {
		this.api = uni.getStorageSync('pda-api') || ''
		changeApi(this.api)
	},
	methods:{
		maskClick(){
			this.api = uni.getStorageSync('pda-api') || ''
			this.showSelect = false
		},
		query(){
			uni.setStorageSync('pda-api', this.api)
			changeApi(this.api)
			this.showSelect = false
			uni.showToast({
				title:'修改成功！',
				icon:'success'
			})
		}
	}
}
</script>

<style lang="less">
.select{
	z-index: 2;
	background-color: #FFFFFF;
	width: 500rpx;
	border-radius: 20rpx;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.uni-list{
    font-size: 32rpx;
    line-height: 80rpx;
    text-align: center;
    color: #aaa;
}
.mask {
	z-index: 1;
	position: fixed;
	top: 0;
	left:0;
	right: 0;
	bottom: 0;
	background-color: rgba(0,0,0, 0.6);
}
.input{
	margin-top: 20rpx;
	width: 100%;
	height: 100rpx;
	background-color: #eee;
	text-align: center;
}
.btn{
	width: 100%;
	height:100rpx;
	background-color: #0c99f2;
	margin: 10rpx 0;
	font-size: 40rpx;
	color: #FFFFFF;
	line-height: 100rpx;
	border-radius: 50rpx;
}
</style>
