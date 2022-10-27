<template>
	<view class="out-sourcing">
		<view class="storage">
			<view class="storage-item">
				<text class="storage-item-left"><text style="color:red">*</text>外协类型</text>
				<!-- <hpy-form-select :dataList="sectionList" text="dictLabel" name="dictValue" v-model="modelData.billType" @change="sectionSelectClick" islot="true"> -->
					<view class="storage-item-right" @tap="show1=true">
						<text class="info-active" v-if="modelData.billName">{{modelData.billName}}</text>
						<text class="info" v-else>{{'请选择类型'}}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				<!-- </hpy-form-select> -->
			</view>
			<view class="storage-item">
				<text class="storage-item-left"><text style="color:red">*</text>外协工厂</text>
				<!-- <hpy-form-select :dataList="sectionList1" text="name" name="id" v-model="modelData.customerName" @change="sectionSelectClick1" islot="true">
					<view class="storage-item-right" style="display: flex;">
						<text class="info-active" v-if="modelData.customerName">{{modelData.customerName}}</text>
						<text class="info" v-else>{{'请选择工厂'}}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</hpy-form-select> -->
				<view class="storage-item-right" style="display: flex;" @tap="show=true">
					<text class="info-active" v-if="modelData.customerName">{{modelData.customerName}}</text>
					<text class="info" v-else>{{'请选择工厂'}}</text>
					<text class="iconfont icon-youjiantou"></text>
				</view>
			</view>
			<view class="storage-item">
				<text class="storage-item-left"><text style="color:red">*</text>期望交期</text>
				<view class="storage-item-right" @tap="openDatetimePicker">
					<text class="info-active" v-if="modelData.deliverTime">{{modelData.deliverTime}}</text>
					<text class="info" v-else>{{'请选择期望交期'}}</text>
					<text class="iconfont icon-youjiantou"></text>
				</view>
			</view> 
			<view class="storage-item">
				<text class="storage-item-left"><text style="color:red">*</text>部&emsp;&emsp;位</text>
				<view class="storage-item-right" @tap="selectUser">
					<view class="info-active" v-if="modelData.position">
						<robby-tags :value="checkTagsList" :enable-del="true" @delete="handleDelete"></robby-tags>
					</view>
					<text class="info" v-else>{{'请选择部位'}}</text>
					<text class="iconfont icon-youjiantou"></text>
				</view>
			</view>
		</view>
		<view class="outsouring-add-content">
			<view class="storage-item">
				<text class="storage-item-left">请扫包条码</text>
				<view class="storage-item-right">
					<text class="info" @click="handleTabVis">展开详情</text>
				</view>
			</view>
			<view class="ul">
				<view class="ul-white" v-if="outSourcingList.length===0">
					暂无数据
				</view>
				<view class="li" v-for="(item,index) in outSourcingList" v-else>
					{{index+1}}、{{item.color}}-{{item.size}}-{{item.num}}件
					<uni-icons type="trash-filled" size="20" style="color: red" @tap="deleteSubpackage(item)"/>
				</view>
			</view>
		</view>
		<view class="cart" >
			<table class="cart-table" v-if="tableVisible&&outSourcingList.length>0">
			  <thead>
				<tr>
				  <th class="cart-table-th" v-for="(tdItem,ind) in Object.keys(cartList[0])" v-if="tdItem!=='total'">{{cartList[0][tdItem]}}</th>
				  <th class="cart-table-th">小计</th>
				</tr>
			  </thead>
			  <tbody>
				<tr v-for="(item, index) in cartList.slice(1)" :key="index">
				  <td class="cart-table-td" v-for="(tdItem,ind) in Object.keys(item)" :key="ind" v-if="tdItem!=='total'">
					<view>{{item[tdItem]}}</view>
				  </td>
				  <td class="cart-table-td">
				  	 <view>{{item.total}}</view>
				  </td>
				</tr>
			  </tbody>
			 <tfoot>
			      <tr>
					<th class="cart-table-th" v-for="(tdFooter,ind) in Object.keys(cartList[0])" :key="ind" v-if="tdFooter!=='total'">{{getAllTotal(tdFooter)}}</th>
					<th class="cart-table-th">{{getAllTotal('total')}}</th>
			      </tr>
			    </tfoot>
			</table>
			<view class="foot-botttom">
				<button @click="handleOutSourcing" class="btn" type="primary">提交保存</button>
			</view>
		</view>
		<SimpleDateTimePicker ref="myPicker" @submit="handleSubmit" :start-year="2000" :end-year="2030"/>
		<popup type="3" v-if="popValue" @close="popValue=false" @closePort="closePort">
			<template #content>
				<view class="popup">
					<view class="pop-title"><view style="width: 12rpx;height: 32rpx;background-color: #1794D1;margin-right: 6rpx;"></view>选择部位</view>
					<view class="pop-search">
						<span style="width: 124rpx;font-size: 28rpx;">添加部位</span>
						<input type="text" :value="popInputValue" @input="handlePopInput" style="border: 1px solid #ccc;margin: 0 18rpx;flex:1;height: 60rpx;"/>
						<button type="primary" style="width:150rpx;height: 60rpx;font-size: 32rpx;line-height: 60rpx;border-radius: 4rpx;" @click="handlePopPart">添加</button>
					</view>
					<view class="pop-content">
						<robby-tags :value="tagList" @click="handleTag"></robby-tags>
					</view>
				</view>
			</template>
		</popup>
		<scan-code></scan-code>
		<u-picker v-if="show" :show="show" :columns="[[...sectionList1]]" @confirm="sectionSelectClick1" keyName="name" :itemHeight="100" @cancel="show=false"></u-picker>
		<u-picker v-if="show1" :show="show1" :columns="[[...sectionList]]" @confirm="sectionSelectClick" keyName="dictLabel" :itemHeight="100" @cancel="show1=false"></u-picker>
	</view>
</template>
<script>
	import Api from "../../service/api.js"
	import { useDebounce,getDictDataList,formateDateHour,getDictLabel,toasting } from '../../utils/index.js'
	import scanCode from "../../components/scan/scan.vue"
	import popup from "../../components/mulSelectionSearch/ge-popup.vue";
	import robbyTags from '@/components/robby-tags/robby-tags.vue'
	import SimpleDateTimePicker from "uni_modules/buuug7-simple-datetime-picker/components/buuug7-simple-datetime-picker/buuug7-simple-datetime-picker.vue";
	export default{
		components:{
			scanCode, //pda扫描
			SimpleDateTimePicker,//日期选择器
			popup, //部位弹出框
			robbyTags //标签
		},
		onShow() {
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器
			uni.$on('scancodedate', (data) => {
				try{
					this.handleScanPCS(decodeURI(data.code))
				}catch(err){
					return toasting('扫码失败',null,3000)
				}
			})
		},
		onLoad(option){ //初始化获取外协单号和外协id
			this.assistId=option.assistId
			this.assistNO=option.assistNO
			//改变title
			if (option.assistId) {//判断是否有id传入，有id就执行编辑，没有就是创建
				uni.setNavigationBarTitle({
					title:'编辑外协'
				})
			}
			else{
				uni.setNavigationBarTitle({
					title:'新增外协'
				})
			}
		},
		data(){
			return {
				//表身信息
				modelData:{
					billName:"", //外协类型名称
					billType:"", //外协类型
					customerId:"", //外协工厂id
					customerName:"", //外协工厂名称
					deliverTime:'', //期望交期
					id:undefined, //外协单id
					unit:"" //单位
				},
				cartList:[
					{color:'颜色/尺码'},
				],
				sectionList:[], //外协类型列表
				sectionList1:[], //外协工厂列表
				outSourcingList:[], //扎包条码列表
				assistId:"", //外协单id
				assistNO:"",  //外协单号
				popValue:false, // 弹出框visible
				popInputValue:"", //弹出框数据
				tagList:[], //弹出框部位列表
				tableVisible:true, //是否显示详情
				checkTagsList:[], //选中的部位数组
				show:false,  //显示工厂隐藏
				show1:false //显示外协类型选择框
			}
		},
		mounted(){
			this.init() //初始化
			Api.outsourcingFactory({deptType: 'factory'}).then(res=>{ //获取外发工厂列表
				if(res.code!==0){
					return toasting(res.msg,null,3000)
				}
				this.sectionList1=res.data
			})
			this.sectionList=getDictDataList(this.$store.state.dicts,'outsourcing_type') //获取外发类型列表
			this.handleOutSourcing = useDebounce(this.handleOutSourcing); //防抖
		},
		methods:{
			//删除部位
			handleDelete(currentTag,allTags){
				this.modelData.position=this.checkTagsList.map(i=>i.partsName).join(',')
				const find=this.tagList.find(item=>item.partsName===currentTag)
				if(find){
					find.flag=false
				}
			},
			//添加部位
			handlePopInput(e){
				this.popInputValue=e.detail.value
			},
			//初始化
			init(){
				if(this.assistId){
					this.getInfo(this.assistId)
				}
			},
			//修改获取信息
			getInfo(id){
				Api.outsourcingAddGetInfo({
					assistId:this.assistId,
					assistNO:this.assistNO
				}).then(res=>{
					if(res.code!==0){
						return toasting(res.msg,null,)
					}
					this.modelData={...res.data} //赋值form
					this.checkTagsList=res.data.position.split(',').map(item=>({partsName:item,flag:true}))
					this.modelData.billName=getDictLabel(this.$store.state.dicts,'outsourcing_type',res.data.billType) //赋值外发类型
					this.cartList=res.data.mesAssistOrReceiveVO.tableRow //赋值详情数据
					this.outSourcingList=[...res.data.barCodeList] //赋值扎包条码列表
				})
			},
			//选中外协类型
			sectionSelectClick(e){
				const {value}=e
				this.modelData.billName=value[0].dictLabel
				this.modelData.billType=value[0].dictValue
				this.show1=false
			},
			//选中外协工厂
			sectionSelectClick1(e){
				const {value}=e
				this.modelData.customerName=value[0].name
				this.modelData.customerId=value[0].id
				this.show=false
			},
			// 打开picker
			openDatetimePicker() {
			  this.$refs.myPicker.show();
			},
			//选中期望交期
			handleSubmit(e){
				this.modelData.deliverTime = `${e.year}-${e.month}-${e.day}`;
			},
			//打开部位弹窗
			selectUser(e){
				Api.outsourcingAddGetPort().then(res=>{
					if(res.code!==0){
						return toasting(res.msg)
					}
					this.userList=res.data
					this.tagList=res.data.map(item=>{
						const flag=this.modelData.position?.split(',').includes(item.partsName)
						if(flag){
							return {partsName:item.partsName,flag:true}
						}else{
							return {partsName:item.partsName,flag:false}
						}
					})
				})
				this.popValue=true
			},
			//加入部位
			handlePopPart(){
				Api.outsourcingAddSavePort({partsName:this.popInputValue}).then(res=>{
					if(res.code!==0){
						return toasting(res.msg)
					}
					this.tagList.unshift({partsName:this.popInputValue,flag:false})
					this.popInputValue=""
				})
			},
			//是否选中部位
			handleTag(e){
				const find=this.tagList.find(item=>item.partsName===e)
				find.flag=!find.flag
			},
			//关闭部位弹窗
			closePort(){
				this.checkTagsList=this.tagList.filter(item=>item.flag===true)
				this.modelData.position=this.checkTagsList.map(i=>i.partsName).join(',')
				this.popValue=false
			},
			//展开详情
			handleTabVis(){
				this.tableVisible=!this.tableVisible
			},
			//扫描包条码
			handleScanPCS(barCode){
				Api.outsourcingAddGet({barCode:String(barCode)}).then(res=>{
					if(res.code!==0){
						return toasting(res.msg)
					}
					//控制同一生产单
					const produceFind=this.outSourcingList.find(item=>item.productionId===res.data.productionId)
					if(!produceFind&&this.outSourcingList.length>0){
						return toasting('请扫描同一生产单的扎包条码')
					}else{
						//控制不同的扎包条码
						const barcodeFind=this.outSourcingList.find(item=>item.barcode===res.data.barcode)
						if(barcodeFind){
							return toasting('相同的扎包条码不能重复扫描')
						}else{
							//添加扎单条码
							this.outSourcingList.push({...res.data})
							let sizeKey=res.data.size
							//编辑二维表格
							const find=this.cartList.find(item=>item.color===res.data.color) //寻找相同颜色
							if(find){ //相同颜色
							 if(find[`${sizeKey}`]){
								 //相同类型累加
								 find[`${sizeKey}`]+=res.data.num
							 }else{
								 //不同类型赋值
								 find[`${sizeKey}`]=res.data.num
							 }
							 // 表格没有值赋0
							 this.cartList.forEach(k=>{
								 if(!k[`${sizeKey}`]){
								 	k[`${sizeKey}`]=k['color']=='颜色/尺码'?res.data.size:0
								 }
							 })
							}else{ //不同颜色
								const obj={}
								// 每一列处理数据尺码为0，颜色为当前颜色
								Object.keys(this.cartList[0]).forEach(item=>{
									obj[item]=0
									obj["color"]=res.data.color
								})
								//第一行显示尺码，其他显示数据
								this.cartList.forEach(k=>{
									if(!k[`${sizeKey}`]){
										k[`${sizeKey}`]=k['color']=='颜色/尺码'?res.data.size:res.data.num
									}
								})
								//赋值扫描的值
								obj[`${sizeKey}`]=res.data.num
								this.cartList.push(obj)
							}
							//小计计算
							this.cartList=this.cartList.map(item=>{
								let num=0
								Object.keys(item).forEach(k=>{
									if(k!=='color'&&k!=='total'){
										num+=item[k]
									}
								})
								return {...item,total:item.color==='颜色/尺码'?"小计":num}
							})
						}
					}
				})
			},
			//总计
			getAllTotal(key){
				let Num=0
				this.cartList.slice(1).forEach(item=>{
					Num+=Number(item[key])
				})
				if(Num===0){
					this.cartList.forEach(item=>{
						this.$delete(item,key)
					})
				}
				return key==='color'?'总计':Num
			},
			//删除扎包条码列表
			deleteSubpackage(row){
				uni.showModal({
					title: '是否删除该条扎包条码',
					success: res=> {
						if (res.confirm) {
							this.outSourcingList=this.outSourcingList.filter(item=>item.barcode!==row.barcode)
							const find=this.cartList.find(item=>item.color==row.color)
							if(find){
								find[`${row.size}`]-=row.num
								find.total-=row.num
								this.cartList=this.cartList.filter(item=>item.total!==0)
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			valid(){
				 const {billType,customerId,deliverTime,position}=this.modelData
				 if(billType===''||customerId===''||deliverTime===''||position===''){
					 return false
				 }else{
					 return true
				 }
			},
			//保存修改外协单
			handleOutSourcing(){
				if(!this.valid()){
					return toasting('请输入必填项')
				}
				const obj={
					...this.modelData,
					unit:'件',
					barCodeList:this.outSourcingList.map((item,index)=>({...item,sort:index+1,unit:'件'}))
				}
				// 修改和保存
				const that=this.assistId?Api.outsourcingAddUpdate:Api.outsourcingAddSave
				that(obj).then(res=>{
					if(res.code!==0){
						return toasting(res.msg)
					}else{
						uni.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 3000,
							success:()=>{
								this.modelData={}
								this.cartList=[{color:'颜色/尺码'}]
								this.outSourcingList=[]
								uni.navigateTo({
									url:'/pages/outsourcingReceipt/orderList'
								})
							}
						})
					}
				})
			}
		}
	}
	
</script>
<style lang="scss" scoped>
	.out-sourcing{
		height: calc(100vh - 112rpx);
		overflow-y: auto;
		position: relative;
		.storage{
			.storage-item{
				height: 100%;
			}
			.storage-item-left{
				width: 160rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.storage-item-right{
				align-items: center;
				max-width: 478rpx;
				.info{
					max-width: 478rpx !important;
					color: #ccc;
					margin-right: 15rpx;
				}
				.info-active{
					max-width: 478rpx !important;
					color: #000;
					line-height: 70rpx;
					margin-right: 15rpx;
				}
			}
		}
		.outsouring-add-content{
			background-color: #FFFFFF;
			padding: 0 30rpx 40rpx;
			.storage-item{
				height: 100rpx;
				display: flex;
				justify-content: space-between;
				font-size: 34rpx;
				margin-top: 20rpx;
				line-height: 100rpx;
				border-bottom: 1px solid #EAEAEA;
				.storage-item-left{
					font-weight: 900;
				}
				.info{
					color: #1794D1;
					font-size: 30rpx;
				}
			}
			.ul{
				background-color: #FAFAFA;
				min-height: 90rpx;
				max-height: 180rpx;
				overflow-y: auto;
				.ul-white{
					display: flex;
					justify-content: center;
					align-items: center;
					height: 90rpx;
					color: #bbb;
				}
				.li{
					display: flex;
					justify-content: space-between;
					height: 60rpx;
					line-height: 48rpx;
					padding: 6rpx 0rpx;
					font-size: 28rpx;
					background:#eee;
					border-bottom: 1px dashed #D8D8D8;
				}
			}
		}
		.cart{
			width: 100%;
			background: #FFFFFF;
			overflow: scroll;
			.cart-table{
				width: 100%;
				border-collapse: collapse;
				border-spacing: 0;
				.cart-table-th{
					height: 72rpx;
					color: #666666;
					border: 1px solid #EBEBEB;;
					vertical-align: center;
					font-size: 28rpx;
					text-align: center;
					font-weight: blod;
					background-color: #F8F8F8;
				}
				.cart-table-td{
					height: 80rpx;
					border: 1px solid #EBEBEB;
					color: #666666;
					padding: 10rpx;
					text-align: center;
					vertical-align: center;
				}
			}
		}
		.foot-botttom{
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 112rpx;
			background-color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			.btn{
				width: 296rpx;
				height:80rpx;
				background-color: #1794D1;
				font-size: 32rpx;
				color: #FFFFFF;
				line-height: 80rpx;
				border-radius:8rpx;
			}
		}
		.popup{
			.pop-title{
				font-size: 36rpx;
				font-weight: blod;
				display: flex;
				align-items: center;
			}
			.pop-search{
				display: flex;
				align-items: center;
				height: 104rpx;
				padding: 24rpx 0;
			}
			.pop-content{
				display: flex;
			}
		}
	}
</style>