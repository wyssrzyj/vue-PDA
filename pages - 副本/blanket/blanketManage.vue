<template>
	<view class="tabBox">
		<view class="tabBoxItem">
			<view class="text">
				铺布数据采集
			</view>
			<view class="factoryAccess">
				<view v-for="(item, index) in blanketDataList" :key="index" @tap="toList(item)" class="factoryAccessItem">
					<image :src="item.src" class="image"></image>
					<text class="titleItem">{{ item.title }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { blanketDataList } from '../../utils/common.js';

export default {
	name: 'blanketManage',
	data() {
		return {
			blanketDataList: blanketDataList
		}
	},
	methods: {
		toList(item) {
			uni.navigateTo({
				url: item.link
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.tabBox {
	padding: 30rpx 20rpx;
	.tabBoxItem{
		height: 330rpx;
		.text{
			font-size: 40rpx;
			margin: 10rpx 0;
			font-weight: 900;
		}
		.factoryAccess{
			display: flex;
			justify-content: space-between;
			.factoryAccessItem{
				width: 225rpx;
				height: 225rpx;
				background-color: #ecf7fc;
				border-radius: 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				font-weight: 600;
				font-size: 30rpx;
				.image{
					width: 113rpx;
					height: 113rpx;
					margin-bottom: 10rpx;
				}
				.titleItem {
					font-size: 25rpx;
					font-weight: 500;
				}
			}
		}
	}
}
</style>
