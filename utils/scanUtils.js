export const setOnKeyEventListener=()=> {
	let that = this;
	// longyoungKeyEventListen = uni.requireNativePlugin('longyoung-KeyEventListen');//引用插件
	//设置监听，可设置多个，回调按 tag 区分哪个监听返回。
	longyoungKeyEventListen.setOnKeyEventListenerLy({
		tag: that.tag //不必理会，固定 1 就好
	}, result => {
		if (!result.keyCode) {
			that.resultStr += '\n' + JSON.stringify(result) + '\n';
		}
		if (result && result.return_code == 'SUCCESS') {
			if (result.return_type == 'dataBack') { //return_type=dataBack是返回数据标识，返回的数据在此获取

				//页面只显示1和a，供查看数据结构
				if (result.keyCode == 'KEYCODE_1' || result.keyCode == 'KEYCODE_A') {
					that.resultStr += '\n' + JSON.stringify(result) + '\n';
				}
				that.handleData(result);
			}
		}
	});
}
export const disableAllOnKeyEventListener=()=> {
	let that = this;
	//取消所有监听
	longyoungKeyEventListen.disableAllOnKeyEventListenerLy({}, result => {
		that.resultStr += '\n' + JSON.stringify(result) + '\n';
		if (result && result.return_code == 'SUCCESS') {
			console.log("取消所有监听成功")
		}
	});
}
