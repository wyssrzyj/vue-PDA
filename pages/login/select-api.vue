<template>
	<view> 
		<view class="uni-list">
			<radio-group @change="radioChange">
				<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
					<view class="radio">
						<radio :value="item.value" :checked="index === current" />
					</view>
					<view class="name">{{item.name}}</view>
				</label>
			</radio-group>
		</view>
		<input type="text" v-model="api" class="input" placeholder="请选择或输入环境地址">
		<button @click="toLogin" class="btn">去登录</button>
	</view>
</template>

<script>
export default{
	data() {
		return {
			items: [
				{value: '192.168.99.140:8081',name: '测试地址'},
				{value: '192.168.1.5/proxyApi',name: '盛宝丽',},
				{value: '192.168.68.28:8081',name: '蔡鹏志'},
				{value: '192.168.68.36:8081',name: '雄峰'},
				{value: '10.18.56.96:8081',name: '周志键'},
				{value: '192.168.68.58:8081',name: '李国庆'},
			],
			current: null,
			api:''
		}
	},
	mounted() {
		if(uni.getStorageSync('API_ADDRESS')){
			this.current=uni.getStorageSync('API_ADDRESS').current
			this.api=uni.getStorageSync('API_ADDRESS').api
		}
	},
	methods:{
		radioChange(e) {
		    for (let i = 0; i < this.items.length; i++) {
		        if (this.items[i].value === e.detail.value) {
		            this.current = i;
		            break;
		        }
		    }
			this.api=e.detail.value
		},
		toLogin(){
			if(this.api.trim()=='') {
				uni.showToast({
					title:'请选择环境变量！',
					icon:'error'
				})
				return;
			}
			uni.setStorageSync('API_ADDRESS',{api:this.api,current:this.current})
			uni.redirectTo({
				url:'/pages/login/mes_login'
			})
		}
	}
}
</script>

<style lang="less">
	page{
		background-color: #FFFFFF;
		height: 100%;
	}
.uni-list-cell{
	margin-top: 20rpx;
	display: flex;
	width: 300rpx;
	height: 100rpx;
	margin-left: 100rpx;
	.radio{
		line-height: 100rpx;
	}
	.name{
		line-height: 100rpx;
		text-align: center;
		font-weight: bold;
		width: 150rpx;
		font-size: 30rpx;
	}
}
.input{
	margin-top: 40rpx;
	width: 100%;
	height: 100rpx;
	background-color: #eee;
	text-align: center;
}
.btn{
	width: 100%;
	height:100rpx;
	background-color: #0c99f2;
	position: absolute;
	bottom: 20rpx;
	font-size: 40rpx;
	color: #FFFFFF;
	line-height: 100rpx;
	border-radius: 50rpx;
}
</style>
