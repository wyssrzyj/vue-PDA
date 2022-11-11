<template>
	<view class="mainContent">
		<view class="borderBottom">
			<view class="storage">
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>款号</text>
					<view class="storage-item-right">
						<text class="info">{{ productNum || '请选择款号' }}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>报工工段</text>
					<view class="storage-item-right" @click="clickSection">
						<text class="info">{{ section || '请选择报工工段' }}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>报工工序</text>
					<view class="storage-item-right" @click="showMultiple">
						<text class="info">请选择报工工序</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<ul>
					<li v-for="item in checkedList" :key="item.name" style="font-size: 30rpx;">{{item.value}}</li>
				</ul>
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>当前员工</text>
					<view class="storage-item-right" @click="selectUser">
						<text class="info">{{realName||'未绑定'}}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部 -->
		<view class="bottomTab">
		</view>
		

		<!-- 选择工段组件 -->
		<u-action-sheet :actions="sectionList" :show="showSection" @select="sectionSelectClick" :closeOnClickOverlay="true" :closeOnClickAction="true" @close="showSection=false"></u-action-sheet>
		<!-- 选择工序 -->
		<select-code-multiple :visible="showM" :checkedValue="checkedList" :optionList="coutryList"@confirm="getCodeMu"></select-code-multiple>
		<!-- 选择用户 -->
		<mpv ref="mpv" v-model='realName' :list="userList" @selectSure="selectSure" />
	</view>
</template>

<script>
	import {formateDate,findKey,useDebounce,checkFunc} from "@/utils/index.js"
	import Api from '../../service/api'
	import selectCodeMultiple from '@/components/mulSelection/mulSelection.vue'
	import mpv from "@/components/mulSelectionSearch/mulSelectionSearch-user.vue"
	var timer;
	var preKeyCode = '';
	var allKeyCodeTemp = '';
	export default{
		components: {
			selectCodeMultiple,
			mpv
		},
		onLoad(option) {
			this.type = option.type
		},
		mounted(){
			// 获取员工列表
			Api.getAlluser().then(res => {
				if(res.code=="0"){
					this.userList = res.data.map(item => {
						return {id: item.id, staffId: item.staffId, realName: item.realName}
					})
				}
			})
		},
		data(){
			return{
				type:null, //报工方式 1颜色尺码报工，0数量报工
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
				realName:'', //前端用户名称
				userList:[], //用户列表
			}
		},
		methods:{
			//打开多选
			showMultiple() {
				this.showM = true
			},
			//获取多选的值
			getCodeMu(event) {
				this.checkedList=[]
				event.forEach(item=>{
					this.checkedList.push({name:item.value,value:item.value})
				})
				this.supplierName=this.checkedList.map(item=>item.name).join(",")
				this.showM = false
			},
			// 弹出工段选择
			clickSection(){
				if(Object.keys(this.sectionAndCoutry).length === 0) {
					this.showErrorMessage = '暂无工段可供选择！'
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 3000)
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
			// 选择用户弹窗
			selectUser(){
				this.$refs.mpv.toggle('bottom')
			},
			// 选择了某个值
			selectSure(val){
				this.userId = val.id
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
				this.realName = ''
				this.userId = null
			},
			
			handleOutStorage(){ // 出库
				if(!this.section){ //工段必填
					return;
				}
				if(!this.supplierName){ //工序必填
					return;
				}
				if(!this.userId){ //员工必填
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
		.borderBottom{
			padding-bottom: 10rpx;
		}
	}
</style>
