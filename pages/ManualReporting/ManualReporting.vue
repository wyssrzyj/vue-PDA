<template>
	<view class="mainContent" @click="domHandelClick">
		<view class="borderBottom">
			<view class="storage">
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>生产单</text>
					<view class="storage-item-right" @click="clickProduce">
						<text class="info">{{ productNum || '请选择生产单' }}</text>
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
		
		<view class="main-info" v-if="type === '0'">
			<!-- 数量 -->
			<view class="main-info-num">
				<text class="main-info-label"><text class="requier">*</text>数量</text>
				<input class="main-info-input" type="text" placeholder="请输入数量" v-model="count" @input="handleInput">
				<view class="main-info-unit" id="unit1" @click="showUnitList = !showUnitList">{{unit}}</view>
			</view>
			<!-- 单位 -->
			<view class="unit-list" id='unit2' v-if="showUnitList">
				<view class="unit-item" :class="{'unit-select':unit === item}" v-for="item in unitList" :key="item" @click="changeUnit(item)">{{item}}</view>
			</view>
		</view>
		<view class="main-info" v-else>
			<view style="width: 100%;overflow-x: scroll;">
				<table class="cart-table">
			  <thead>
				<tr>
				  <th class="cart-table-th" style="width: 220rpx;position: fixed;margin-left: -220rpx">颜色 / 尺码</th>
				  <th class="cart-table-th" style="margin-left: 220rpx;">S</th>
				  <th class="cart-table-th">M</th>
				  <th class="cart-table-th">L</th>
				  <th class="cart-table-th">L</th>
				  <th class="cart-table-th">L</th>
				  <th class="cart-table-th">L</th>
				</tr>
			  </thead>
			  <tbody>
				<tr>
				  <td class="cart-table-td" style="width: 220rpx;position: fixed;margin-left: -220rpx;">
					  <view>黑色</view>
				  </td>
				  <td class="cart-table-td" style="margin-right: 220rpx;">
					<view>123</view>
				  </td>
				  <td class="cart-table-td">
					<view>456</view>
				  </td>
				  <td class="cart-table-td">
					<view>789</view>
				  </td>
				  <td class="cart-table-td">
					<view>789</view>
				  </td>
				  <td class="cart-table-td">
					<view>789</view>
				  </td>
				  <td class="cart-table-td">
					<view>789</view>
				  </td>
				</tr>
			  </tbody>
			</table>
			</view>
		</view>
		
		<!-- 底部 -->
		<view class="bottomBtns">
			<button class="bottom-btn">保存并返回</button>
			<button class="bottom-btn" @click="handleSubmit">保存并继续</button>
		</view>
		

		<!-- 选择生产单 -->
		<searchSelect ref="produceSearchSelect" :options="produceList" valKey="id" :showKey="'showKey'" @sure="produceSelectSure" />
		<!-- 选择工段 -->
		<u-action-sheet :actions="sectionList" :show="showSection" @select="sectionSelectClick" :closeOnClickOverlay="true" :closeOnClickAction="true" @close="showSection=false"></u-action-sheet>
		<!-- 选择工序 -->
		<select-code-multiple :visible="showM" :checkedValue="checkedList" :optionList="coutryList"@confirm="getCodeMu"></select-code-multiple>
		<!-- 选择用户 -->
		<searchSelect ref="userSearchSelect" :options="userList" valKey="id" :showKey="'showKey'" @sure="userSelectSure" />
	</view>
</template>

<script>
	import {formateDate,findKey,useDebounce,checkFunc,getDictDataList} from "@/utils/index.js"
	import Api from '../../service/api'
	import selectCodeMultiple from '@/components/mulSelection/mulSelection.vue'
	import searchSelect from "@/components/J-Picker/jPicker.vue"
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
		mounted(){
			this.getAllProduceList()
			// 获取员工列表
			Api.getAlluser().then(res => {
				if(res.code=="0"){
					this.userList = res.data.map(item => {
						return {id: item.id,showKey:`${item.realName}-${item.staffId}`}
					})
				}
			})
		},
		data(){
			return{
				type:null, //报工方式 1颜色尺码报工，0数量报工
				
				produceList:[],	//生产单可选列表
				productNum: '', //款号
				
				sectionAndCoutry: {},//工段工序组合数据
				showSection: false, //工段
				section: '',	//选择的工段值
				sectionList: [],//工段列表
				
				showM: false, //工序
				supplierName:'', //工序字符串
				checkedList: [],//选中的工序列表
				coutryList: [], //可选工序列表
				
				userId:null,//用户id
				showName:'', //前端用户名称
				userList:[], //用户列表
				
				unit: '件',
				unitList: [],//单位列表
				showUnitList: false,
				count: '' //数量
			}
		},
		methods:{
			// 获取所有生产单列表
			async getAllProduceList(){
				let res = await Api.allProduce()
				if(res.code=="0"){
					console.log(res)
					// this.produceList = res.data.map(item => {
					// 	return {id: item.id,showKey:`${item.realName}-${item.staffId}`}
					// })
				}
			},
			//打开生产单款号弹窗------------------------------------------------------
			clickProduce() {
				if(Object.keys(this.produceList).length === 0) {
					uni.showToast({
						icon:'none',
						title:'暂无生产单可供选择!'
					})
				} else {
					this.$refs.produceSearchSelect.showPicker()
				}
			},
			//选择了某个生产单
			produceSelectSure(val){
				console.log(val)
			},
			
			// 弹出工段选择----------------------------------------------------------
			clickSection(){
				if(Object.keys(this.sectionAndCoutry).length === 0) {
					uni.showToast({
						icon:'none',
						title:'暂无工段可供选择!'
					})
				} else {
					this.showSection = true
				}
			},
			//选择不同的工段
			sectionSelectClick(e){
				this.section = e.name
				this.supplierName = ''
				this.checkedList = []
				this.coutryList = []
				this.sectionAndCoutry[e.name].forEach(item => {
					this.coutryList.push({name: item, value: item, valid: 1})
				})
			},
			
			//打开工序多选------------------------------------------------------------
			showMultiple() {
				if(Object.keys(this.coutryList).length === 0) {
					uni.showToast({
						icon:'none',
						title:'暂无工序可供选择!'
					})
				} else {
					this.showM = true
				}
			},
			//获取工序多选的值
			getCodeMu(event) {
				this.checkedList=[]
				event.forEach(item=>{
					this.checkedList.push({name:item.value,value:item.value})
				})
				this.supplierName=this.checkedList.map(item=>item.name).join(",")
				this.showM = false
			},
			
			// 选择用户弹窗----------------------------------------------------------
			selectUser(){
				if(Object.keys(this.userList).length === 0) {
					uni.showToast({
						icon:'none',
						title:'暂无人员可供选择!'
					})
				} else {
					this.$refs.userSearchSelect.showPicker()
				}
			},
			// 选择了某个用户
			userSelectSure(val){
				this.userId = val.id
				this.showName = val.showKey
			},
			
			//获取本地缓存
			scanPCSEncapsulation(res){
				/**
				 * 工段，工序，员工
				 * 如果被删除了缓存需要清除
				 */
				let stateStorage = uni.getStorageSync('productionReport') || {}
				//设置员工
				this.userList.find((item)=>{
				  if(item.id === stateStorage.userId) {
					  this.userId = stateStorage.userId
					  this.realName = item.realName + '—' + item.staffId
					  return true
				  }
				})
				
				//判断工段是否删除
				let sectionList = this.sectionList.map(item => item.name)
				if (sectionList.includes(stateStorage.section)) {
				  this.sectionSelectClick({name:stateStorage.section}) //设置工序列表
				  // 判断工序是否删除,只把没被删除的工序缓存取出来
				  let coutryList = this.coutryList.map(item => item.name)
				  stateStorage.checkedList.forEach(item => {
					if (coutryList.includes(item.value)) this.checkedList.push({name:item.value,value:item.value})
				  })
				  this.supplierName = this.checkedList.map(item=>item.name).join(",")
				}
			},
			
			// 输入框
			handleInput(e){
				if(Number.isNaN(Number(e.detail.value)) || Number(e.detail.value) <= 0 || e.detail.value.includes('.')){
					this.$nextTick(()=>{
						this.count= ""
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
			selectClick(e){
				this.coutryList=[]
				this.productNum = ''
				this.supplierName=""
				this.checkedList=[]
				this.section=''
				this.sectionAndCoutry={}
				this.sectionList=[]
				this.columns=[]
				this.showName = ''
				this.userId = null
			},
			
			// 保存
			handleSubmit(){ // 出库
				if(!this.section){ //工段必填
					uni.showToast({
						icon:'none',
						title:'请选择工段!'
					})
					return;
				}
				if(!this.supplierName){ //工序必填
					uni.showToast({
						icon:'none',
						title:'请选择工序!'
					})
					return;
				}
				if(!this.userId){ //员工必填
					uni.showToast({
						icon:'none',
						title:'请选择报工人员!'
					})
					return;
				}
				if(!this.count){ //员工必填
					uni.showToast({
						icon:'none',
						title:'请输入数量!'
					})
					return;
				}
				Api.productionReporting({
					mesEngineeringManagementDTOS,
				}).then(res => {
					if (res.code === 0) {
						// 删除缓存
						uni.removeStorageSync('manualReporting')
						//设置缓存
						uni.setStorageSync('manualReporting', { 
							userId: this.userId,
							section: this.section,
							checkedList: this.checkedList,
							supplierName: this.supplierName
						})
						this.selectClick()
						
					}else{
						// res.msg
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
		position: relative;
		background-color: #F3F3F3;
		// height: calc(100vh - 44px);
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
				margin-top: 30rpx;
				margin-left: 220rpx;
				.cart-table-th{
					min-width: 200rpx;
					height: 80rpx;
					box-sizing: border-box;
					color: #666666;
					border: solid 1px #666666;
					vertical-align: center;
					font-size: 30rpx;
					text-align: center;
					background-color: #ffffff;
				}
				.cart-table-td{
					background-color: #ffffff;
					height: 80rpx;
					text-align: center;
					border: solid 1px #666666;
					color: #666666;
					padding: 10rpx;
					vertical-align: center;
					box-sizing: border-box;
					.img{
						width: 160rpx;
						height: 160rpx;
					}
					.cart-repair-list{
						height: 180rpx;
						overflow: scroll;
					}
					.btn{
						width: 160rpx;
						height: 80rpx;
						font-size: 32rpx;
						line-height: 84rpx;
						background-color: #0C99F2;
						text-align: center;
						color: #FFFFFF;
						border-radius: 8rpx;
					}
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
