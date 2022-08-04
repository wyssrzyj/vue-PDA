<template>
	<view class="tabBox">
		<view class="tabBoxItem" v-if="checkPermission($store.state.permissions,'mes:mespiecesmarket:cutInStorage')||
		checkPermission($store.state.permissions,'mes:mespiecesmarket:repealCutInStorage')||
		checkPermission($store.state.permissions,'mes:mespiecesmarket:cutOutStorage')
		">
			<view class="text">
				本厂出入
			</view>
			<view class="factoryAccess">
				<view v-for="(item, index) in cutWarehouseList" :key="index" @tap="toList(item)" >
					<view class="factoryAccessItem" v-if="checkPermission($store.state.permissions,item.permissions)">
						<image :src="item.src" class="image"></image>
						<text class="boxItemTitle">{{ item.title }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="tabBoxItem" v-if="checkPermission($store.state.permissions,'mes:mespiecesmarket:outsourcingReceipt')||checkPermission($store.state.permissions,'mes:mespiecesmarket:outsourcingDelivery')">
			<view class="text">
				外发加工出入
			</view>
			<view class="factoryAccess outboundProcessing" >
			<view v-for="(item, index) in outwardProcessingList" :key="index"  @tap="toList(item)">
				<view class="factoryAccessItem " v-if="checkPermission($store.state.permissions,item.permissions)">
					<image :src="item.src" class="image"></image>
					<text class="boxItemTitle">{{ item.title }}</text>
				</view>
			</view>
			</view>
		</view>
		<view class="tabBoxItem" v-if="checkPermission($store.state.permissions,'mes:mesengineeringmanagement:workReport')">
			<view class="text">
				产量报工
			</view>
			<view class="factoryAccess workReport">
			<view v-for="(item, index) in workReportList" :key="index"  @tap="toList(item)">
				<view class="factoryAccessItem " >
					<image :src="item.src" class="image"></image>
					<text class="boxItemTitle">{{ item.title }}</text>
				</view>
			</view>
			</view>
		</view>
		<view class="tabBoxItem" v-if="checkPermission($store.state.permissions,'mes:messpreadcloth:blanketDataCollect')">
			<view class="text">
				铺布数据采集
			</view>
			<view class="factoryAccess blanket" >
				<view v-for="(item, index) in blanketDataList" :key="index" @tap="toList(item)" >
					<view class="factoryAccessItem" >
						<image :src="item.src" class="image"></image>
						<text class="titleItem">{{ item.title }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { cutWarehouseList, outwardProcessingList,blanketDataList,workReportList,ch } from '../../utils/common.js';
import { checkPermission } from '../../utils/index.js'

export default{
	// name: 'cutWarehouse',
	data(){
		return{
			cutWarehouseList,
			outwardProcessingList,
			blanketDataList,
			workReportList,
			checkPermission
		}
	},
	methods:{
		toList(item){
				uni.navigateTo({
					url: item.link
				});
			}
	}
}
</script>

<style lang="scss" scoped>
.tabBox {
	padding: 54rpx 45rpx 0 45rpx;
	background-color: #FFFFFF;
	.tabBoxItem{
		height: 510rpx;
		.text{
			font-size: 54rpx;
			margin-bottom: 45rpx;
			font-weight: 600;
		}
		.factoryAccess{
			display: flex;
			justify-content: flex-start;
			.factoryAccessItem{
				width: 300rpx;
				height: 300rpx;
				background-color: #ecf7fc;
				border-radius: 35rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				font-weight: 600;
				font-size: 45rpx;
				margin-right: 45rpx;
				.image{
					width: 135rpx;
					height: 135rpx;
					margin-bottom: 22.5rpx;
				}
				.boxItemTitle{
					font-family: AlibabaPuHuiTiM;
					font-size: 45rpx;
					color: #333333;
					text-align: center;
					line-height: 24px;
				}
			}
		}
		.outboundProcessing{
			justify-content: flex-start;
			.factoryAccessItem{
				background-color:#ecf8f3;
			}
		}
		.workReport{
			justify-content: flex-start;
			.factoryAccessItem{
				background-color:#fef7e4;
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
