<template>
	<uni-popup ref="dialogPopup" background-color="#fff" @maskClick="closePopup">
		<view class="dialog-popup">
			<view class="dialog-header">
				<view class="header-title">提示</view>
				<view class="header-close" @click="closePopup">X</view>
			</view>
			<view class="dialog-info" v-if="infoList.length>0">
				<view class="info-title">工序报工数量不能超出包数量（{{infoList.length}}条数据）</view>
				<view class="info-list" v-for="item in infoList" :key="item.pcs">
					<view class="package-info">
						<view>床号：{{item.bedNum}}</view>
						<view>包号：{{item.packageNum}} </view>
						<view>颜色：{{item.colorName}}</view>
						<view>尺码：{{item.sizeCode}}</view>
					</view>
					<view class="other-info" v-for="i in item.processStr" :key="`${i.productName}-${i.employeeStr}`">
						<view>工序：{{i.productName}}</view>
						<view>人员：{{i.employeeStr}}</view>
					</view>
				</view>
			</view>
			<view class="dialog-bottom">
				<button class="dialog-btn clear" v-if="infoList.length>0" @click="handleClear">清空扫描</button>
				<button class="dialog-btn delete" v-if="infoList.length>0" @click="handleDelete">删除重复扎包</button>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			infoList: {
				type: Array,
				default: ()=>[]
			}
		},
		watch:{
			show(newValue,oldValue){
				if(newValue) this.$nextTick(() => this.$refs.dialogPopup.open())
			}
		},
		methods: {
			// 关闭返修车
			closePopup(){
				this.$emit('close')
				this.$refs.dialogPopup.close()
			},
			//清空扫描 
			handleClear(){
				this.$emit('clearPackage')
				this.closePopup() 
			},
			//删除重复扎包 
			handleDelete(){
				this.$emit('delPackage')
				this.closePopup()
			}
		}
	}
</script>

<style lang="less">
 /deep/ .uni-popup__wrapper {
	border-radius: 30rpx!important;
	overflow: hidden!important;
}
.dialog-popup{
	width: 55vw;
	height: 70vh;
	border-radius: 8rpx;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	position: relative;
	.dialog-header{
		height: 100rpx;
		padding: 0 30rpx;
		line-height: 100rpx;
		display: flex;
		justify-content: space-between;
		font-size: 42rpx;
		font-weight: bold;
		color: rgba(0,0,0,0.6);
	}
	.dialog-info{
		width: 100%;
		padding: 20rpx 40rpx;
		flex: 1;
		overflow: scroll;
		font-size: 32rpx;
		font-weight: bold;
		.info-title{
			color: #FF0E0E;
		}
		.info-list{
			.package-info{
				margin: 20rpx 0;
				padding: 0 40rpx;
				color: #409EFF;
				width: 100%;
				height: 140rpx;
				background-color: #E7F3FE;
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				view{
					flex: 50%;
				}
			}
			.other-info{
				color: #353535;
				display: flex;
				padding: 0 30rpx;
				line-height: 60rpx;
				view{
					margin-right: 80rpx;
				}
			}
		}
	}	
	.dialog-bottom{
		height: 100rpx;
		width: 100%;
		background: #F7F8FA;
		border-top: 1px solid #E6E6E6;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.dialog-btn{
			height: 70rpx;
			line-height: 70rpx;
			font-size: 32rpx;
			padding: 0 30rpx;
			margin: 0 30rpx 0 0;
		}
		.clear{
			border-color: #C9C9C9;
			color: #868686;
		}
		.delete{
			border-color: #409EFF;
			background-color: #409EFF;
			color: #FFFFFF;
		}
	}
}
</style>
