<template>
	<view class="select_code" v-show="isShow">
		<view class="dialog_cover"></view>
		<transition>
			<view class="dialog_content">
				<view class="top">
					<view class="top_left" @click="confirm">取消</view>
					<view class="top_right" @click="confirm">确定</view>
				</view>
				<scroll-view class="search_content" scroll-y>
					<view>
						<checkbox-group @change="checkboxChange">
							<label class="option_item" v-for="(item, index) in options" :key="index">
								<view>
									<checkbox :value="item[value]" :checked="item.checked" />
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
			visible(val) {
				if (val) {
					this.isShow = val
					this.$nextTick(() => {
						// 再次打开时显示之前选中的值
						let items = this.optionList;
						for (let i = 0, lenI = items.length; i < lenI; ++i) {
							const itemI = items[i]
							for (let j = 0, lenJ = this.checkedValue.length; j < lenJ; j++) {
								let itemJ = this.checkedValue[j]
								if (itemI[this.label] == itemJ[this.label] && itemI[this.value] == itemJ[this
										.value]) {
									console.log(itemI)
									// this.$set(itemI, 'checked', true)
									item.checked=true
								} else {
									// this.$set(itemI, 'checked', false)
									item.checked=false
								}
							}
						}
						this.options = items
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

<style lang="scss" scoped>
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
		top: 40%;
		width: 100%;
		height: 80%;
		background-color: #FFFFFF;
		z-index: 300;
	}

	.top {
		width: 100%;
		height: 40px;
		display: flex;
		justify-content: space-between;
		text-align: center;
		line-height: 40px;
		background-color: #D7DEEB;
		border-radius: 5px;

		.top_left,
		.top_right {
			width: 20%;
			cursor: pointer;
		}
	}

	.search_content {
		height: 75%;
		margin-top: 20px;
		width: 100%;
		padding: 5px 0px 10px 0px;
		padding-bottom: 5%;

		.option_item {
			line-height: 40px;
			font-size: 16px;
			display: flex;
			margin: 0 15px;
			border-bottom: 1px solid #C0C4CC;
		}
	}
</style>
