<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title" @tap="handle">{{ title }}</text>
		</view>
	</view>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
	onLoad() {
		console.log('onLoad')
	},
	onShow() {
		console.log('onShow')
	},
	setup() {
		const state = reactive({
			title: 'Hello'
		})
		
		const handle = () => {
			console.log('handle')
		}
		
		return {
			...toRefs(state),
			handle
		};
	}
});
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
