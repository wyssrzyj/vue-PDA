<template>
	<view class="container">
		<view class="logoBox">
			<image src="../../static/login/logo.png" mode="widthFix" class="logo"/>
		</view>
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
		
		<!-- 选择环境弹窗 -->
		<!-- <select-api ref="select"></select-api> -->
		<new-select-api ref='select'></new-select-api>
		<new-select-version ref='select1'></new-select-version>
	</view>
</template>

<script>
import { toasting } from '../../utils/index.js'
import Api from '../../service/api'
import selectApi from './select-api.vue'
import newSelectApi from './new-select-api.vue'
import newSelectVersion from "./new-select-version.vue"
import {Store} from 'vuex'; 

export default {
	data(){
		return {
			username:"",
			password:"",
			remember:true
		}
	},
	components:{
		'select-api':selectApi,
		'new-select-api':newSelectApi,
		'new-select-version':newSelectVersion
	},
	onLoad() {
		// uni.getSystemInfo({
		// 	success: (res) => {
		// 		// uni.setStorageSync('screenWidth',res.screenWidth)
		// 		// uni.setStorageSync('screenHeight',res.screenHeight)
		// 		console.log(res)
		// 	}
		// })
		if(uni.getStorageSync('username')) this.username = uni.getStorageSync('username')
		if(uni.getStorageSync('password')) this.password = uni.getStorageSync('password')
	},
	onShow() {
		uni.removeStorageSync("token")
	},
	onNavigationBarButtonTap(Object){
		if(Object.type==='favorite'){
			this.$refs.select.showSelect = !this.$refs.select.showSelect
		}else if(Object.type==='menu'){
			this.$refs.select1.showSelect = !this.$refs.select1.showSelect
			this.$refs.select1.getInfo()
		}
	},
	methods:{
		// 是否记住密码
		changeRemember(e){
			e.detail.value.length === 0 ? this.remember = false : this.remember = true
		},
		formSubmit(e){
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
				Api.login({  
					username: username,
					password: password,
				}).then(res => {
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
						// uni.switchTab({
						// 	url:'/pages/cutWarehouse/cutWarehouse'
						// })
					}else if(res.code === 10004){
						toasting('用户名或密码错误！')
					}
				}).catch(res=>{
					console.log(res)
				})
			} catch (error) {
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
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #fff;
	.logoBox{
		width: 466rpx;
		height: 58rpx;
		margin-top: 150rpx;
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
</style>
