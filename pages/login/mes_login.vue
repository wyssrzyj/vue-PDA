<template>
	<view class="container" :style="bodyStyle">
		<view class="logoBox">
			<image src="../../static/login/logo.png" mode="widthFix" class="logo"/>
		</view>
			<!-- 密码登录 -->
		<view class=""  v-if="passwordType">
			<form @submit="formSubmit" class="form-box">
				<view class="cu-form-group input-ba">
					<image src="../../static/login/username@3x.png" class="icon-login" />
					<input class="input-box" placeholder="请输入账号" name="username" v-model="username"/>
				</view>
				<view class="cu-form-group margin-lr-xl input-ba">
					<image src="../../static/login/password.png" class="icon-login" />
					<input class="input-box" type="password" placeholder="请输入密码" name="password" v-model="password" />
				</view>
				<view style="padding-left: 50rpx;">
					<checkbox-group @change="changeRemember">
						<label>
							<checkbox value="true" checked="true" style="padding-right: 10px;" />记住密码
						</label>
					</checkbox-group>
				</view>
				<view class="padding flex flex-direction margin-top-xl">
					<button class="cu-btn bg-blue lg btn-login" form-type="submit">登录</button>
				</view>
				
			</form>
			<view class="bottom-title" @click="setPassword(false)">扫描二维码登陆 </view>
			
		</view>
		<!-- //二维码登录 -->
		<view class="" v-if="!passwordType">
			<image src="../../static/login/scanCode.png" mode="widthFix" class="erlogo" />
		 <view class="bottom-title" @click="setPassword(true)">账号密码登陆 </view>
		</view>
	
		
		<!-- 选择环境弹窗 -->
		<!-- <select-api ref="select"></select-api> -->
		<new-select-api ref='select'></new-select-api>
		<new-select-version ref='select1'></new-select-version>
		<scanCode></scanCode>
	</view>
</template>

<script>
import { toasting } from '../../utils/index.js'
import Api from '../../service/api'
import selectApi from './select-api.vue'
import newSelectApi from './new-select-api.vue'
import newSelectVersion from "./new-select-version.vue"
import scanCode from "@/components/scan/scan.vue";
import selectCodeMultiple from "@/components/mulSelection/mulSelection.vue";
import {Store} from 'vuex'; 

	let message = (msg, time = 3000) =>
		uni.showToast({
			icon: "none",
			duration: time,
			title: msg
		});

export default {
	
	data(){
		return {
			username:"",
			password:"",
			remember:true,
			passwordType:true,// 密码/扫码 登录切换
		}
	},
	components:{
		scanCode,
		'select-api':selectApi,
		'new-select-api':newSelectApi,
		'new-select-version':newSelectVersion
	},
	onLoad() {
		if(uni.getStorageSync('username')) this.username = uni.getStorageSync('username')
		if(uni.getStorageSync('password')) this.password = uni.getStorageSync('password')
		
		// 判断上次的登录类型
		if (uni.getStorageSync("logoType")){
			this.passwordType = uni.getStorageSync("logoType");
		}
	},
	onShow() {
		uni.$off("scancodedate"); // 每次进来先 移除全局自定义事件监听器
		uni.$on("scancodedate", (data) => { 
		// 扫描PCS码
		this.scanLog(decodeURI(data.code));
		});
		
		// uni.removeStorageSync("token")
	},
	onNavigationBarButtonTap(Object){
		if(Object.type==='favorite'){
			this.$refs.select.showSelect = !this.$refs.select.showSelect
		}else if(Object.type==='menu'){
			this.$refs.select1.showSelect = !this.$refs.select1.showSelect
			this.$refs.select1.getInfo()
		}
	},
	computed:{
			bodyStyle(){
				return {'min-height':`calc(100vh - ${uni.getSystemInfoSync().windowTop * 2}rpx)`}
			}
	},
	methods:{
		// 是否记住密码
		changeRemember(e){
			e.detail.value.length === 0 ? this.remember = false : this.remember = true
		},
		
		//扫码登录成功失败操作
		async successfully(newId) {
			const res = await Api.scanLogin({
				id: newId,
			});
			if (res.code === 0) {
				toasting('登录成功')
				uni.removeStorageSync('token')
				uni.setStorageSync('token', res.data.token)
				if (this.remember) {
					uni.setStorageSync('username', this.username)
					uni.setStorageSync('password', this.password)
				} else {
					uni.removeStorageSync('username')
					uni.removeStorageSync('password')
				}
				
				uni.navigateTo({
					url: '/pages/cutWarehouse/mes_cutWarehouse'
				})
				uni.setStorageSync("logoType", this.passwordType);//登录类型保存
				Api.pdaNav({}).then(res => {
				})
				Api.getPermissions().then(res => {
					// $store.commit('set_is_b_link', true)
					this.$store.commit('setPermissions', res.data)
				})
				this.$store.dispatch('initApp')
				this.$store.dispatch('updateStaff')
				// uni.switchTab({
				// 	url:'/pages/cutWarehouse/cutWarehouse'
				// })
			}else if(res.code === 10004){
				toasting('用户名或密码错误！')
			}else if(res.code!==1005){
				toasting('账号已被停用！')
			}else{
				toasting(res.msg)
			}
			
		},
		
		
		//密码/扫码 登录切换
		setPassword(e){
			this.passwordType=e
		},
		//扫码登录
		scanLog(val) {
			if (!this.$refs.select.api) {
				toasting("请先点击右上角并输入环境地址！", () => {}, 3000);
				return;
			}
			//扫码登录
			if(this.passwordType===false){
				let typeValue = val.substr(0, 2);
				//01开头的是员工码
				if (typeValue === "01") {
					let newId = val.slice(2);
					this.successfully(newId);
				} else {
					toasting("请扫描员工码", () => {}, 3000);
				}
				
			}
			
		},
		
		async formSubmit(e){
			if(!this.$refs.select.api) {
				toasting('请先点击右上角并输入环境地址！', ()=>{}, 3000)
				return
			}
			try {
				const { username, password } = e.detail.value
				if(!username){
					toasting('请输入用户名')
					return
				}else if(!password){
					toasting('请输入密码')
					return
				}
				const res=await Api.login({  
					username: username,
					password: password,
				})
				
				if (res.code === 0) {
					toasting('登录成功')
					uni.removeStorageSync('token')
					uni.setStorageSync('token', res.data.token)
					if (this.remember) {
						uni.setStorageSync('username', this.username)
						uni.setStorageSync('password', this.password)
					} else {
						uni.removeStorageSync('username')
						uni.removeStorageSync('password')
					}
					
					uni.navigateTo({
						url: '/pages/cutWarehouse/mes_cutWarehouse'
					})
					
					Api.pdaNav({}).then(res => {
					})
					Api.getPermissions().then(res => {
						// $store.commit('set_is_b_link', true)
						this.$store.commit('setPermissions', res.data)
					})
					this.$store.dispatch('initApp')
					this.$store.dispatch('updateStaff')
					// uni.switchTab({
					// 	url:'/pages/cutWarehouse/cutWarehouse'
					// })
				}else if(res.code === 10004){
					toasting('用户名或密码错误！')
				}else if(res.code!==1005){
					toasting('账号已被停用！')
				}else{
					toasting(res.msg)
				}
			} catch (error) {
				toasting('请输入正确的地址！')
				console.log(error)
			}
		}
	}
}
</script>


<style lang="scss" scoped>
::v-deep uni-checkbox .uni-checkbox-input {
	border-radius: 5px;
}
::v-deep uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
	border: 1px solid #007aff;
	background: #007aff;
	color: #fff !important;
}
.container {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #fff;
	.logoBox{
		width: 466rpx;
		height: 58rpx;
		margin-top: 150rpx;
		margin-bottom: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		.logo{
			width: 100%;
			height: 100%;
		}
	}
	.form-box{
		margin-top: 130rpx;
		.input-ba{
			width: 576rpx;
			height: 56rpx;
			margin: 0 auto;
			margin-bottom: 64rpx;
			background-color: #f2f3f6;
			border-radius: 59rpx;
			.icon-login{
				width: 60rpx;
				height: 60rpx;
				margin:0 40rpx;
			}
			.input-box{
				font-size: 28rpx;
			}	
		}
		.btn-login{
			width: 576rpx;
			height: 100rpx;
			font-size: 36rpx;
			border-radius: 59rpx;
			margin-top: 40rpx;
			background-color: #0C99F2;
		}
	}
}
.bottom-title {
	height: 100rpx;
	// background: red;
	color:rgb(12, 153, 242);;
	margin-top: 20rpx;
	width: 100%;
	text-align: center;
	font-size: 48rpx;
}
.erlogo{
	margin-top: 120rpx;
	margin-bottom: 120rpx;
	width: 100%;
	height: 100%;
	 transform: scale(1.2);
} 
</style>
