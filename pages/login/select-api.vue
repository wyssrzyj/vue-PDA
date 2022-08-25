<template>
	<view class="main" v-if="showSelect">
		<view class="mask" @touchmove.stop.prevent="()=>{}" @click="maskClick"></view>
		<view class="select">
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
			<button @click="query" class="btn">确定</button>
		</view>
	</view>
</template>

<script>
import {changeApi} from '../../service/api'
export default{
	data() {
		return {
			showSelect:false,
			items: [
				{value: '192.168.0.235:8081',name: '线上地址'}
				,{value: '58.210.184.228:9091',name: '可祺外网'}
				,{value: '192.168.99.140:8081',name: '测试地址'}
				// ,{value: '192.168.1.5/proxyApi',name: '盛宝丽'}
				// ,{value: '192.168.68.28:8081',name: '蔡鹏志'}
				// ,{value: '10.18.34.6:8081',name: '熊锋'}
				// ,{value: '10.18.56.96:8081',name: '周志键'}
				// ,{value: '192.168.68.58:8081',name: '李国庆'}
				// ,{value: '192.168.68.58:8081',name: '李国庆'}
			],
			current: 0,
			api:'192.168.0.235:8081',
			queryCurrent:0,
			queryApi:'192.168.0.235:8081'
		}
	},
	mounted() {
		changeApi(this.api)
	},
	watch:{
		showSelect:function(newValue){
			if(newValue){
				this.current = this.queryCurrent
				this.api = this.queryApi
			}
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
		maskClick(){
			this.showSelect = false
		},
		query(){
			if(this.api.trim()=='') {
				uni.showToast({
					title:'请选择环境变量！',
					icon:'error'
				})
				return;
			}
			changeApi(this.api)
			this.showSelect = false
			this.queryCurrent = this.current
			this.queryApi = this.api
			uni.showToast({
				title:'修改成功！',
				icon:'success'
			})
		}
	}
}
</script>

<style lang="less">
.select{
	z-index: 2;
	background-color: #FFFFFF;
	width: 500rpx;
	// height: 1000rpx;
	// height: 500rpx;
	border-radius: 20rpx;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.mask {
	z-index: 1;
	position: fixed;
	top: 0;
	left:0;
	right: 0;
	bottom: 0;
	background-color: rgba(0,0,0, 0.6);
}
.uni-list-cell{
	margin-top: 20rpx;
	display: flex;
	width: 300rpx;
	height: 70rpx;
	margin-left: 100rpx;
	.radio{
		line-height: 70rpx;
	}
	.name{
		line-height: 70rpx;
		text-align: center;
		font-weight: bold;
		width: 150rpx;
		font-size: 30rpx;
	}
}
.input{
	margin-top: 20rpx;
	width: 100%;
	height: 100rpx;
	background-color: #eee;
	text-align: center;
}
.btn{
	width: 100%;
	height:100rpx;
	background-color: #0c99f2;
	margin: 10rpx 0;
	font-size: 40rpx;
	color: #FFFFFF;
	line-height: 100rpx;
	border-radius: 50rpx;
}
</style>
