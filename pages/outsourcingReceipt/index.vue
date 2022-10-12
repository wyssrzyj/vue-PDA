<template>
	<view class="">
		<view class="header">
			<view class="header-image">
				<image
					:src="productionInfoData.image?getimage(productionInfoData.image):'../../static/qualityTesting/default.png'"
					class="image" @click="bigimage(productionInfoData.image)"></image>
				<view style="display: flex;" @click="downup(list.detailMap)">
					<text style="margin-right: 8rpx;">详情</text>
					<u-icon v-if="downupflag" name="arrow-up" size="16px" :bold="true"></u-icon>
					<u-icon v-else name="arrow-down" size="16px" :bold="true"></u-icon>
				</view>
			</view>
			<view class="header-title">
				<view class="title">
					{{productionInfoData.proName}}
				</view>
				<view class="header-grid-alllist">
					<view class="header-grid-all-list">
						<view class="name">单号：</view>
						<view class="code">{{productionInfoData.productOrderNum}}</view>
					</view>
					<view class="header-grid-all-list">
						<view class="name">数量：</view>
						<view class="code">{{productionInfoData.sum}}</view>
					</view>
					<view class="header-grid-all-list">
						<view class="name">客号：</view>
						<view class="code">{{productionInfoData.customerId}}</view>
					</view>
					<view class="header-grid-all-list">
						<view class="name">客户：</view>
						<view class="code">{{productionInfoData.customerName}}</view>
					</view>
					<view class="header-grid-all-list">
						<view class="name">添加：</view>
						<view class="code">{{datechange(productionInfoData.createDate)}}</view>
					</view>
					<view class="header-grid-all-list">
						<view class="name">交期：</view>
						<view class="code">{{datechange(productionInfoData.deliverTime)}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="nav" v-if="downupflag">
			<view class="nav-title">
				<view class="title">
					外协信息
				</view>
				<view class="nav-grid-alllist">
					<view class="nav-grid-all-list">
						<view class="name">类型：</view>
						<view class="code">{{list.billType}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">工厂：</view>
						<view class="code">{{list.customerName}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">交期：</view>
						<view class="code">{{datechange(list.completeTime)}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">添加：</view>
						<view class="code">{{datechange(list.createDate)}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">单价：</view>
						<view class="code">{{list.unitPrice}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">数量：</view>
						<view class="code">{{list.num}}</view>
					</view>
				</view>
			</view>
			<view class="nav-table" v-if="list.existDetail==1">
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
		<view class="footer">
			<u--form ref="form" :labelStyle="{'font-size':'30rpx','font-weight': 600}">
				<u-form-item label="全部完成" borderBottom labelWidth="150">
					<switch class="switch" @change="change()" color="#2979ff !important" style="transform:scale(0.7)" />
				</u-form-item>
				<u-form-item label="收货数量" :required="true" borderBottom labelWidth="150" v-if="list.existDetail == 0">
					<u--input v-model="receiveNum" border="none" placeholder="请输入数量" type="number">
					</u--input>
					<view class="">{{list.unit}}</view>
				</u-form-item>
			</u--form>
			<view class="footer-table">
				<uni-table border emptyText="暂无更多数据" v-if="list.existDetail==1">
					<!-- 表头行 -->
					<uni-tr>
						<uni-th align="center" width="100px">颜色＼尺码</uni-th>
						<uni-th align="center" v-for="(item, index) in change_num==1?change_list.processData:processData1" :key="index">{{item.size}}
						</uni-th>
					</uni-tr>
					<!-- 表格数据行 -->
					<uni-tr v-for="(item, index) in change_num==1?change_list.tableData:tableData1" :key="index">
						<uni-td align="center">{{item.name}}</uni-td>
						<uni-td align="center" v-for="(i, index) in change_num==1?change_list.processData:processData1" :key="index">
							<view class="uni-group">
								<u--input v-model="item[i.size]" type="number" inputAlign="center" />
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>
		</view>
		<u-tabbar :fixed="true" :placeholder="true" :safeAreaInsetBottom="true">
			<view class="button">
				<view class="button-left">
					<u-button type="primary" text="保存并返回列表" @click="submit()"></u-button>
				</view>
			</view>
		</u-tabbar>

	</view>
</template>

<script>
	import {
		toasting
	} from '../../utils/index.js'
	import Api from '../../service/api'
	export default {
		components: {
			toasting
		},
		data() {
			return {
				receiveNum:0,
				num: null,
				id: '',
				productionInfoData: {},
				list: {},
				tableData: [],
				processData: [],
				tableData1: [],
				processData1: [],
				downupflag: false,
				switch_value: false,
				change_list:{},
				change_num:null
			}
		},
		onLoad(option) {
			const {
				id,
				num,
				item
			} = option
			this.change_list = item?JSON.parse(item):''
			if(num==1){
				this.change_list.tableData =this.change_list.tableData.splice(0,this.change_list.tableData.length-1)
				this.receiveNum = this.change_list.num
			}
			this.change_num = num
			this.getdata(id)
		},
		onShow() {
		},
		methods: {
			// 获取信息
			getdata(id) {
				Api.outsourcingReceiptassistinfo({
					assistNO: id
				}).then(res => {
					if (res.code !== 0) {
						toasting(res.msg)
						return
					}
					this.list = res.data
					this.productionInfoData = res.data.productionInfo
					this.downup1(this.list.detailMap)
				})
			},
			// 时间截取
			datechange(time) {
				return time ? time.slice(0, 10) : ''
			},
			// 图片
			getimage(image) {
				if (image == null) {
					return '../../static/qualityTesting/default.png'
				}
				return image
			},
			// 修改表格
			downup1(obj) {
				this.tableData1 = []
				for (let i in obj) {
					let tempObj = {}
					this.processData1 = obj[i]
					for (let x of obj[i]) {
						tempObj.name = x.color
						tempObj[x.size] = 0
					}
					this.tableData1.push(tempObj)
				}
			},
			// 详情表格
			downup(obj) {
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
			// 查看图片
			bigimage(image) {
				let imagelist = []
				if (image == null) {
					imagelist.push('../../static/qualityTesting/default.png')
				} else {
					imagelist.push(image)
				}
				uni.previewImage({
					urls: imagelist,
					current: '',
				})
			},
			change() {
				this.switch_value = !this.switch_value
			},
			submit() {
				this.list.receiveNum = this.receiveNum
				if (this.list.existDetail == 0) {
					if (!this.list.receiveNum) {
						uni.$u.toast('请输入收货数量')
						return
					}
				}else{
					this.list.receiveNum = 0
				}
				let arr = []
				for (let i in this.change_num==1?this.change_list.tableData:this.tableData1) {
					let new_list = {}
					var old_list = this.change_num==1?this.change_list.tableData[i]:this.tableData1[i]
					new_list.color = this.change_num==1?this.change_list.tableData[i].name:this.tableData1[i].name
					delete old_list.name
					for (let x of this.change_num==1?this.change_list.processData:this.processData1) {
						old_list[x.size] = Number(old_list[x.size])
					}
					new_list.qtyFinalList = old_list
					arr.push(new_list)
				}
				let obj = {
					"assistId": this.list.id,
					"completeFlag": this.switch_value?1:0,
					"detailList": arr,
					"existDetail": this.list.existDetail,
					"id": this.change_num==1?this.change_list.id:'',
					"num": Number(this.list.receiveNum)
				}
				// 编辑
				if(this.change_num==1) {
					Api.outsourcingReceiptreceiveUpdate(obj).then(res => {
						if (res.code !== 0) {
							toasting(res.msg)
							return
						}
						toasting('编辑成功')
						uni.navigateTo({
							url: './orderList'
						});
					})
					return
				}
				// 保存
				Api.outsourcingReceiptreceiveSave(obj).then(res => {
					if (res.code !== 0) {
						toasting(res.msg)
						this.downup1(this.list.detailMap)
						return
					}
					toasting('保存成功')
					uni.navigateTo({
						url: './orderList'
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.switch::before {
		color: #8799a3 !important;
		z-index: unset !important;
	}

	page {
		padding: 0;
		margin: 0;
		width: 100vw;
		height: 100%;
	}

	.header {
		width: 100vw;
		height: 18%;
		padding: 20rpx;
		display: flex;
		background-color: white;

		.header-image {
			width: 160rpx;
			height: 160rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;

			.image {
				margin-bottom: 3rpx;
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
				width: 200rpx;
				font-size: 30rpx;
				font-weight: 600;
			}

			.header-grid-alllist {
				width: 100%;
				display: grid;
				grid-template-columns: repeat(2, 50%);

				.header-grid-all-list {
					display: flex;
					margin-top: 6rpx;
					align-items: center;

					.name {
						width: 90rpx;
					}

					.code {
						width: 150rpx;
						overflow: hidden;
						while-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}
	}

	.nav {
		margin-top: 20rpx;
		width: 100vw;
		padding: 10rpx;
		display: flex;
		flex-wrap: wrap;
		background-color: white;

		.nav-title {
			display: flex;
			flex-wrap: wrap;
			margin-left: 20rpx;

			.title {
				margin-top: 10rpx;
				height: 45rpx;
				width: 200rpx;
				font-size: 30rpx;
				font-weight: 600;
			}

			.nav-grid-alllist {
				width: 100%;
				display: grid;
				grid-template-columns: repeat(2, 50%);

				.nav-grid-all-list {
					display: flex;
					margin-top: 6rpx;
					align-items: center;

					.name {
						width: 75rpx;
					}

					.code {
						width: 200rpx;
						overflow: hidden;
						while-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}

		.nav-table {
			padding: 0;
			margin: 0;
			width: 100%;
			margin-top: 10rpx;
		}
	}

	.footer {
		height: 100%;
		margin: 30rpx 0;
		width: 100%;
		padding: 20rpx;
		background-color: white;
	}

	.button {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
</style>
