<template>
	<view class="tabBox">
		<view v-for="(item, index) in list" :key="index" :class="[index % 2 ? '' : 'addRightMargin', 'boxItem']" @tap="toList(item)" :style="{ background: item.color }">
			<image :src="item.src" class="image"></image>
			<text class="boxItemTitle">{{ item.title }}</text>
		</view>
	</view>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';
import { cutWarehouseList } from '../../utils/common.js';

export default defineComponent({
	name: 'cutWarehouse',
	setup() {
		const state = reactive({
			list: cutWarehouseList
		})
		
		const toList = (item) =>{
			uni.navigateTo({
				url: item.link
			});
		}
		
		return {
			...toRefs(state),
			toList
		}
	}
})
</script>

<style lang="scss" scoped>
.tabBox {
	width: 90%;
	display: flex;
	flex-wrap: wrap;
	margin: 30rpx auto;
	.boxItem {
		width: 47%;
		height: 175rpx;
		border-radius: 16rpx;
		padding: 30rpx 20rpx;
		color: #fff;
		margin-bottom: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.image {
			width: 120rpx;
			height: 100rpx;
		}
		.boxItemTitle {
			font-family: Helvetica-Bold;
			font-size: 17px;
			color: #fff;
		}
	}
}

.addRightMargin {
	margin-right: 30rpx;
}
</style>
