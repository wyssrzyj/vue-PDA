<script>
	export default {
		onLaunch: function() {
			// console.log('App Launch')
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
/*每个页面公共css */
@import "colorui/main.css";
/*全局字体图标*/
@import url("./assets/iconfont/iconfont.css");
/*全局公用样式*/
@import url("./assets/common.css");
// #ifdef H5
checkbox .uni-checkbox-input {
	border-radius: 50%;
}
checkbox .uni-checkbox-input.uni-checkbox-input-checked {
	border: 1px solid #ff4500;
	background: #ff4500;
	color: #fff !important;
}
checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
	font-size: 18px;
}
// #endif

// #ifdef APP-PLUS || MP-WEIXIN
checkbox .wx-checkbox-input {
	border-radius: 50%;
}
checkbox .wx-checkbox-input.wx-checkbox-input-checked {
	border: 1px solid #ff4500;
	background: #ff4500;
	color: #fff !important;
}
checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
	font-size: 18px;
}
// #endif
</style>
