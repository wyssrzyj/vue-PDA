<template>
	<view class="container">
		<view class="logoBox">
			<image src="../../static/login/logo.png" mode="widthFix" class="logo"/>
		</view>
		<form @submit="formSubmit" class="form-box">
			<view class="cu-form-group input-ba">
				<image src="../../static/login/username@3x.png" class="icon-login" />
				<input class="input-box" placeholder="请输入账号" name="username" value=""/>
			</view>
			<view class="cu-form-group margin-lr-xl input-ba">
				<image src="../../static/login/password.png" class="icon-login" />
				<input class="input-box" type="password" placeholder="请输入密码" name="password" value="" />
			</view>
			<view class="padding flex flex-direction margin-top-xl">
				<button class="cu-btn bg-blue lg btn-login" form-type="submit">登录</button>
			</view>
			<!-- <view class="padding flex flex-direction" v-if="type!=='dd'">
				<view class="text-blue lg text-center" @tap="register">注册</view>
			</view> -->
		</form>
		
		<!-- 选择环境弹窗 -->
		<select-api ref="select"></select-api>
	</view>
</template>

<script>
// import { defineComponent, ref, reactive, toRefs, onMounted } from 'vue';
import { toasting } from '../../utils/index.js'
import Api from '../../service/api'
import selectApi from './select-api.vue'
import {Store} from 'vuex'; 

export default {
	components:{
		'select-api':selectApi
	},
	// name: 'login',
	onLoad() {
	},
	onShow() {
		// uni.setNavigationBarTitle({
		// 	title: '登录'
		// })
		uni.removeStorageSync("token")
	},
	onNavigationBarButtonTap(){
		this.$refs.select.showSelect = !this.$refs.select.showSelect
	},
	methods:{
		formSubmit(e){
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
						console.log(res)
						if (res.code === 0) {
							toasting('登录成功')
							uni.removeStorageSync('token')
							uni.setStorageSync('token', res.data.token)
							uni.navigateTo({
								url: '/pages/cutWarehouse/mes_cutWarehouse'
							})
							Api.pdaNav({}).then(res => {
							})
							Api.getPermissions().then(res => {
								// $store.commit('set_is_b_link', true)
								this.$store.commit('setPermissions', res.data)
							})
							// uni.switchTab({
							// 	url:'/pages/cutWarehouse/cutWarehouse'
							// })
						}else{
							toasting('账号或密码错误')
						}
					})
				} catch (error) {
					console.log(error)
				}
			}
	}
	// setup() {
	// 	const formSubmit = (e) => {
	// 		try {
	// 			const { username, password } = e.detail.value
	// 			if(!username){
	// 				toasting('请输入用户名')
	// 				return
	// 			}else if(!password){
	// 				toasting('请输入密码')
	// 				return
	// 			}
				
	// 			Api.login({
	// 				username: username,
	// 				password: password,
	// 			}).then(res => {
	// 				if (res.code === 0) {
	// 					toasting('登录成功')
	// 					uni.removeStorageSync('token')
	// 					uni.setStorageSync('token', res.data.token)
	// 					uni.navigateTo({
	// 						url: '/pages/cutWarehouse/cutWarehouse'
	// 					})
	// 					// uni.switchTab({
	// 					// 	url:'/pages/cutWarehouse/cutWarehouse'
	// 					// })
	// 				}
	// 			})
	// 		} catch (error) {
	// 			console.log(error)
	// 		}
	// 	}
		
	// 	return {
	// 		formSubmit
	// 	}
	// }
}
</script>


<style lang="scss" scoped>
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
		margin-top: 286rpx;
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
			margin-top: 100rpx;
			background-color: #0C99F2;
		}
	}
}
</style>
