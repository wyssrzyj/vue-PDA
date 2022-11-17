<template>
	<view class="">
		<view class="nav">
			<view class="nav-title">
				<view class="title">
					外协信息
				</view>
				<view class="nav-grid-alllist">
					<view class="nav-grid-all-list">
						<view class="name">类型：</view>
						<view class="code">{{getDictLabel($store.state.dicts,'outsourcing_type',list.billType)}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">工厂：</view>
						<view class="code">{{list.customerName}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">交期：</view>
						<view class="code" style="margin-top: 6rpx;">{{datechange(list.deliverTime||'')}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">添加：</view>
						<view class="code" style="margin-top: 6rpx;">{{datechange(list.createDate||'')}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">数量：</view>
						<view class="code" style="margin-top: 6rpx;">{{list.num}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">部位：</view>
						<view class="code" style="margin-top: 6rpx;">{{list.position}}</view>
					</view>
				</view>
			</view>
			<view class="nav-table" v-if="list.existDetail==1">
				<wyh-table :rightBorder="true" :items="tableData" :thList="processData"></wyh-table>
			</view>
		</view>
		<!-- 列表 -->
		<view v-if="arrlist.length>0">
			<view class="nav" style="margin-top: 20rpx;" v-for="(item,index) in arrlist" :key="index">
				<view class="nav-title">
					<view class="title" style="display: flex;align-items: center;">
						<view class="">
							{{datechange(item.createDate||'')}}
						</view>
						<view class="change" @click="changelist(item)">
							<uni-icons type="compose" size="20" style="color: #aaa;"></uni-icons>
						</view>
					</view>
					<view class="nav-grid-alllist">
						<view class="nav-grid-all-list">
							<view class="name" style="width: 110rpx;">收货人：</view>
							<view class="code">{{item.updaterName}}</view>
						</view>
						<view class="nav-grid-all-list">
							<view class="name">完成：</view>
							<view class="code">{{item.completeFlag?'完成':'部分收货'}}</view>
						</view>
						<view class="nav-grid-all-list">
							<view class="name" >数量：</view>
							<view class="code" >{{item.num}}</view>
						</view>
						<view class="nav-grid-all-list">
							<view class="name">部位：</view>
							<view class="code" >{{item.position}}</view>
						</view>
					</view>
				</view>
				<view class="nav-table" v-if="item.detailMap!=null">
					<wyh-table :rightBorder="true" :items="item.tableData" :thList="item.processData"></wyh-table>
				</view>
			</view>
		</view>
		<view v-else style="height: 500rpx;display: flex;align-items: center;justify-content: center;">
			<u-empty mode="data" :textSize="36" iconSize="100" text="收货记录为空"></u-empty>
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
				processData: [],
				tableData: [],
				productionid: '',
				list: {},
				arrlist: [],
				id: '',
				a:0,
				productionId:'',
				existDetail:null,
				page:1,
				receiptFlag:false
			}
		},
		onBackPress(options){
			if (options.from === 'navigateBack') {
				return false;
			}
			// 这里使用重定向比较好，不信可以自己多试几种，其余跳转方法在文章底部哦
			if(!this.receiptFlag){
				uni.redirectTo({
					url: '/pages/outsourcingReceipt/orderList'
				})
				return true;
			}
		},
		onLoad(option) {
			const {
				productionId,
				id,
				existDetail,
				receiptFlag
			} = option
			this.id = id
			this.productionId = productionId
			this.existDetail = existDetail
			this.receiptFlag=receiptFlag
			this.getHeaderData(id)
			this.getListData(productionId, existDetail)
		},
		// 底部加载
		async onReachBottom() {
			uni.showNavigationBarLoading()
			this.getListData(this.productionId,this.existDetail);
			uni.hideNavigationBarLoading()
		},
		methods: {
			getDictLabel,
			// 获取头部data
			getHeaderData(id) {
				Api.outsourcingReceiptassistinfo({
					assistNO: id
				}).then(res => {
					if (res.code == 0) {
						this.list = res.data
						this.downup(this.list.detailMap)
						return;
					}
					toasting(res.msg,()=>{},3000)
				})
			},
			// 获取列表data
			getListData(id, existDetail) {
				let obj = {
					assistId: id,
					existDetail: existDetail,
					limit: 10,
					page: this.page
				}
				Api.outsourcingReceiptreceivePage(obj).then(res => {
					if (res.code == 0) {
						const o_list = this.arrlist
						const {
							total,
							list
						} = res.data
						if (list.length == 0) {
							toasting('暂无更多数据',()=>{},3000)
						} else {
							this.a++
							for (let I = 0; I < list.length; I++) {
								let tableData = []
								let processList = []
								let processData = []
								for (let i in list[I].detailMap) {
									processList.push(...JSON.parse(JSON.stringify(list[I].detailMap[i])))
									let tempObj = {}
									processData = list[I].detailMap[i]
									for (let x of list[I].detailMap[i]) {
										tempObj.name = x.color
										tempObj[x.size] = x.num
									}
									tableData.push({...tempObj,total:this.allnum(tempObj)})
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
								
								tableData.push({...obj1,total:this.allnum(obj1)})
								processData=processData.map(i=>({...i,dataKey:i.size,text:i.size}))
								processData.unshift({dataKey:'name',text:'颜色\\尺码',fixed:true})
								processData.push({dataKey:'total',text:'小计'})
								list[I] = {
									...list[I],
									processData: processData,
									tableData: tableData
								}
							}
							if(this.a>1){
								this.arrlist = [...o_list,...list]
								this.page = this.page + 1
							}else{
								this.arrlist = [...list]
								this.page = this.page + 1
							}
						}
						return
					}
					toasting(res.msg,()=>{},3000)
				})
			},
			// 时间截取
			datechange(time) {
				let a = String(time).slice(0, 10)
				return a
			},
			// 明细小标|表格
			downup(obj) {
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
					this.tableData.push({...tempObj,total:this.allnum(tempObj)})
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
				this.tableData.push({...obj1,total:this.allnum(obj1)})
				this.processData=this.processData.map(i=>({...i,dataKey:i.size,text:i.size}))
				this.processData.unshift({dataKey:'name',text:'颜色\\尺码',fixed:true})
				this.processData.push({dataKey:'total',text:'小计'})
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
			// 编辑
			changelist(item) {
				if(item.receiveStatus===0){
					uni.redirectTo({
						url: `./outsourcingReceipt?receiveId=${item.id}`
					})
				}else{
					uni.redirectTo({
						url: `./index?id=${this.id}&item=${JSON.stringify(item)}&num=${1}`
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.nav {
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
				font-weight: bold;

				.change {
					position: absolute;
					right: 50rpx;
				}
			}

			.nav-grid-alllist {
				width: 100%;
				display: flex;
				flex-wrap: wrap;

				.nav-grid-all-list {
					width: 50%;
					display: flex;
					margin-top: 6rpx;
					align-items: center;

					.name {
						color: #999;
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
</style>
