<template>
	<view >
		<scan-code />
	</view>
</template>

<script>
	import scanCode from "@/components/scan/scan.vue";
	
	let message = (msg, time = 3000) =>
		uni.showToast({
			icon: "none",
			duration: time,
			title: msg
		});
		

	export default {
		components: {
			scanCode,
		},
		data() {
			return {
			};
		},
		onShow() {
			uni.$off("scancodedate"); // 每次进来先 移除全局自定义事件监听器
			uni.$on("scancodedate", (data) => {
				// 扫描PCS码
				message(decodeURI(data.code));
				console.log("扫描PCS码",decodeURI(data.code));
			});
		},
		mounted() {
		},
		methods: {},
	};
</script>

<style lang="scss" scoped>
	
</style>