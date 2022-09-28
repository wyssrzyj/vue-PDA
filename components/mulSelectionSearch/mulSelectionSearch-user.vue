<template>
	<view class="mulSelectionSearch">
		<view>
			<!-- 普通弹窗 -->
			<uni-popup ref="popup" background-color="#fff" @change="change" class="updatePopup">
				<view>
					<view>
						<uni-row>
						    <uni-col :span="24">
						        <uni-search-bar style="margin-top: 15rpx;font-size: 3em;" :value="searchKey" radius="0" placeholder="搜索" clearButton="none" cancelButton="none" @input="search"/>
						    </uni-col>
						</uni-row>
						<picker-view v-if="visible" :value="pickerValue" indicator-style="height:70rpx;" @change="bindChange">
							<picker-view-column>
								<view class="item" v-for="(item,index) in pickerList" :key="index" @click="sureSelect()">
									<view style="width: 750rpx">{{item.realName}}—{{item.staffId }}</view>
								</view>
							</picker-view-column>
						</picker-view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>
 
<script>
	export default {
		props:{
			value:String //确认选择值
			,list:Array //数据列表
		}
		,watch:{
			list(){
				this.init()
			}
			,immediate: true
		}
		,data() {
			const defaultVal= //默认常量
			{
				global:{
					debug:true
					,title:'my-picker-view'
				}
				,show:{
					value:'未选择'
				}
				,search:{
					searchKey:''
				}
				,picker:{
					pickerValue:[0]
					,visible:true
					,pickerList:[]
					,isChoose:false
					,chooseVal:''
				}
			}
			return {
				defaultVal,
				title: '',
				debug:true,
				pickerValue:[],
				visible: true,
				pickerList:[],
				searchKey:'',
				isChoose:true,
				chooseVal:''
			}
		}
		,mounted() {//初始化
			this.init()
		}
		,methods: {
			change(e) {
				// console.log('当前模式：' + e.type + ',状态：' + e.show);
				if(e.type=='center'&&e.show==false){
					this.resetSearch()
				}
			}
			,toggle(type) {
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(type)
			}
			,sureSelect(){
				this.$emit('input',this.chooseVal.realName + '—' + this.chooseVal.staffId);
				this.$emit('selectSure',this.chooseVal)
				this.$refs.popup.close()
				this.resetSearch()
			}
			,cancelChange(){
				this.$refs.popup.close()
				this.resetSearch()
			}
			,requestList(){//请求列表数据
				this.defaultVal.show.value=this.value
				this.defaultVal.picker.pickerList=this.list
				this.defaultVal.picker.pickerValue=[this.defaultVal.picker.pickerList.length-1]
				this.defaultVal.picker.chooseVal=this.defaultVal.picker.pickerList[this.defaultVal.picker.pickerValue[0]]
			}
			,resetAll(){//重置或初始化默认设置
				//初始化初始值
				this.debug=this.deepCopy(this.defaultVal.global.debug)
				this.title=this.deepCopy(this.defaultVal.global.title)
				this.searchKey=this.deepCopy(this.defaultVal.search.searchKey)
				this.pickerList=this.deepCopy(this.defaultVal.picker.pickerList)
				this.asc=this.deepCopy(this.defaultVal.picker.asc)
				this.visible=this.deepCopy(this.defaultVal.picker.visible)
				this.pickerValue= this.deepCopy(this.defaultVal.picker.pickerValue)
				this.isChoose=this.deepCopy(this.defaultVal.picker.isChoose)
				this.chooseVal=this.deepCopy(this.defaultVal.picker.chooseVal)
			}
			,init(){
				this.requestList()
				this.resetAll()
			}
			,bindChange(e){
				this.chooseVal=this.pickerList[e.detail.value[0]]
			}
			,search(e){
				this.searchKey=e
				if(this.searchKey==''){
					this.resetSearch()
				}else{
					this.pickerList.splice(0,this.pickerList.length)
					this.debuglog('this.searchKey')
					this.debuglog('this.defaultVal.picker.pickerList')
					for(let i=0;i<=this.defaultVal.picker.pickerList.length-1;i++){
						debugger
						let searchVal=this.defaultVal.picker.pickerList[i].realName.toString()
						if(searchVal.indexOf(this.searchKey)!=-1){
							this.pickerList.push(this.defaultVal.picker.pickerList[i])
						}
					}
					this.pickerValue=[this.pickerList.length-1]
					this.chooseVal=this.pickerList[this.pickerValue[0]]
				}
			}
			,resetSearch(){
				this.searchKey=''
				this.pickerList.splice(0,this.pickerList.length)
				this.pickerList= this.deepCopy(this.defaultVal.picker.pickerList);
				this.pickerValue=[this.pickerList.length-1]
				this.chooseVal=this.pickerList[this.pickerValue[0]]
			}
			,debuglog(obj,open){
				if(open==true||open==undefined){
					if(this.debug){
						console.log('debug调试中，检测的对象'+obj+'内容为'+JSON.stringify(obj))
					}
				}
			}
			,deepCopy(obj) 
			{
				// 判断如果不是引用类型，直接返回数据即可
				if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || typeof obj === 'undefined' || !obj) 
				{
					return obj
				}  
				return JSON.parse(JSON.stringify(obj));
			}
		}
	}
</script>
 
<style lang="less">
	.mulSelectionSearch{
		picker-view {
		    width: 100%;
		    height: 500rpx;
		}
		picker-view-column{
			.item {
				font-size: 35rpx;
				font-weight: blod;
			    line-height: 70rpx;
			    text-align: left;
				padding: 0 130rpx;
			}
		}
	}
</style>