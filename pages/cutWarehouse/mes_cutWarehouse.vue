<template>
	<view class="tabBox" :style="bodyStyle">
		<view v-for="item in houseList" :key="item.title">
			<view class="tabBoxItem" v-if="checkPermission($store.state.permissions, item.permissions)">
				<view class="text">{{item.name}}</view>
				<view class="factoryAccess blanket" >
					<view v-for="(i, index) in item.list" :key="index" @tap="toList(i)" >
						<view class="factoryAccessItem" v-if="checkPermission($store.state.permissions, i.permissions)" :style="{backgroundColor: i.backgroundColor}">
							<image :src="i.src" class="image"></image>
							<text class="titleItem">{{ i.title }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { houseList} from '../../utils/common.js';
import { checkPermission } from '../../utils/index.js'

export default{
	data(){
		return{
			houseList,
			checkPermission
		}
	},
	computed:{
		bodyStyle(){
			return {'min-height':`calc(100vh - ${uni.getSystemInfoSync().windowTop * 2}rpx)`}
		}
	},
	methods:{
		toList(item){
			// console.log( item.link);
			uni.navigateTo({
				url: item.link
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.tabBox {
	box-sizing: border-box;
	// min-height: calc(100vh - 88rpx);
	padding: 36rpx 30rpx 0 30rpx;
	background-color: #FFFFFF;
	.tabBoxItem{
		height: 340rpx;
		.text{
			font-size: 36rpx;
			margin-bottom: 30rpx;
			font-weight: 600;
		}
		.factoryAccess{
			display: flex;
			justify-content: space-between;
			.factoryAccessItem{
				width: 200rpx;
				height: 200rpx;
				background-color: #ecf7fc;
				border-radius: 28rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				font-weight: 600;
				font-size: 30rpx;
				margin-right: 30rpx;
				.image{
					width: 100rpx;
					height: 100rpx;
					margin-bottom: 15rpx;
				}
				.boxItemTitle{
					font-family: AlibabaPuHuiTiM;
					font-size: 30rpx;
					color: #333333;
					text-align: center;
					line-height: 16px;
				}
			}
		}
		.blanket{
			justify-content: flex-start;
			.factoryAccessItem{
				background-color:#ecf2ff;
			}
		}
	}
}
</style>
