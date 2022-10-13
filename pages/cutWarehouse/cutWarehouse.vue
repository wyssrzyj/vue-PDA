<template>
	<view class="tabBox">
		<view class="tabBoxItem">
			<view class="text">
				本厂出入
			</view>
			<view class="factoryAccess">
				<view v-for="(item, index) in cutWarehouseList" :key="index" @tap="toList(item)" class="factoryAccessItem">
					<image :src="item.src" class="image"></image>
					<text class="boxItemTitle">{{ item.title }}</text>
				</view>
			</view>
		</view>
		<view class="tabBoxItem">
			<view class="text">
				外发加工出入
			</view>
			<view class="factoryAccess outboundProcessing">
			<view v-for="(item, index) in outwardProcessingList" :key="index" class="factoryAccessItem " @tap="toList(item)">
				<image :src="item.src" class="image"></image>
				<text class="boxItemTitle">{{ item.title }}</text>
			</view>
			</view>
		</view>
		<view class="tabBoxItem">
			<view class="text">
				产量报工
			</view>
			<view class="factoryAccess outboundProcessing">
			<view v-for="(item, index) in workReportList" :key="index" class="factoryAccessItem " @tap="toList(item)">
				<image :src="item.src" class="image"></image>
				<text class="boxItemTitle">{{ item.title }}</text>
			</view>
			</view>
		</view>
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
		<view class="tabBoxItem">
			<view class="text">
				外协收货
			</view>
			<view class="factoryAccess outboundProcessing">
			<view v-for="(item, index) in outsourcingDataList" :key="index" class="factoryAccessItem " @tap="toList(item)">
				<image :src="item.src" class="image"></image>
				<text class="boxItemTitle">{{ item.title }}</text>
			</view>
			</view>
		</view>
	</view>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';
import { cutWarehouseList, outwardProcessingList,blanketDataList,workReportList,outsourcingDataList } from '../../utils/common.js';

export default defineComponent({
	name: 'cutWarehouse',
	setup() {
		const state = reactive({
			cutWarehouseList,
			outwardProcessingList,
			blanketDataList,
			workReportList,
			outsourcingDataList
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
				border-radius: 50rpx;
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
			}
		}
		.outboundProcessing{
			justify-content: flex-start;
			.factoryAccessItem{
				background-color:#f2f3f8;
			}
			.factoryAccessItem:nth-child(2){
				margin-left: 20rpx;
			}
		}
	}
}
</style>
