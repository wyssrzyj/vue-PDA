<template>
	<view class="">
		<view class="header">
			<view class="header-image">
				<image
					:src="productionInfoData.image?getimage(productionInfoData.image):'../../static/qualityTesting/default.png'"
					class="image" @click="bigimage(productionInfoData.image)"></image>
				<view style="display: flex;margin-top: 5rpx;" @click="downup(list.detailMap)">
					<text style="margin-right: 8rpx;">详情</text>
					<u-icon v-if="downupflag"  name="arrow-up" size="16px" :bold="true"></u-icon>
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
						<view class="code" style="margin-top: 6rpx;">{{productionInfoData.productOrderNum}}</view>
					</view>
					<view class="header-grid-all-list">
						<view class="name">数量：</view>
						<view class="code" style="margin-top: 6rpx;">{{list.num}}</view>
					</view>
					<view class="header-grid-all-list">
						<view class="name">客号：</view>
						<view class="code" style="margin-top: 6rpx;">{{productionInfoData.customerId}}</view>
					</view>
					<view class="header-grid-all-list">
						<view class="name">客户：</view>
						<view class="code">{{productionInfoData.customerName}}</view>
					</view>
					<view class="header-grid-all-list">
						<view class="name">添加：</view>
						<view class="code" style="margin-top: 6rpx;">{{datechange(list.createDate)}}</view>
					</view>
					<view class="header-grid-all-list">
						<view class="name">交期：</view>
						<view class="code" style="margin-top: 6rpx;">{{datechange(list.deliverTime)}}</view>
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
						<view class="code">{{getDictLabel($store.state.dicts,'outsourcing_type',list.billType)}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">工厂：</view>
						<view class="code">{{list.customerName}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">交期：</view>
						<view class="code" style="margin-top: 6rpx;">{{datechange(list.completeTime)}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">添加：</view>
						<view class="code" style="margin-top: 6rpx;">{{datechange(list.createDate)}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">单价：</view>
						<view class="code" style="margin-top: 6rpx;">{{list.unitPrice}}</view>
					</view>
					<view class="nav-grid-all-list">
						<view class="name">数量：</view>
						<view class="code" style="margin-top: 6rpx;">{{list.num}}</view>
					</view>
				</view>
			</view>
			<view class="nav-table" v-if="list.existDetail!==0">
				<wyh-table :rightBorder="true" :items="tableData" :thList="processData"></wyh-table>
			</view>
		</view>
		<view class="footer">
			<u--form ref="form" :labelStyle="{'font-size':'30rpx','font-weight': 600}" labelAlign="right" labelWidth="130">
				<u-form-item label="全部完成" borderBottom >
					<!-- <switch :checked="switch_value" class="switch" @change="change()" color="#2979ff !important" style="transform:scale(0.7)" /> -->
					<evan-switch v-model="switch_value" :active-value="1" :inactive-value="0" inactive-color="#C5C5C5" :size="20"></evan-switch>
				</u-form-item>
				<u-form-item label="收货数量" :required="true" borderBottom  v-if="list.existDetail === 0">
					<u--input v-model="receiveNum" :clearable="true" border="none" placeholder="请输入数量" type="number">
					</u--input>
					<view class="">{{list.unit}}</view>
				</u-form-item>
				<u-form-item borderBottom  @tap="selectUser" v-if="list.existDetail !== 0" :required="true">
					<template #label>
						<div style="display: flex;align-items: center;width: 130rpx;font-size: 30rpx;font-weight: 600;justify-content: flex-end;padding: 10rpx;">
							<span style="color: red;">*</span>部位
						</div>
					</template>
					<view class="storage-item-right" @tap="selectUser">
						<view class="info-active" v-if="list.position">
							<robby-tags :value="checkTagsList" :enable-del="true" @delete="handleDelete"></robby-tags>
						</view>
						<text class="info" v-else>{{'请选择部位'}}</text>
					</view>
				</u-form-item>
			</u--form>
			<view class="footer-table">
				<!-- <uni-table border emptyText="暂无更多数据" v-if="list.existDetail!==0">
					<uni-tr>
						<uni-th align="center" width="100px">颜色\尺码</uni-th>
						<uni-th align="center" v-for="(item, index) in change_num==1?change_list.processData:processData1" :key="index">{{item.size}}
						</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in change_num==1?change_list.tableData:tableData1" :key="index">
						<uni-td align="center">{{item.name}}</uni-td>
						<uni-td align="center" v-for="(i, index) in change_num==1?change_list.processData:processData1" :key="index">
							<view class="uni-group">
								<u--input v-model="item[i.size]" type="number" inputAlign="center" />
							</view>
						</uni-td>
					</uni-tr>
				</uni-table> -->
				<wyh-table :rightBorder="true" :items="change_num==1?change_list.tableData:tableData1" :thList="change_num==1?change_list.processData:processData1"></wyh-table>
			</view>
		</view>
		<u-tabbar :fixed="true" :placeholder="true" :safeAreaInsetBottom="true">
			<view class="button">
				<u-button type="primary" text="提交保存" @click="submit()" class="btn"></u-button>
			</view>
		</u-tabbar>
		<popup type="3" v-if="popValue" @close="popValue=false" @closePort="closePort">
			<template #content>
				<view class="popup">
					<view class="pop-title">
						<view style="width: 12rpx;height: 32rpx;background-color: #1794D1;margin-right: 6rpx;"></view>
						选择部位
					</view>
					<view class="pop-search" style="height: 74rpx;">
					</view>
					<view class="pop-content">
						<robby-tags :value="tagList" @click="handleTag"></robby-tags>
					</view>
				</view>
			</template>
		</popup>
	</view>
</template>

<script>
	import {toasting} from '../../utils/index.js'
	import { getDictLabel } from '../../utils/index.js'
	import Api from '../../service/api'
	import popup from "../../components/mulSelectionSearch/ge-popup.vue";
	export default {
		components: {
			toasting,
			popup
		},
		data() {
			return {
				receiveNum:'',
				num: null,
				id: '',
				productionInfoData: {},
				list: {
					position:""
				},
				tableData: [],
				processData: [],
				tableData1: [],
				processData1: [],
				downupflag: false,
				switch_value: 0,
				change_list:{},
				change_num:null,
				popValue:false, //选择部位弹窗
				tagList:[],
				popInputValue:"",
				receiveId:"",
				checkTagsList:[],
				position:"",
			}
		},
		onBackPress(options){
			if (options.from === 'navigateBack') {
					return false;
			}
			const {id,billNo,existDetail}=this.list
			// 这里使用重定向比较好，不信可以自己多试几种，其余跳转方法在文章底部哦
			if(id&&billNo&&existDetail){
				uni.redirectTo({
					url: `./outsourcingReceiptList?productionId=${id}&id=${billNo}&existDetail=${existDetail}`
				})
				return true;
			}
		},
		onLoad(option) {
			const {id,num,item} = option
			this.change_list = item?JSON.parse(item):''
			if(num==1){
				this.change_list.processData=this.change_list.processData.filter(i=>i.dataKey!=='total').map(item=>{
					if(item.dataKey!=='total'&&item.dataKey!=='name'){
						return {...item,isInput:true,inputWidth:'100%',inputHeight:'80%'}
					}else{
						return item
					}
				})
				this.change_list.tableData =this.change_list.tableData.splice(0,this.change_list.tableData.length-1)
				this.receiveNum = this.change_list.num
				this.receiveId=this.change_list.id
				this.switch_value = this.change_list.completeFlag
			}
			this.change_num = num
			this.getdata(id)
		},
		methods: {
			//删除部位
			handleDelete(currentTag,allTags){
				this.list.position=this.checkTagsList.map(i=>i.partsName).join(',')
				const find=this.tagList.find(item=>item.partsName===currentTag)
				if(find){
					find.flag=false
				}
			},
			// 点击部位
			handleTag(e){
				const find=this.tagList.find(item=>item.partsName===e)
				find.flag=!find.flag
			},
			// 保存部位
			handlePopPart(){
				Api.outsourcingAddSavePort({partsName:this.popInputValue}).then(res=>{
					if(res.code!==0){
						return uni.showToast({
							title: res.msg,
							icon: 'error',
							duration: 3000
						})
					}
					this.tagList.unshift({partsName:this.popInputValue,flag:false})
					this.popInputValue=""
				})
			},
			// 关闭部位弹窗
			closePort(){
				this.checkTagsList=this.tagList.filter(item=>item.flag===true)
				this.list.position=this.checkTagsList.map(i=>i.partsName).join(',')
				this.popValue=false
			},
			//打开部位弹窗
			selectUser(){
				if(this.position===''){
					return toasting('请扫描扎包条码',()=>{},3000)
				}
				const arr=this.checkTagsList.map(i=>i.partsName)
				this.tagList=this.position.split(',').map(item=>{
					if(arr.includes(item)){
						return {partsName:item,flag:true}
					}else{
						return {partsName:item,flag:false}
					}
				})
				this.popValue=true
			},
			getDictLabel,
			// 获取信息
			getdata(id) {
				Api.outsourcingReceiptassistinfo({
					assistNO: id,
					receiveId:this.receiveId
				}).then(res => {
					if (res.code !== 0) {
						toasting(res.msg,()=>{},3000)
						return
					}
					this.list = res.data
					this.checkTagsList=res.data.position.split(',').map(item=>({partsName:item,flag:true}))
					this.position=res.data.position //当前外协单部位
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
						tempObj[x.size] = ''
					}
					this.tableData1.push(tempObj)
				}
				this.processData1=this.processData1.filter(i=>i.dataKey!=='total').map(item=>{
					if(item.dataKey!=='total'&&item.dataKey!=='name'){
						return {...item,isInput:true,inputWidth:'100%',inputHeight:'80%',dataKey:item.size,text:item.size}
					}else{
						return item
					}
				})
				if(this.processData1.length>0){
					this.processData1.unshift({dataKey:'name',text:'颜色\\尺码',fixed:true})
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
			// change() {
			// 	this.switch_value = !this.switch_value
			// },
			submit() {
				if(this.list.position===''){
					return toasting('请选择部位',()=>{},3000)
				}
				this.list.receiveNum = this.receiveNum
				if (this.list.existDetail === 0) {
					if (!this.list.receiveNum) {
						uni.$u.toast('请输入收货数量')
						return
					}
				}else{
					this.list.receiveNum = 0
				}
				//我也是接盘，别读了，太恶心了
				let arr = []
				for (let i in this.change_num==1?this.change_list.tableData:this.tableData1) {
					let new_list = {}
					var old_list = this.change_num==1?this.change_list.tableData[i]:this.tableData1[i]
					new_list.color = this.change_num==1?this.change_list.tableData[i].name:this.tableData1[i].name
					delete old_list.name
					delete old_list.undefined
					for (let x of this.change_num==1?this.change_list.processData:this.processData1) {
						if(x.size){
							old_list[x.size] = Number(old_list[x.size])
						}
					}
					new_list.qtyFinalList = old_list
					arr.push(new_list)
				}
				let obj = {
					"assistId": this.list.id,
					"completeFlag": this.switch_value,
					"detailList": arr,
					"position":this.list.position,
					"existDetail": this.list.existDetail,
					"id": this.change_num==1?this.change_list.id:'',
					"num": Number(this.list.receiveNum)
				}
				// 编辑
				if(this.change_num==1) {
					Api.outsourcingReceiptreceiveUpdate(obj).then(res => {
						if (res.code !== 0) {
							toasting(res.msg,()=>{},3000)
							return
						}
						toasting('编辑成功',()=>{},3000)
						uni.redirectTo({
							url: './orderList'
						})
					})
					return
				}else{
					// 保存
					Api.outsourcingReceiptreceiveSave(obj).then(res => {
						if (res.code !== 0) {
							toasting(res.msg,()=>{},3000)
							this.downup1(this.list.detailMap)
							return
						}
						toasting('保存成功',()=>{},3000)
						uni.redirectTo({
							url: './orderList'
						})
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.switch::before {
		color: #8799a3 !important;
		z-index: unset !important;
	}
	.switch::after {
		color: #55aaff !important;
		z-index: unset !important;
	}
	.u-input--square{
		background-color: #fff !important;
	}
	page {
		padding: 0;
		margin: 0;
		width: 100vw;
		height: 100%;
	}
	.storage-item-right{
		align-items: center;
		max-width: 540rpx;
		.info{
			max-width: 540rpx !important;
			color: #ccc;
			margin-right: 15rpx;
		}
		.info-active{
			max-width: 540rpx !important;
			color: #000;
			margin-right: 15rpx;
		}
	}
	.header {
		width: 100%;
		height: 240rpx;
		padding: 20rpx;
		display: flex;
		background-color: white;

		.header-image {
			width: 160rpx;
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
					display: flex;
					margin-top: 6rpx;
					align-items: center;

					.name {
						color: #999;
						width: 84rpx;
						text-align: right;
					}

					.code {
						width: 176rpx;
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
				display: flex;
				flex-wrap: wrap;
				.nav-grid-all-list {
					width: 50%;
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
						white-space: nowrap;
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
		justify-content: center;
		box-shadow: 0 -8rpx 10rpx #ddd;
		align-items: center;
		.btn{
			width: 296rpx;
			height:80rpx;
			background-color: #1794D1;
			font-size: 32rpx;
			color: #FFFFFF;
			line-height: 80rpx;
			border-radius:8rpx;
		}
	}
	.popup{
			.pop-title{
				font-size: 36rpx;
				font-weight: blod;
				display: flex;
				align-items: center;
			}
			.pop-search{
				display: flex;
				align-items: center;
				height: 104rpx;
				padding: 24rpx 0;
			}
			.pop-content{
				display: flex;
			}
			.pop-switch{
				display: flex;
				height: 88rpx;
				align-items: center;
			}
		}
</style>
