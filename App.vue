<script>
	export default {
		onLaunch: function() {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation("portrait-primary")
			// #endif
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
@import url("./assets/iconfont/iconfont-weapp-icon.css");
/*全局公用样式*/
@import url("./assets/common.scss");
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
 /* radio 选中后的样式 */
uni-radio .uni-radio-input.uni-radio-input-checked{
	background-color: #1890FF!important;
	border-color: #1890FF!important;
	background-clip: content-box!important;
	padding: 10rpx!important;
	box-sizing: border-box;
}

/* radio 选中后的图标样式*/
uni-radio .uni-radio-input.uni-radio-input-checked::before{
	display: none!important;
}
</style>
