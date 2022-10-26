<template>
	<view class="list">
		<view class="list-header">
			<view class="list-header-input">
				<u--input placeholder="输入搜索" prefixIcon="search" prefixIconStyle="font-size: 44rpx;color: #909399"
					suffixIcon="scan" suffixIconStyle="font-size: 44rpx;color: #909399" v-model="keyWord" fontSize="28rpx" :clearable="true">
				</u--input>
			</view>
			<view class="list-header-text" @click="query()">
				搜索
			</view>
			<view style="width: 1px; height: 50rpx; background-color: #fff;"></view>
			<view @click="queryReceipt" class="scan-icon">
				<uni-icons type="scan" size="30" color="#fff"></uni-icons>
				<text>收货</text>
			</view>
		</view>
		<view class="list-list">
			<view style="margin-bottom: 16rpx;height: 100%;" v-for="item in allList" :key="item.billNo">
				<view class="header">
					<view class="header-image">
						<image
							:src="item.productionInfo?getimage(item.productionInfo):'../../static/qualityTesting/default.png'"
							class="image" @click="bigimage(item)"></image>
						<view :class="billStateColor(item.billState)" style="font-size: 32rpx;">
							{{getbillState(item.billState)}}
						</view>
					</view>
					<view class="header-title">
						<view class="title" style="display: flex;align-items: center;">
							<view class="">
								单号：{{item.billNo}}
							</view>
							<view style="position: absolute;right: 40rpx;" @click="handleShow(item)">
								<u-icon name="plus-circle" color="#59b7ff" size="44"></u-icon>
								<view style="background-color: #3c9cff;position: absolute;right: -30rpx;top: 40rpx;"
									v-if="item.show">
									<view @click="outsourcingReceiptindex(item)" class="button">
										<view>外协收货</view>
									</view>
									<u-line dashed></u-line>
									<view @click="outsourcingReceiptList(item)" class="button">
										<view>收货列表</view>
									</view>
									<u-line dashed></u-line>
									<view @click="updateOutsourcing(item)" class="button">
										<view>修改</view>
									</view>
								</view>
							</view>
						</view>
						<view class="header-grid-alllist">
							<view class="header-grid-all-list">
								<view class="name" style="width: 96rpx;">生产单：</view>
								<view class="code" style="margin-top: 5rpx;">{{item.productionInfo.productOrderNum}}</view>
							</view>
							<view class="header-grid-all-list">
								<view class="name">类型：</view>
								<view class="code">{{getDictLabel($store.state.dicts,'outsourcing_type',item.billType)}}</view>
							</view>
							<view class="header-grid-all-list">
								<view class="name">工厂：</view>
								<view class="code">{{item.customerName}}</view>
							</view>
							<view class="header-grid-all-list">
								<view class="name">添加：</view>
								<view class="code" style="margin-top: 5rpx;">
									{{item.createDate?datechange(item.createDate):''}}</view>
							</view>
							<view class="header-grid-all-list">
								<view class="name">交期：</view>
								<view class="code" style="margin-top: 5rpx;">
									{{item.deliverTime?datechange(item.deliverTime):''}}</view>
							</view>
							<view class="header-grid-all-list">
								<view class="name">完成：</view>
								<view class="code" style="margin-top: 5rpx;">
									{{item.completeTime?datechange(item.completeTime):''}}</view>
							</view>
							<view class="header-grid-all-list">
								<view class="name">数量：</view>
								<view class="code" style="display: flex;align-items: center;margin-top: 5rpx;">
									<view>{{item.num}}</view>
									<view v-if="item.existDetail!==0"
										style="display: flex;margin-left: 10rpx;font-size: 12px;color: #0c99f2;margin-bottom: 3rpx;"
										@click="downup(item.detailMap,item.id)">
										<text style="margin-right: 8rpx;font-size: 24rpx;">明细</text>
										<u-icon v-if="item.show1" name="arrow-up" size="24rpx" :bold="true"
											color="#0c99f2">
										</u-icon>
										<u-icon v-else name="arrow-down" size="24rpx" :bold="true" color="#0c99f2">
										</u-icon>
									</view>
								</view>
							</view>
							<view class="header-grid-all-list">
								<view class="name">收货：</view>
								<view class="code" style="margin-top: 5rpx;">{{item.receiveNum}}</view>
							</view>
						</view>
					</view>
				</view>
				<scan-code></scan-code>
				<view class="nav-table" v-if="item.show1">
					<uni-table border emptyText="暂无更多数据">
						<!-- 表头行 -->
						<uni-tr>
							<uni-th align="center" width="100px">颜色＼尺码</uni-th>
							<uni-th align="center" v-for="(item, index) in processData" :key="index">{{item.size}}
							</uni-th>
							<uni-th align="center">小计</uni-th>
						</uni-tr>
						<!-- 表格数据行 -->
						<uni-tr v-for="(item, index) in tableData" :key="index">
							<uni-td align="center">{{item.name}}</uni-td>
							<uni-td align="center" v-for="(i, index) in processData" :key="index">{{item[i.size]}}
							</uni-td>
							<uni-td align="center">{{allnum(item)}}</uni-td>
						</uni-tr>
					</uni-table>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		toasting
	} from '../../utils/index.js'
	import Api from '../../service/api'
	import { getDictLabel } from '../../utils/index.js'
	import scanCode from "../../components/scan/scan.vue"
	export default {
		components: {
			scanCode,
			toasting
		},

		data() {
			return {
				downupflag: false,
				productionid: '',
				allList: [],
				api: '',
				processData: [],
				tableData: [],
				page: 1,
				a: 0,
				keyWord:""
			}
		},
		onShow() {
			const _this = this
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器  
			uni.$on('scancodedate', (data) => {
				const {
					code
				} = data
				_this.productionid = code
				_this.getData(code, 1)
			})
			_this.getData(this.keyWord)
			_this.api = uni.getStorageSync('pda-api')
		},
		// 底部加载
		async onReachBottom() {
			uni.showNavigationBarLoading()
			this.getData(this.keyWord);
			uni.hideNavigationBarLoading()
		},

		methods: {
			handleShow(item){
				this.allList.forEach(i=>{
					if(i.id===item.id){
						i.show=!i.show
					}else{
						i.show=false
					}
				})
			},
			getDictLabel,
			query() {
				this.getData(this.keyWord, 1)
			},
			queryReceipt(){
				uni.navigateTo({
					url:'/pages/outsourcingReceipt/outsourcingReceipt'
				})
			},
			// 查询 获取data
			getData(code, num) {
				if (num == 1) {
					this.page = 1
				}
				let obj = {
					limit: 10,
					page: this.page,
					keyWord:code ? code : '',
				}
				Api.outsourcingReceipt(obj).then(res => {
					if (res.code == 0) {
						const o_list = this.allList
						const {
							total,
							list
						} = res.data
						if (list.length == 0) {
							if (num == 1) {
								this.allList = []
							}
							toasting('暂无更多数据')
						} else {
							this.a++
							let new_list = list.map(item => {
								item.show = false
								item.show1 = false
								return item
							})
							if (this.a > 1 && num != 1) {
								this.allList = [...o_list, ...new_list]
								this.page = this.page + 1
							} else {
								this.allList = [...new_list]
								this.page = this.page + 1
							}
						}
					} else {
						toasting(res.msg)
					}
				})
			},
			// 时间截取
			datechange(time) {
				return time.slice(0, 10)
			},
			// 明细小标|表格
			downup(obj, id) {
				// 控制图表
				this.allList = this.allList.map(item => {
					if (item.id == id) {
						item.show1 = !item.show1
					} else {
						item.show1 = false
					}
					return item
				})
				// 表格
				this.downupflag = !this.downupflag
				this.tableData = []
				let processList = []
				for (let i in obj) {
					processList.push(...JSON.parse(JSON.stringify(obj[i])))
					let tempObj = {}
					this.processData = obj[i]
					for (let x of obj[i]) {
						tempObj.name = x.color
						tempObj[x.size] = x.num
					}
					this.tableData.push(tempObj)
				}
				// 小计
				let obj1 = {
					name: '小计'
				}
				let arr = processList.map((item) => {
					return item.size
				})
				arr.forEach((Item) => {
					obj1[Item] = 0
					processList.forEach(x => {
						if (x.size == Item) {
							obj1[Item] += Number(x.num)
						}
					})
				})
				this.tableData.push(obj1)
			},
			// 小计
			allnum(obj) {
				let sum = 0
				for (let i in obj) {
					if (i !== 'name') {
						sum += Number(obj[i])
					}
				}
				return sum
			},
			// 状态获取
			getbillState(obj) {
				return obj == 0 ? '外发中' : obj == 1 ? '部分收货' : obj == 2 ? '已完成' : ''
			},
			// 颜色
			billStateColor(obj) {
				return obj == 0 ? 'billStategreen' : obj == 1 ? 'billStateblue' : obj == 2 ? 'billStatered' : ''
			},
			// 图片
			getimage(obj) {
				const {
					image
				} = obj
				if (image == null) {
					return '../../static/qualityTesting/default.png'
				}
				// `http://${this.api}/upload${image.split('upload')[1]}`
				return image
			},
			// 查看图片
			bigimage(item) {
				let imagelist = []
				const {
					productionInfo
				} = item
				if (productionInfo) {
					const {
						image
					} = productionInfo
					if (image == null) {
						imagelist.push('../../static/qualityTesting/default.png')
					} else {
						imagelist.push(image)
					}
				} else {
					imagelist.push('../../static/qualityTesting/default.png')
				}
				uni.previewImage({
					urls: imagelist,
					current: '',
				})
			},
			// 外协收货跳转
			outsourcingReceiptindex(item) {
				uni.navigateTo({
					url: `./index?id=${item.billNo}`
				});
			},
			// 外协收货列表跳转
			outsourcingReceiptList(item) {
				uni.navigateTo({
					url: `./outsourcingReceiptList?productionId=${item.id}&id=${item.billNo}&existDetail=${item.existDetail}`
				});
			},
			// 外协收货列表跳转
			updateOutsourcing(item) {
				uni.navigateTo({
					url: `./outsourcingAdd?assistId=${item.id}&assistNO=${item.billNo}`
				});
			}
		}
	}
</script>

<style lang="scss">
	uni-view.u-input__content__subfix-icon {
		font-size: 40rpx !important;
	}
	.list {
		height: 100%;
		width: 100%;
		
		.list-header {
			width: 100%;
			height: 100%;
			display: flex;
			background-color: #0c99f2;
			color: white;
			align-items: center;
			justify-content: space-evenly;
			font-size: 34rpx;
			padding: 20rpx;
			margin-top: 1rpx;

			.list-header-input {
				width: 428rpx;
				// height: 80%;
				border-radius: 10rpx;
				background-color: white;
			}

			.list-header-text {
				padding: 0 20rpx;
				font-weight: bold;
			}
			.scan-icon{
				display: flex;
				align-items: center;
				font-weight: bold;
			}
		}

		.list-list {
			.header {
				width: 100%;
				padding: 20rpx;
				display: flex;
				background-color: white;

				.header-image {
					display: flex;
					flex-wrap: wrap;
					width: 160rpx;
					height: 160rpx;
					justify-content: center;

					.image {
						margin-bottom: 5rpx;
						width: 160rpx;
						height: 160rpx;
					}
				}

				.header-title {
					display: flex;
					flex-wrap: wrap;
					margin-left: 20rpx;

					.title {
						margin-top: 10rpx;
						height: 45rpx;
						width: 100%;
						font-size: 30rpx;
						font-weight: 600;
					}

					.header-grid-alllist {
						width: 100%;
						display: grid;
						grid-template-columns: repeat(2, 50%);


						.header-grid-all-list {
							display: flex;
							margin-top: 3rpx;
							font-size: 24rpx;
							align-items: center;

							.name {
								width: 72rpx;
							}

							.code {
								width: 160rpx;
								overflow: hidden;
								while-space: nowrap;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
					}
					.button {
						width: 200rpx;
						height: 74rpx;
						padding: 4rpx 10rpx;
						color: white;
						font-weight: normal;
						view{
							height: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
				}
			}
		}


		.billStatered {
			color: #e02020;
		}

		.billStateblue {
			color: #59b7ff;
		}

		.billStategreen {
			color: #85da29;
		}
	}
</style>
