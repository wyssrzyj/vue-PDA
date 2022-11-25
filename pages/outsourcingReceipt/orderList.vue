<template>
	<view class="list">
		<view class="list-header">
			<view class="list-header-input">
				<u--input placeholder="输入搜索" prefixIcon="search" prefixIconStyle="font-size: 44rpx;color: #909399"
					suffixIcon="scan" suffixIconStyle="font-size: 44rpx;color: #909399" v-model="key" fontSize="28rpx" :clearable="true">
				</u--input>
			</view>
			<view class="list-header-text" @click="query()">
				搜索
			</view>
			<view style="width: 1px; height: 50rpx; background-color: #fff;"></view>
			<view @click="queryReceipt" class="scan-icon">
				<u-icon name="scan" color="#fff" size="70" :bold="true"></u-icon>
				<text>收货</text>
			</view>
		</view>
		<view class="list-list" @click="handleClick">
			<view style="margin-bottom: 16rpx;height: 100%;" v-for="item in allList" :key="item.billNo">
				<view class="header">
					<view class="header-image">
						<image
							:src="item.productionInfo?getimage(item.productionInfo):'../../static/qualityTesting/default.png'"
							class="image" @click="goToIsComplete(item)">
						</image>
						<view :class="billStateColor(item.billState)" style="font-size: 32rpx;">
							{{getbillState(item.billState)}}
						</view>
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
					<view class="header-title">
						<view class="title" style="display: flex;align-items: center;">
							<view class="">
								<!-- 单号：{{item.billNo}} -->
								{{item.productionInfo.productOrderNum}}
							</view>
							<view style="position: absolute;right: 40rpx;" @click.stop="handleShow(item)">
								<u-icon name="plus-circle" color="#59b7ff" size="44"></u-icon>
								<view style="position: absolute;right: -30rpx;top: 40rpx;z-index:99"
									v-if="item.show">
									<view @click="outsourcingReceiptindex(item)" class="button">
										<view>外协收货</view>
									</view>
									<u-line dashed></u-line>
									<view @click="outsourcingReceiptList(item)" class="button">
										<view>收货列表</view>
									</view>
									<u-line dashed></u-line>
									<view @click="goToIsComplete(item)" class="button" v-if="item.existDetail===2">
										<view>外协齐料</view>
									</view>
									<view class="de-button" v-else>
										<view>外协齐料</view>
									</view>
									<u-line dashed></u-line>
									<view @click="updateOutsourcing(item)" class="button" v-if="item.existDetail===2&&item.receiveNum===0">
										<view>修改</view>
									</view>
									<view class="de-button" v-else>
										<view>修改</view>
									</view>
								</view>
							</view>
						</view>
						<view class="header-grid-alllist">
							<!-- <view class="header-grid-all-list">
								<view class="name">款号：</view>
								<view class="code">{{item.productionInfo.productOrderNum}}</view>
							</view> -->
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
								<view class="code">
									{{item.createDate?datechange(item.createDate):''}}</view>
							</view>
							<view class="header-grid-all-list">
								<view class="name">交期：</view>
								<view class="code">
									{{item.deliverTime?datechange(item.deliverTime):''}}</view>
							</view>
							<view class="header-grid-all-list">
								<view class="name">完成：</view>
								<view class="code">
									{{item.completeTime?datechange(item.completeTime):''}}</view>
							</view>
							<view class="header-grid-all-list">
								<view class="name">部位：</view>
								<view class="code">{{item.position}}</view>
							</view>
							<view class="header-grid-all-list">
								<view class="name">数量：</view>
								<view class="code" style="display: flex;align-items: center;">
									<view>{{item.num}}</view>
									
								</view>
							</view>
							<view class="header-grid-all-list">
								<view class="name">收货：</view>
								<view class="code">{{item.receiveNum}}</view>
							</view>
							<view class="header-grid-all-list" style="width: 100%;">
								<view class="name">单号：</view>
								<view>{{item.productionInfo.productOrderNum}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="nav-table" v-if="item.show1">
					<wyh-table :rightBorder="true" :items="tableData" :thList="processData"></wyh-table>
				</view>
			</view>
		</view>
		<scan-code></scan-code>
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
				processData: [], //表头数组
				tableData: [], //表身数组
				page: 1,
				a: 0,
				key:"",
			}
		},
		//设定扫码事件
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
			_this.getData(this.key)
			_this.api = uni.getStorageSync('pda-api')
		},
		// 底部加载
		async onReachBottom() {
			uni.showNavigationBarLoading()
			this.getData(this.key);
			uni.hideNavigationBarLoading()
		},
		methods: {
			//事件委托
			handleClick(){
				this.allList.forEach(i=>i.show=false)
			},
			//显示每一条数据菜单
			handleShow(item){
				this.allList.forEach(i=>{
					if(i.id===item.id){
						i.show=!i.show
					}else{
						i.show=false
					}
				})
			},
			//获取字典值
			getDictLabel,
			//列表页搜索
			query() {
				this.getData(this.key, 1)
			},
			//扫码收货
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
					key:code ? code : '',
				}
				//下一个修改的人也别看，我也是接手别人的
				Api.outsourcingReceipt(obj).then(res => {
					if (res.code == 0) {
						const o_list = this.allList
						const {
							total,
							list
						} = res.data
						if (list.length == 0) {
							// if (num == 1) {
							// 	this.allList = []
							// }
							toasting('暂无更多数据',()=>{},3000)
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
						toasting(res.msg,()=>{},3000)
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
				this.processData=[]
				let processList = []
				for (let i in obj) {
					processList.push(...JSON.parse(JSON.stringify(obj[i])))
					let tempObj = {}
					this.processData = obj[i]
					for (let x of obj[i]) {
						tempObj.name = x.color
						tempObj[x.size] = x.num
					}
					this.tableData.push({...tempObj,total:this.allnum(tempObj)})
				}
				this.processData=this.processData.map(i=>({...i,dataKey:i.size,text:i.size}))
				this.processData.unshift({dataKey:'name',text:'颜色\\尺码',fixed:true})
				this.processData.push({dataKey:'total',text:'小计'})
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
				this.tableData.push({...obj1,total:this.allnum(obj1)})
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
			// 跳转外协齐料列表
			goToIsComplete(item){
				if(item.existDetail===2){
					uni.navigateTo({
						url:`./outsourcingComplete?id=${item.id}`
					})
				}
			},
			// 外协收货跳转
			outsourcingReceiptindex(item) {
				uni.redirectTo({
					url: `./index?id=${item.billNo}`
				})
			},
			// 外协收货列表跳转
			outsourcingReceiptList(item) {
				uni.redirectTo({
					url: `./outsourcingReceiptList?productionId=${item.id}&id=${item.billNo}&existDetail=${item.existDetail}`
				})
			},
			// 外协收货列表跳转
			updateOutsourcing(item) {
				uni.redirectTo({
					url: `./outsourcingAdd?assistId=${item.id}&assistNO=${item.billNo}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	uni-view.u-input__content__subfix-icon {
		font-size: 40rpx !important;
	}
	.wyh_table{
		margin-top: 0;
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
			justify-content: space-between;
			font-size: 34rpx;
			padding: 20rpx;

			.list-header-input {
				width: 428rpx;
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
				width: 750rpx;
				padding: 20rpx;
				display: flex;
				background-color: white;

				.header-image {
					width: 160rpx;
					display: flex;
					flex-direction: column;
					align-items: center;

					.image {
						margin-bottom: 5rpx;
						width: 160rpx;
						height: 160rpx;
					}
				}

				.header-title {
					width: 570rpx;
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
						display: flex;
						flex-wrap: wrap;

						.header-grid-all-list {
							width: 50%;
							display: flex;
							flex-direction: row;
							margin-top: 3rpx;
							font-size: 24rpx;
							align-items: center;

							.name {
								color: #999;
								width: 72rpx;
							}

							.code {
								width: 160rpx;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}
						}
					}
					.button {
						width: 200rpx;
						height: 74rpx;
						padding: 4rpx 10rpx;
						color: white;
						font-weight: normal;
						background-color: #3c9cff;
						view{
							height: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
					.de-button{
						width: 200rpx;
						height: 74rpx;
						padding: 4rpx 10rpx;
						color: white;
						font-weight: normal;
						background-color: #ccc;
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
