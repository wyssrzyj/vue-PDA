<template>
	<view class="mainContent" @click="domHandelClick">
		<view class="borderBottom">
			<view class="storage">
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>生产单</text>
					<view class="storage-item-right" @click="clickProduce">
						<text class="info">{{ showProduce || '请选择生产单' }}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>工段</text>
					<view class="storage-item-right" @click="clickSection">
						<text class="info">{{ section || '请选择报工工段' }}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>工序</text>
					<view class="storage-item-right" @click="showMultiple">
						<text class="info">请选择报工工序</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<ul>
					<li v-for="item in checkedList" :key="item.name" style="font-size: 30rpx;">{{item.value}}</li>
				</ul>
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>人员</text>
					<view class="storage-item-right" @click="selectUser">
						<text class="info">{{showName||'请选择报工人员'}}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="main-info" v-if="type == '0'">
			<!-- 数量 -->
			<view class="main-info-num">
				<text class="main-info-label"><text class="requier">*</text>数量</text>
				<input class="main-info-input" type="text" placeholder="请输入数量" v-model="count" @input="(e)=>handleInput(e,'count')">
				<view class="main-info-unit" id="unit1" @click="showUnitList = !showUnitList">{{unit}}</view>
			</view>
			<!-- 单位 -->
			<view class="unit-list" id='unit2' v-if="showUnitList">
				<view class="unit-item" :class="{'unit-select':unit === item}" v-for="item in unitList" :key="item" @click="changeUnit(item)">{{item}}</view>
			</view>
		</view>
		
		<view class="main-info" v-else>
			<view style="width: 100%;overflow-x: scroll;" v-if="skuList[0]">
				<table class="cart-table">
				  <thead>
					<tr>
						<th class="cart-table-th" style="position: fixed;width: 220rpx;">颜色 / 尺码</th>
						<!-- 占位 -->
						<td class="cart-table-th" style="width: 220rpx;" />
						<th class="cart-table-th" v-for="(item,index) in Object.keys(skuList[0].size)" :key="index">{{item}}</th>
					</tr>
				  </thead>
				  <tbody>
					<tr v-for="(item,index) in skuList" :key="index">
					  <td class="cart-table-td" style="position: fixed;width: 220rpx;">
						  <view>{{item.colorName}}</view>
					  </td>
					  <!-- 占位列 -->
					  <td class="cart-table-td" style="width: 220rpx;" />
					  <template v-if="item.size">
						  <td class="cart-table-td" v-for="(i,indey) in Object.keys(skuList[0].size)" :key="indey">
							  <input type="text" v-model="item.size[i]" style="border: 1px solid #aaa;width:100%;height: 70rpx;" @input="(e)=>handleInput(e,item,i)">
						  </td>
					  </template>

					</tr>
				  </tbody>
				</table>
			</view>
			<view v-else style="font-size: 30rpx;font-weight: bold;color: #ff6262;">请选择生产单</view>
		</view>
		
		<!-- 底部 -->
		<view class="bottomBtns">
			<button class="bottom-btn" @click="handleSubmit('return')">保存并返回</button>
			<button class="bottom-btn" @click="handleSubmit('continue')">保存并继续</button>
		</view>
		

		<!-- 选择生产单 -->
		<searchSelect ref="produceSearchSelect" :options="produceList" valKey="id" :showKey="'showKey'" @sure="produceSelectSure" />
		<!-- 选择工段 -->
		<u-action-sheet :actions="sectionList" :show="showSection" @select="sectionSelectClick" :closeOnClickOverlay="true" :closeOnClickAction="true" @close="showSection=false" />
		<!-- 选择工序 -->
		<select-code-multiple :visible="showM" :checkedValue="checkedList" :optionList="coutryList" @confirm="getCodeMu" />
		<!-- 选择用户 -->
		<searchSelect ref="userSearchSelect" :options="userList" valKey="id" :showKey="'showKey'" @sure="userSelectSure" />
	</view>
</template>

<script>
	import {formateDate,findKey,useDebounce,checkFunc,getDictDataList} from "@/utils/index.js"
	import Api from '../../service/api'
	import selectCodeMultiple from '@/components/mulSelection/mulSelection.vue'
	import searchSelect from "@/components/J-Picker/jPicker.vue"
	let message = (msg) => uni.showToast({icon:'none', duration:3000, title: msg})
	export default{
		components: {
			selectCodeMultiple,
			searchSelect
		},
		onLoad(option) {
			this.type = option.type
			let unit = getDictDataList(this.$store.state.dicts, 'unit_type') //单位列表
			this.unitList = unit.map(item=> item.dictValue)
		},
		async mounted(){
			// 获取所有生产单和人员列表
			await this.getProduceListAndUserList()
			
			// 获取缓存
			this.getLocalStorage()
		},
		data(){
			return{
				type:null, //报工方式 1颜色尺码报工，0数量报工
				
				produce:{}, //选择的生产单
				produceList:[],	//生产单可选列表
				showProduce: '', //展示
				
				sectionAndCoutry: {},//工段工序组合数据
				showSection: false, //工段
				section: '',	//选择的工段值
				sectionList: [],//工段列表
				
				showM: false, //工序
				checkedList: [],//选中的工序列表
				coutryList: [], //可选工序列表
				
				userId:null,//用户id
				showName:'', //前端用户名称
				userList:[], //用户列表
				
				unit: '件',
				unitList: [],//单位列表
				showUnitList: false,
				count: '', //数量
				
				skuList: []//颜色尺码报工数据
			}
		},
		methods:{
			//获取本地缓存
			getLocalStorage(){
				let stateStorage = uni.getStorageSync('manualReporting') || {}
				if(Object.keys(stateStorage).length === 0) return
				//设置员工
				this.userList.find((item)=>{
				  if(item.id === stateStorage.userId) {
					  this.userId = stateStorage.userId
					  this.showName = item.showKey
					  return true
				  }
				})
				
				// 判断生产单是否被删除，选择生产单
				let p = this.produceList.find(item => item.id = stateStorage.produce.id)
				//生产单被删除缓存中断
				if (!p) return
				// 选择生产单，获取sku和工段
				this.produceSelectSure({...stateStorage.produce,showKey:`${stateStorage.produce.productOrderNum}(${stateStorage.produce.proNum})`})
				
				//判断工段是否删除
				let sectionList = this.sectionList.map(item => item.name)
				if (sectionList.includes(stateStorage.section)) {
				  this.sectionSelectClick({name:stateStorage.section}) //设置工序列表
				  // 判断工序是否删除,只把没被删除的工序缓存取出来
				  let coutryList = this.coutryList.map(item => item.value)
				  stateStorage.checkedList.forEach(item => {
					if (coutryList.includes(item.value)) this.checkedList.push(item)
				  })
				}
			},
			
			// 获取所有生产单列表和人员列表
			async getProduceListAndUserList(){
				// 生产单
				let produceRes = await Api.allProduce()
				if(produceRes.code === 0){
					this.produceList = produceRes.data.map(item => {
						return {id: item.id,productOrderNum:item.productOrderNum,proNum:item.proNum,showKey:`${item.productOrderNum}(${item.proNum})`}
					})
				} else {
					message(produceRes.msg)
				}
				
				// 人员
				let userRes = await Api.getAlluser()
				if(userRes.code === 0){
					this.userList = userRes.data.map(item => {
						return {id: item.id,showKey:`${item.realName}-${item.staffId}`}
					})
				} else {
					message(userRes.msg)
				}
			},
			
			//打开生产单款号弹窗------------------------------------------------------
			clickProduce() {
				if(Object.keys(this.produceList).length === 0) {
					message('暂无生产单可供选择!')
				} else {
					this.$refs.produceSearchSelect.showPicker()
				}
			},
			//选择了某个生产单
			async produceSelectSure(val){
				this.produce = {id:val.id,productOrderNum:val.productOrderNum,proNum:val.proNum,}
				this.showProduce = val.showKey
				
				// 获取颜色尺码数据
				if(this.type == '1'){
					let skuRes = await Api.produceSku({id:val.id})
					if(skuRes.code === 0) {
						// type=1处理sku
						// 数据格式：[{colorName:'黑色',size:{S:'',M:'',L:'',XL:'',XXL:''}}]
						let size = {}
						skuRes.data.size.forEach(i => {
							size[i.name] = null
						})
						this.skuList = skuRes.data.color.map(item => {
							return {colorName: item.name, size:{...size}}
						})
					} else {
						message(skuRes.msg)
					}
				}
				
				// 获取工段
				let sectionRes = await Api.produceSection({id:val.id})
				if(sectionRes.code === 0) {
					console.log('工段：',sectionRes)
					this.sectionAndCoutry = sectionRes.data || {}
					this.sectionList = Object.keys(sectionRes.data).map(item => {
						return {name: item}
					})
				} else {
					message(sectionRes.msg)
				}

			},
			
			// 弹出工段选择----------------------------------------------------------
			clickSection(){
				if(Object.keys(this.sectionAndCoutry).length === 0) {
					message('暂无工段可供选择!')
				} else {
					this.showSection = true
				}
			},
			//选择不同的工段
			sectionSelectClick(e){
				this.section = e.name
				this.checkedList = []
				this.coutryList = []
				this.sectionAndCoutry[e.name].forEach(item => {
					this.coutryList.push({name: item.productName, value: item.productName,...item,valid:1})
				})
			},
			
			//打开工序多选------------------------------------------------------------
			showMultiple() {
				if(Object.keys(this.coutryList).length === 0) {
					message('暂无工序可供选择!')
				} else {
					this.showM = true
				}
			},
			//获取工序多选的值
			getCodeMu(event) {
				this.checkedList=[]
				event.forEach(item=>{
					this.checkedList.push({name:item.value,value:item.value,...item})
				})
				this.showM = false
			},
			
			// 选择用户弹窗----------------------------------------------------------
			selectUser(){
				if(Object.keys(this.userList).length === 0) {
					message('暂无人员可供选择!')
				} else {
					this.$refs.userSearchSelect.showPicker()
				}
			},
			// 选择了某个用户
			userSelectSure(val){
				this.userId = val.id
				this.showName = val.showKey
			},
			
			// 输入框
			handleInput(e,type,i){
				if(Number.isNaN(Number(e.detail.value)) || Number(e.detail.value) <= 0 || e.detail.value.includes('.')){
					this.$nextTick(()=>{
						// 如果修改的是总数
						if(type === "count") {
							this.count= null
						} else {
							type.size[i] = null
						}
					})
				}
			},
			
			// 选择单位
			changeUnit(unit){
				this.unit = unit
				this.showUnitList = false
			},
			// 点击其他地方关闭单位选择
			domHandelClick(e){
				if(e.target.id !== 'unit1' && e.target.id !== 'unit2'){
					this.showUnitList = false
				}
			},
			
			//弹出按钮点击事件
			clear(){
				this.produce = {}
				this.showProduce = ''
				this.sectionAndCoutry = {}
				this.section = ''
				this.sectionList = []
				this.checkedList = []
				this.coutryList = []
				this.userId = null
				this.showName = ''
				this.unit = '件'
				this.count = ''
				this.skuList = []
			},
			
			// 保存
			handleSubmit(type){
				//工段必填
				if(!this.showProduce){ 
					return message('请选择生产单!')
				}
				//工段必填
				if(!this.section){ 
					return message('请选择工段!')
				}
				//工序必填
				if(this.checkedList.length === 0){ 
					return message('请选择工序!')
				}
				//员工必填
				if(!this.userId){ 
					return message('请选择报工人员!')
				}
				//员工必填
				if(this.type == '0' && !this.count){ 
					return message('请输入数量!')
				}
				
				// 传输数据
				let dataForm = {
						produceOrderId: this.produce.id,
						produceOrderNum: this.produce.produceOrderNum,
						proNum: this.produce.proNum,
						section: this.section,
						processVoList: this.checkedList,
						userId: this.userId,
						
						count: this.type == '0' ? this.count : undefined,
						unit: this.type == '0' ? this.unit : undefined,
						skuList: this.type == '1' ? this.skuList : undefined
					}
				let url = this.type == '0' ? '/mes/mesengineeringmanagement/saveMaterialsReporting' : '/mes/mesengineeringmanagement/saveEngineeringManual'
				Api.submitManualReporting(url, dataForm).then(res => {
					if (res.code === 0) {
						// 删除缓存
						uni.removeStorageSync('manualReporting')
						//设置缓存
						uni.setStorageSync('manualReporting', {
							produce: this.produce, //选择的生产单
							userId: this.userId,
							section: this.section,
							checkedList: this.checkedList
						})
						this.clear()
						// 按钮点击类型
						if(type === 'return') {
							uni.navigateBack()
						} else if(type === 'continue') {
							this.getLocalStorage()
						}
					} else {
						message(res.msg)
					}
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
	::v-deep .uni-actionsheet__menu{
		background-color: #FC361D!important;
		color: #007AFF;
	}
	.requier{
		color: red;
		margin-right: 10rpx;
	}
	.iconfont{
		font-size: 12rpx;
	}
	::v-deep .u-toolbar[data-v-6d25fc6f]{
		border-bottom: 1px solid  #EAEAEA!important;
	}
	.mainContent {
		// position: relative;
		background-color: #F3F3F3;
		padding-bottom: 120rpx;
		.borderBottom{
			margin-bottom: 20rpx;
		}
		.main-info{
			width: 100%;
			padding: 20rpx 30rpx;
			background-color: #ffffff;
			.main-info-num{
				display: flex;
				.main-info-label{
					font-size: 32rpx;
					font-weight: bold;
					margin-right: 20rpx;
					line-height: 80rpx;
				}
				.main-info-input{
					font-size: 30rpx;
					width: 200rpx;
					height: 80rpx;
					text-align: center;
					border-radius: 10rpx;
					border: 1px solid #d0d0d0;
					margin-right: 20rpx;
				}
				.main-info-unit{
					line-height: 80rpx;
					padding: 0 30rpx;
					border-radius: 12rpx;
					background-color: #1794d1;
					color: #ffffff;
				}
			}
			.unit-list{
				box-shadow: 0 6rpx 20rpx rgba(0,0,0,.5);
				border-radius: 20rpx;
				padding: 20rpx 0 0 30rpx;
				margin-top: 10px;
				width: 100%;
				height: 420rpx;
				overflow-y: scroll;
				overflow-x: hidden;
				display: flex;
				align-content: flex-start;
				flex-wrap: wrap;
				.unit-item{
					height: 80rpx;
					line-height: 80rpx;
					padding: 0 30rpx;
					background-color: #d6d6d6;
					border-radius: 12rpx;
					margin-right: 30rpx;
					margin-bottom: 20rpx;
					color: #000;
				}
				.unit-select{
					background-color: #1794d1;
					color: #ffffff;
				}
			}
			// 表格
			.cart-table{
				width: 100%;
				border-collapse: collapse;
				border-spacing: 0;
				margin: 20rpx 0;
				.cart-table-th{
					min-width: 220rpx;
					height: 100rpx;
					line-height: 90rpx;
					box-sizing: border-box;
					color: #666666;
					border: solid 1px #666666;
					vertical-align: center;
					font-size: 30rpx;
					text-align: center;
					background-color: #f1f1f1;
					overflow: scroll;
				}
				.cart-table-td{
					background-color: #ffffff;
					height: 100rpx;
					line-height: 80rpx;
					text-align: center;
					border: solid 1px #666666;
					color: #666666;
					padding: 10rpx;
					vertical-align: center;
					box-sizing: border-box;
					overflow: scroll;
				}
			}
		}
		.bottomBtns{
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 120rpx;
			background-color: #ffffff;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-shadow: 0 -6rpx 20rpx rgba(0,0,0,.3);
			.bottom-btn{
				font-size: 32rpx;
				border: none;
				color: #ffffff;
				background-color: #1794d1;
				line-height: 90rpx;
				width: 280rpx;
				height: 90rpx;
			}
		}
	}
	
</style>
