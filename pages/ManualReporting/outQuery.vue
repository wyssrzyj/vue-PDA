<template>
	<div class="out-qeurty">
		<view class="line"></view>
		<y-tabs v-model="activeIndex" background="#0c99f2" color="#fff" title-inactive-color="#D0D0D0" title-active-color="#fff" @change="tabChange">
		    <y-tab title="日产量" :line-style="{left:'54px'}">
				<view class="out-select">
					<view class="out-time">
						<text>{{currentTime}}</text><text class="iconfont icon-youjiantou" @click="openDatetimePicker"></text>
					</view>
					<view class="out-statistics">
						<view>共{{outputInfo.orderNum}}单，{{outputInfo.reportNum}}件</view>
						<view class="out-statistics-name" @tap="selectUser">{{dataForm.staffName}}<text class="iconfont icon-youjiantou"></text></view>
					</view>
				</view>
				<view class="out-content" v-if="processList.length>0">
					<view class="out-recored" v-for="(item,index) in processList" :key="index" >
						<view class="out-record-info">
							<image :src="item.img||'../../static/qualityTesting/default.png'" class="out-recoed-info-left"></image>
							<view class="out-record-info-right">
								<view><text class="out-recoed-info-desicribe">生产单：</text>{{item.produceNum}}</view>
								<view><text class="out-recoed-info-desicribe">款&emsp;号：</text>{{item.proNum}}</view>
								<view><text class="out-recoed-info-desicribe">款&emsp;名：</text>{{item.productName}} </view>
							</view>
						</view>
						<view class="ul">
							<view class="li" v-for="(processItem,proxessIndex) in item.processList" :key="proxessIndex">
								<text class="li-left">{{proxessIndex+1}}、{{processItem.productName}}</text><text class="li-right">{{processItem.num}}</text>
							</view>
						</view>
					</view>
				</view>
				<view v-else>
					<u-empty text="暂无数据" mode="search" style="height: 700rpx;" icon-size="180" textSize="32"></u-empty>
				</view>
		    </y-tab>
			<y-tab title="月产量">
			    <view class="out-select">
			    	<view class="out-time">
			    		<text>{{currentTime}}</text><text class="iconfont icon-youjiantou" @click="openDatetimePicker"></text>
			    	</view>
			    	<view class="out-statistics">
			    		<view>共{{outputInfo.orderNum}}单，{{outputInfo.reportNum}}件</view>
			    		<view class="out-statistics-name" @tap="selectUser">{{dataForm.staffName}}<text class="iconfont icon-youjiantou"></text></view>
			    	</view>
			    </view>
			    <view class="out-content" v-if="processList.length>0">
			    	<view class="out-recored" v-for="(item,index) in processList" :key="index" >
			    		<view class="out-record-info">
			    			<image :src="item.img||'../../static/qualityTesting/default.png'" class="out-recoed-info-left"></image>
			    			<view class="out-record-info-right">
			    				<view><text class="out-recoed-info-desicribe">生产单：</text>{{item.produceNum}}</view>
			    				<view><text class="out-recoed-info-desicribe">款&emsp;号：</text>{{item.proNum}}</view>
			    				<view><text class="out-recoed-info-desicribe">款&emsp;名：</text>{{item.productName}} </view>
			    			</view>
			    		</view>
			    		<view class="ul">
			    			<view class="li" v-for="(processItem,proxessIndex) in item.processList" :key="proxessIndex">
			    				<text class="li-left">{{proxessIndex+1}}、{{processItem.productName}}</text><text class="li-right">{{processItem.num}}</text>
			    			</view>
			    		</view>
			    	</view>
			    </view>
				<view v-else>
					<u-empty text="暂无数据" mode="search" style="height: 700rpx;" icon-size="180" textSize="32"></u-empty>
				</view>
			</y-tab>
		</y-tabs>
		<!-- 选择时间 -->
		<SimpleDateTimePicker ref="myPicker" @submit="handleSubmit" :start-year="2000" :end-year="2100" :isYear="activeIndex===1"/>
		<!-- 选择用户 -->
		<SearchSelect ref="userSearchSelect" :options="userList" valKey="id" :showKey="'showKey'" @sure="userSelectSure" />
	</div>
</template>

<script>
	import SimpleDateTimePicker from "uni_modules/buuug7-simple-datetime-picker/components/buuug7-simple-datetime-picker/buuug7-simple-datetime-picker.vue";
	import SearchSelect from "@/components/J-Picker/jPicker.vue"
	import Api from '../../service/api'
	import {formateDate,getLastDay} from "@/utils/index.js"
	let message = (msg) => uni.showToast({icon:'none', duration:3000, title: msg})
	
	export default {
		components: {
			SimpleDateTimePicker,
			SearchSelect
		},
		data() {
			return {
				activeIndex: 0,
				userList:[],
				dataForm:{
					staffId:"", //员工id
					staffName:"", //员工姓名
					startDate:"", //开始日期
					endDate:"" //结束日期
				},
				currentTime:"",
				outputInfo:{},// 产量报工信息
				processList:[], //内容
			}
		},
		mounted(){
			this.getUserList()
		},
		methods: {
			//月产量和日产量切换
			tabChange(index, item){
				if(index===1){
					this.currentTime=this.formateDate('year')
					this.dataForm.startDate = `${this.currentTime}-01 00:00:00`;
					this.dataForm.endDate = `${this.getLastDay(this.currentTime.split('-')[0],this.currentTime.split('-')[1])} 23:59:59`;
				}else{
					this.currentTime=this.formateDate('month')
					this.dataForm.startDate = `${this.currentTime} 00:00:00`;
					this.dataForm.endDate = `${this.currentTime} 23:59:59`;
				}
				this.outputQuery()
			},
			formateDate, //格式化数据
			getLastDay, //获取当前月份最后一天
			// 获取所有生产单列表和人员列表
			async getUserList(){
				const {staffId,staffName}=this.$store.state.user
				//默认显示员工
				this.dataForm.staffId=staffId
				this.dataForm.staffName=staffName
				//默认显示当前日期
				this.currentTime=this.formateDate('month')
				this.dataForm.startDate = `${this.currentTime} 00:00:00`;
				this.dataForm.endDate = `${this.currentTime} 23:59:59`;
				// 人员
				let url = '/mes/mesemployee/list'
				let userRes = await Api.getAlluser(url)
				if(userRes.code === 0){
					this.userList = userRes.data.map(item => {
						return {id: item.id,showKey:`${item.realName}-${item.staffId}`,staffName:item.realName,staffId:item.staffId}
					})
					this.outputQuery()
				} else {
					message(userRes.msg)
				}
			},
			// 打开picker
			openDatetimePicker() {
			  this.$refs.myPicker.show();
			},
			//选中产量时间
			handleSubmit(e){
				this.dataForm.startDate = `${e.year}-${e.month}-${e.day} 00:00:00`;
				this.dataForm.endDate = `${e.year}-${e.month}-${e.day} 23:59:59`;
				this.currentTime=`${e.year}-${e.month}-${e.day}`
				this.outputQuery()
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
				if(Object.keys(val).length === 0) return
				this.dataForm.staffId = val.staffId
				this.dataForm.staffName = val.staffName
				this.outputQuery()
			},
			//查询报工
			async outputQuery(){
				if(!this.dataForm.startDate ||!this.dataForm.endDate||!this.dataForm.staffId){
					return message('请选择报工时间或者报工员工')
				}
				const ret=await Api.outputQuery(this.dataForm)
				if(ret.code!=0){
					return message(ret.msg)
				}
				this.outputInfo=ret.data
				if(ret.data.mesProduceOrderOuputQueryPageData.total>0){
					this.processList=ret.data.mesProduceOrderOuputQueryPageData.list
				}else{
					this.processList=[]
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.out-qeurty{
		height: 100%;
		.line{
			width: 100%;
			height: 1px;
			background-color: rgba(255,255,255,.6);
			transform: scaleY(0.3);
		}
		.iconfont{
			margin-left: 6rpx;
		}
		.out-select{
			background-color: $theme-color;
			color: #fff;
			padding: 0 20rpx;
			.out-time{
				height: 60rpx;
				line-height: 64rpx;
				font-size: 24rpx;
			}
			.out-statistics{
				font-size: 32rpx;
				height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.out-statistics-name{
					display: flex;
					align-items: center;
				}
			}
		}
		.out-content{
			padding: 0 12rpx;
			.out-recored{
				.out-record-info{
					background-color: #fff;
					border-radius: 20rpx;
					display: flex;
					padding: 16rpx;
					border-bottom: 1px dashed #E6E6E6;
					.out-recoed-info-left {
						margin-right: 24rpx;
						width: 160rpx;
						height: 160rpx;
					}
					.out-record-info-right{
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						.out-recoed-info-desicribe{
							color: #999999;
						}
					}
				}
				.ul{
					background-color: #fff;
					border-radius: 20rpx;
					padding: 10rpx 0;
					.li{
						background-color: #fff;
						height: 60rpx;
						padding: 0 20rpx 0 24rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						border-bottom: 1px dashed #E6E6E6;
						font-size: 28rpx;
						font-family: PingFangSC-Regular;
					}
				}
			}
		}
		
	}
	
</style>