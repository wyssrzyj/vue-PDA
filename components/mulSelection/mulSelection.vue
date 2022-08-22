<template>
	<view class="select_code" v-show="isShow">
		<view class="dialog_cover" @touchmove.prevent="()=>{}"></view>
		<transition>
			<view class="dialog_content">
				<view class="top">
					<view class="top_left" @click="confirm">取消</view>
					<view class="top_right" @click="confirm">确定</view>
				</view>
				<scroll-view class="search_content" scroll-y>
					<view>
						<checkbox-group @change="checkboxChange">
							<label class="option_item" v-for="(item, index) in options" :key="index" style="overflow: hidden;">
								<view>
									<checkbox :value="item[value]" :checked="item.checked" style="transform:scale(0.8)"/>
								</view>
								<view>{{item[label]}}</view>
							</label>						
						</checkbox-group>
					</view>
				</scroll-view>
			</view>
		</transition>
	</view>
</template>

<script>
	export default {
		components: {},
		props: {
			//下拉项的值
			value: {
				type: String,
				default: 'value'
			},
			//下拉项显示的名称
			label: {
				type: String,
				default: 'name'
			},
			//控制打开
			visible: {
				type: Boolean,
				default: false
			},
			//下拉数据
			optionList: {
				type: Array,
				default: () => []
			},
			//之前选中的值
			checkedValue: {
				type: Array,
				default: () => []
			}
		},
		watch: {
			visible(oldVal,newValue) {
				if (oldVal) {
					this.isShow = oldVal
					this.$nextTick(() => {
						this.optionList.forEach(item=>{
							if(!item.checked){
								item.checked=false
							}
						})
						this.checkedValue.forEach(item=>{
							this.optionList.forEach(j=>{
								if(item.name==j.name&&item.value==j.value){
									j.checked=true
								}
							})
						})
						// 再次打开时显示之前选中的值
						// let items = this.optionList.map(item=>{
						// 	if(!item.checked){
						// 		return {...item,checked:false}
						// 	}else{
						// 		return item
						// 	}
						// })
						// let items=this.checkedValue
						// for (let i = 0, lenI = items.length; i < lenI; ++i) {
						// 	const itemI = items[i]
						// 	for (let j = 0, lenJ = this.optionList.length; j < lenJ; j++) {
						// 		let itemJ = this.optionList[j]
						// 		if (itemI.name == itemJ.name) {
						// 			// this.$set(itemI, 'checked', false)
						// 			itemJ.checked=false
						// 		} else {
						// 			// this.$set(itemI, 'checked', true)
						// 			itemJ.checked=true
						// 		}
						// 	}
						// }
						this.options = this.optionList
					})
				}
			},
		},
		data() {
			return {
				//下拉数据
				options: [],
				//是否显示
				isShow: false
			}
		},
		computed: {},
		onLoad(option) {},
		onShow() {},
		// 离开页面
		onUnload() {},
		onHide() {},
		methods: {
			//处理勾选
			checkboxChange(e) {
				let items = this.optionList;
				let values = e.detail.value;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if (values.includes(item.value)) {
						this.$set(item, 'checked', true)
					} else {
						this.$set(item, 'checked', false)
					}
				}
			},
			//确定操作
			confirm() {
				let result = this.options.filter(e => e.checked)
				this.$emit('confirm', result)
				this.isShow = false
			}
		}
	}
</script>

<style lang="scss">
	::v-deep .uni-checkbox-input-checked{
		background-color: #007AFF!important;
		border:1px solid #007AFF!important;
		color: #FFFFFF!important;
	}
	.select_code {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		position: relative;
	}

	.dialog_cover {
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		z-index: 200;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.dialog_content {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 460rpx;
		background-color: #FFFFFF;
		z-index: 300;
	}

	.top {
		width: 100%;
		height: 92rpx;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #EAEAEA;
		line-height: 92rpx;
		font-size: 36rpx;
		text-align: center;
		.top_left{
			width: 120rpx;
			color: #666666;
		}
		.top_right {
			width: 120rpx;
			color: #0C99F2;
		}
	}

	.search_content {
		height: 368rpx;
		width: 100%;
		.option_item {
			height: 92rpx;
			line-height: 92rpx;
			font-size: 24rpx;
			color: #666666;
			border-bottom: 1px solid #EAEAEA;
			display: flex;
			padding-left: 90rpx;
			view:first-child{
				margin-right: 30rpx;
			}

		}
		.option_item:last-child{
			border-bottom: 0;
		}
	}
	.uni-checkbox-input-checked{
		background-color: #000000!important; 
		color: #FFFFFF!important;
	}
</style>
