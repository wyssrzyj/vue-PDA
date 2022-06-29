export const hasToken = () => {
	const token = uni.getStorageSync('token');
	return token ? token : null
}

// 数组去重
export const arrayToHeavy = (arr) => {
	let obj = {};
	arr = arr.reduce(function(item, next) {
	   obj[next.id] ? '' : obj[next.id] = true && item.push(next);
	   return item;
	}, []);
	return arr
}

export const touchStart = (e) => {
	if (e.touches.length == 1) {
		//设置触摸起始点水平方向位置
		return e.touches[0].clientX
	}
}

export const touchMove = (e, startX, inStorageArr) => {
	if (e.touches.length == 1) {
		let index = e.currentTarget.dataset.index;
		//手指移动时水平方向位置
		let moveX = e.touches[0].clientX;
		//手指起始点位置与移动期间的差值
		let disX = startX - moveX;
		let delBtnWidth = 40;
		let txtStyle = "";
		let list = inStorageArr;
		if (disX == 0 || disX < 0) {//如果移动距离小于等于0，说明向右滑动，文本层位置不变
			txtStyle = "left:0px";
			list[index].arrowFlag = true;
		} else if(disX > 0){//移动距离大于0，文本层left值等于手指移动距离
			list[index].arrowFlag = false;
			txtStyle = "left:-" + disX + "px";
			if (disX >= delBtnWidth) {
				//控制手指移动距离最大值为删除按钮的宽度
				txtStyle = "left:-" + delBtnWidth + "px";
			}
		}
		//获取手指触摸的是哪一项
		list[index].txtStyle = txtStyle;
		// 更新列表的状态
		return list
	}
}

export const touchEnd = (e, startX, inStorageArr) => {
	if (e.changedTouches.length == 1) {
		//手指移动结束后水平位置
		let endX = e.changedTouches[0].clientX;
		//触摸开始与结束，手指移动的距离
		let disX = startX - endX;
		let delBtnWidth = 40;
		//如果距离小于删除按钮的1/2，不显示删除按钮
		let txtStyle = disX > delBtnWidth / 3 ? "left:-" + delBtnWidth + "px" : "left:0px";
		//获取手指触摸的是哪一项
		let index = e.currentTarget.dataset.index;
		let list = inStorageArr;
		list[index].txtStyle = txtStyle;
		// 更新列表的状态
		return list
	}
}

export const toasting = (message, func = () => {}, time = 1000) => {
	uni.showToast({
		title: message,
		icon: 'none',
		duration: time,
		success: function() {
			let timer = setTimeout(async () => {
				clearTimeout(timer)
				uni.hideToast()
				func ? await func() : console.log('toasting no func')
			}, time)
		}
	})
}

//将当前时间戳转换成时间格式
export const formateDate = ()=> {
      let date = new Date();
      let y = date.getFullYear();
      let m = (date.getMonth() + 1);
      let d = date.getDate();
      let h = date.getHours();
      let mi = date.getMinutes();
      let s = date.getSeconds();
      m = m > 9 ? m : "0" + m;
      h = h > 9 ? h : "0" + h;
      mi = mi > 9 ? mi : "0" + mi;
      s = s > 9 ? s : "0" + s;
      return y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s;
}

//通过value寻找key

export const findKey=(obj, value, compare = (a, b) => a === b)=> {
  return Object.keys(obj).find(k => compare(obj[k], value))
}

export const checkPermission = (permission,key) =>{
	return permission.includes(key)
}


/**
 * 节流函数 `created() {this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);}`
 * @param fn
 * @param wait
 * @returns
 */
export const useDebounce=(func, wait=1500)=> {
　　　if (typeof func !== 'function') {
　　　　throw new TypeError('need a function arguments')
　　　}
　　　let timeid = null;
     let result;
　　　return function() {
　　　　let context = this;
　　　　let args = arguments;

　　　　if (timeid) {
　　　　　　clearTimeout(timeid);
　　　　}
　　　　timeid = setTimeout(function() {
　　　　　　result = func.apply(context, args);
　　　　}, wait);
 
　　　　return result;
　　 }
}

