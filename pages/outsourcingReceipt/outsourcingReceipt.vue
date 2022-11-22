<template>
	<view class="outSourcing">
		<view class="outsouring-add-content">
			<view class="storage-item">
				<text class="storage-item-left">请扫包条码</text>
				<view class="storage-item-right">
					<text class="info" v-if="modelData.assistId&&modelData.billNo&&modelData.existDetail" @tap="goToDelievery">历史记录</text>
					<text class="info" style="color: #ccc;" v-else>历史记录</text>
				</view>
			</view>
			<view class="ul">
				<view class="ul-white" v-if="outSourcingList.length===0">
					暂无数据
				</view>
				<view class="li" v-for="(item,index) in outSourcingList">
					{{outSourcingList.length-index}}、{{item.color}}-{{item.size}}-{{item.num}}件
					<uni-icons type="trash-filled" size="20" style="color: red" @tap="deleteSubpackage(item)"/>
				</view>
			</view>
		</view>
		<view class="storage">
			<view class="storage-item">
				<text class="storage-item-left">类型</text>
				<view class="storage-item-right">
					<text class="info-active">{{modelData.billName}}</text>
				</view>
			</view>
			<view class="storage-item">
				<text class="storage-item-left">部位</text>
				<view class="storage-item-right" @tap="selectUser">
					<view class="info-active" v-if="modelData.position">
						<robby-tags :value="checkTagsList" :enable-del="true" @delete="handleDelete"></robby-tags>
					</view>
					<text class="info" v-else>{{modelData.position||'请选择部位'}}</text>
					<text class="iconfont icon-youjiantou"></text>
				</view>
			</view>
			<view class="storage-item">
				<text class="storage-item-left">完成</text>
				<view class="storage-item-right">
					<evan-switch v-model="modelData.completeFlag" :active-value="1" :inactive-value="0" inactive-color="#C5C5C5" :size="20"></evan-switch>
				</view>
			</view>
		</view>
		<view class="cart">
			<table class="cart-table" v-if="cartList.length>1">
			  <thead>
				<tr>
				  <th style="min-width: 160rpx;" class="cart-table-th" v-for="(tdItem,ind) in Object.keys(cartList[0])" v-if="tdItem!=='total'">{{cartList[0][tdItem]}}</th>
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
					<th class="cart-table-th" style="background-color: #F2FFF0;" v-for="(tdFooter,ind) in Object.keys(cartList[0])" :key="ind" v-if="tdFooter!=='total'">{{getAllTotal(tdFooter)}}</th>
					<th class="cart-table-th" style="background-color: #F2FFF0;">{{getAllTotal('total')}}</th>
			      </tr>
			    </tfoot>
			</table>
			<!-- <wyh-table :rightBorder="true" :items="cartList.slice(1)" :thList="processData"></wyh-table> -->
			<view class="foot-botttom">
				<button @click="handleOutSourcing" class="btn" type="primary">提交保存</button>
			</view>
		</view>
		<popup type="3" v-if="popValue" @close="popValue=false" @closePort="closePort">
			<template #content>
				<view class="popup">
					<view class="pop-title"><view style="width: 12rpx;height: 32rpx;background-color: #1794D1;margin-right: 6rpx;"></view>选择部位</view>
					<view style="height:74rpx;"></view>
					<view class="pop-content">
						<robby-tags :value="tagList" @click="handleTag"></robby-tags>
					</view>
				</view>
			</template>
		</popup>
		<popup type="3" v-if="scanPopValue" @close="scanPopValue=false" @closePort="closeScanPort">
			<template #content>
				<view class="popup">
					<view class="pop-title"><view style="width: 12rpx;height: 32rpx;background-color: #1794D1;margin-right: 6rpx;"></view>选择外协单</view>
					<radio-group @change="onChange" class="uni-list" style="width:100%;max-height: 404rpx;overflow: auto;">
						<view class="header" v-for="(item,index) in delieveryList" :key="index">
								<view class="header-image">
									<image
										:src="item.productionInfo?getimage(item.productionInfo):'../../static/qualityTesting/default.png'"
										mode="scaleToFill"
										class="image" 
										@click="bigimage(item)"
									>
									</image>
									<view style="font-size: 28rpx;color: #85da29;text-align: center;" v-if="item.billState===0">外发中</view>
									<view style="font-size: 28rpx;color: #59b7ff;text-align: center;" v-else-if="item.billState===1">部分收货</view>
									<view style="font-size: 28rpx;color: #e02020;text-align: center;" v-else-if="item.billState===2">已完成</view>
								</view>
								<view class="header-title">
									<view class="title" style="height: 38rpx !important;">
										<view class="title-no" style="height: 38rpx !important;">单号：{{item.billNo}}</view>
									</view>
									<view class="header-grid-alllist">
										<view class="header-grid-all-list">
											<view class="name">款号：</view>
											<view class="code">{{item.productionInfo.proName}}</view>
											<!-- <view class="code">1111</view> -->
										</view>
										<view class="header-grid-all-list">
											<view class="name">类型：</view>
											<view class="code">{{getDictLabel($store.state.dicts,'outsourcing_type',item.billType)}}</view>
										</view>
										<view class="header-grid-all-list">
											<view class="name">工厂：</view>
											<view class="code">{{item.customerName}}</view>
										</view>
										<view class="header-grid-all-list">
											<view class="name">数量：</view>
											<view class="code">{{item.num}}</view>
										</view>
										<view class="header-grid-all-list">
											<view class="name">收货：</view>
											<view class="code" style="margin-top: 5rpx;">{{item.receiveNum}}</view>
										</view>
										<view class="header-grid-all-list">
											<view class="name">部位：</view>
											<view class="code" style="margin-top: 5rpx;">{{item.position}}</view>
										</view>
									</view>
								</view>
								<view class="uni-list-item__extra">
									<radio :value="item" :checked="item.checked" />
								</view>
						</view>
					</radio-group>
					<view class="pop-switch">
						<span style="font-size: 32rpx;margin-right: 32rpx;">同时收该单其他包</span>
						<evan-switch v-model="isAll" :active-value="1" :inactive-value="0" inactive-color="#C5C5C5" :size="20"></evan-switch>
					</view>	
				</view>
			</template>
		</popup>
	</view>
</template>

<script>
	import evanSwitch from "../../components/evan-switch/evan-switch.vue"
	import { useDebounce,getDictLabel,toasting } from '../../utils/index.js'
	import popup from "../../components/mulSelectionSearch/ge-popup.vue";
	import robbyTags from '@/components/robby-tags/robby-tags.vue'
	import { setToastConfig} from 'uni_modules/lyz-uni-api-helper'
	import Api from "../../service/api.js"
	export default{
		components:{
			evanSwitch, //全部完成按钮
			popup, //部位选择弹出框
			robbyTags //部位列表
		},
		onShow() {
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器
			uni.$on('scancodedate', (data) => {
				try{
					if(this.outSourcingList.length===0){
						Api.getScanCodeGoodsList({barCode:String(decodeURI(data.code))}).then(res=>{
							if(res.code!==0){
								return toasting(res.msg,()=>{},3000)
							}
							this.scanPopValue=true
							this.delieveryList=res.data.mesAssistDtoList
							if(this.delieveryList.length>0){
								this.modelData.assistId=this.delieveryList[0].id
								this.delieveryList[0].checked=true
							}
							this.barCode=String(decodeURI(data.code))
						})
					}else{
						this.handleScanPCS(decodeURI(data.code))
					}
				}catch(err){
					return toasting('扫码失败',()=>{},3000)
				}
			})
		},
		onBackPress(options){
			if (options.from === 'navigateBack') {
					return false;
			}
			if(this.receiveId){
				uni.redirectTo({
					url: `/pages/outsourcingReceipt/outsourcingReceiptList`
				})
				return true;
			}
			// 这里使用重定向比较好，不信可以自己多试几种，其余跳转方法在文章底部哦
		},
		//页面跳转赋值
		onLoad(option){
			this.receiveId=option.receiveId
		},
		data(){
			return {
				outSourcingList:[], //扎包条码列表
				modelData:{
					//收货单信息
					billType:"",  //外协类型
					billName:"", //外协类型
					assistId:"", //外协编号
					position:"", //外协部位
					completeFlag:0 //全部完成按钮
				},
				//采购明细列表
				cartList:[
					{color:'颜色/尺码'},
				],
				popValue:false, //选择部位弹窗
				scanPopValue:false, //扫码弹窗
				popInputValue:"", //部位输入框
				tagList:[], //tags列表
				receiveId:"" ,//收货单id,
				delieveryList:[{}], //带出所有的外协单
				isAll:1, //是否完成
				barCode:"",  //二维码信息
				checkTagsList:[], //选中的部位
				position:"" //当前外协单的部位
			}
		},
		mounted(){
			this.handleOutSourcing = useDebounce(this.handleOutSourcing);
			this.init()
		},
		methods:{
			//删除部位
			handleDelete({currentTag,allTags}){
				//弹出框置灰
				const find=this.tagList.find(item=>item.partsName===currentTag)
				if(find){
					find.flag=false
				}
				//传值删除
				this.modelData.position=this.checkTagsList.map(i=>i.partsName).join(',')
			},
			//跳转至收获列表页面
			goToDelievery(){
				const {assistId,billNo,existDetail}=this.modelData
				uni.navigateTo({
					url: `./outsourcingReceiptList?productionId=${assistId}&id=${billNo}&existDetail=${existDetail}&receiptFlag=${true}`
				})
			},
			getDictLabel,
			//确认选中的收货单
			closeScanPort(item){
				Api.scanCodeGoodsAllDetail({
					assistId:this.modelData.assistId,
					barCode:this.barCode,
					isAll:this.isAll
				}).then(res=>{
					if(res.code!==0){
						return toasting(res.msg,()=>{},3000)
					}
					if(this.isAll===1){
						this.outSourcingList=res.data.mesOrderSubpackageItemsList
					}else{
						this.outSourcingList=[{...res.data.mesOrderSubpackageItems}]
					}
					this.modelData.billNo=res.data.mesAssistDTO.billNo    //外协但编号
					this.modelData.existDetail=res.data.mesAssistDTO.existDetail    //外协但编号
					this.modelData.billType=res.data.mesAssistDTO.billType //外协类型
					this.modelData.position=res.data.mesAssistDTO.position //收货单部位
					this.position=res.data.mesAssistDTO.position //当前外协单部位
					this.modelData.billName=getDictLabel(this.$store.state.dicts,'outsourcing_type',res.data.mesAssistDTO.billType) //赋值外发类型
					this.checkTagsList=this.modelData.position.split(',').map(item=>({partsName:item,flag:true}))
					this.cartList=res.data.mesAssistOrReceiveVO.tableRow
				})
				this.scanPopValue=false
			},
			//单选收货单关联多条外协单
			onChange(e){
				this.modelData.assistId=e.detail.value.id
			},
			//初始化
			init(){
				if(this.receiveId){
					this.getInfo(this.receiveId)
				}
				this.isAll=1
			},
			//修改获取信息
			getInfo(id){
				Api.outsourcingTakeDelieveryGetInfo({
					receiveId:this.receiveId
				}).then(res=>{
					if(res.code!==0){
						return toasting(res.msg,()=>{},3000)
					}
					this.cartList=res.data.mesAssistOrReceiveVO.tableRow 
					this.modelData={...res.data.mesAssistDTO}
					this.modelData.assistId=res.data.mesAssistDTO.id //赋值外协单id
					this.modelData.receiveId=this.receiveId //赋值收获单id
					this.modelData.billName=getDictLabel(this.$store.state.dicts,'outsourcing_type',res.data.mesAssistDTO.billType) //赋值外发类型
					this.modelData.billNo=res.data.mesAssistDTO.billNo    //外协但编号
					this.modelData.existDetail=res.data.mesAssistDTO.existDetail    //外协但编号
					this.modelData.completeFlag=res.data.completeFlag //全部完成
					this.modelData.position=res.data.position //部位取外协单部位
					this.position=res.data.mesAssistDTO.position //历史
					this.checkTagsList=res.data.position.split(',').map(item=>({partsName:item,flag:true}))
					this.outSourcingList=res.data.barCodeList
				})
			},
			// 查看图片
			bigimage(item) {
				let imagelist = []
				const {
					productionInfo
				} = item
				if (productionInfo) {
					const {
						image
					} = productionInfo
					if (image == null) {
						imagelist.push('../../static/qualityTesting/default.png')
					} else {
						imagelist.push(image)
					}
				} else {
					imagelist.push('../../static/qualityTesting/default.png')
				}
				uni.previewImage({
					urls: imagelist,
					current: '',
				})
			},
			// 图片
			getimage(obj) {
				const {
					image
				} = obj
				if (image == null) {
					return '../../static/qualityTesting/default.png'
				}
				return image
			},
			//扫描扎包条码
			handleScanPCS(barCode){
				Api.outsourcingTakeDelieveryPCS
				({
					barCode:String(barCode),
					assistId:this.modelData.assistId,
				}).then(res=>{
					if(res.code!==0){
						return toasting(res.msg,()=>{},3000)
					}
					if(!this.modelData.position){
						this.modelData.position=res.data.mesAssistDTO.position
					}
					if(this.modelData.assistId!==res.data.mesAssistDTO.id&&this.outSourcingList.length>0){
						return toasting('请扫描同一外协单的扎包条码',()=>{},3000)
					}else{
						const barcodeFind=this.outSourcingList.find(item=>item.barcode===res.data.mesOrderSubpackageItems.barcode)
						if(barcodeFind){
							return toasting('相同的扎包条码不能重复扫描',()=>{},3000)
						}else{
							//外协单id
							this.modelData.billNo=res.data.mesAssistDTO.billNo    //外协但编号
							this.modelData.existDetail=res.data.mesAssistDTO.existDetail    //外协但编号
							this.modelData.assistId=res.data.mesAssistDTO.id
							this.outSourcingList.unshift({...res.data.mesOrderSubpackageItems})
							let sizeKey=res.data.mesOrderSubpackageItems.size
							const find=this.cartList.find(item=>item.color===res.data.mesOrderSubpackageItems.color) //寻找相同颜色
							if(find){ //相同颜色
							 if(find[`${sizeKey}`]){
								 // 相同尺码累加
								 find[`${sizeKey}`]+=res.data.mesOrderSubpackageItems.num
							 }else{
								 // 不同尺码赋值
								 find[`${sizeKey}`]=res.data.mesOrderSubpackageItems.num
							 }
							 // 表格赋值0或者尺码
							 this.cartList.forEach(k=>{
								 if(!k[`${sizeKey}`]){
								 	k[`${sizeKey}`]=k['color']=='颜色/尺码'?res.data.mesOrderSubpackageItems.size:0
								 }
							 })
							}else{ //不同颜色
								const obj={}
								// 推送数据
								Object.keys(this.cartList[0]).forEach(item=>{
									obj[item]=0
									obj["color"]=res.data.mesOrderSubpackageItems.color
								})
								//赋值尺码或者数量
								this.cartList.forEach(k=>{
									if(!k[`${sizeKey}`]){
										k[`${sizeKey}`]=k['color']=='颜色/尺码'?res.data.mesOrderSubpackageItems.size:res.data.mesOrderSubpackageItems.num
									}
								})
								//复制当前属性数据
								obj[`${sizeKey}`]=res.data.mesOrderSubpackageItems.num
								this.cartList.push(obj)
							}
							// 小计
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
			// 总计
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
			// 删除扎包条码
			deleteSubpackage(row){
				uni.showModal({
					title: '是否删除该条扎包条码',
					success: res=> {
						if (res.confirm) {
							this.outSourcingList=this.outSourcingList.filter(item=>item.barcode!==row.barcode)
							const find=this.cartList.find(item=>item.color===row.color)
							if(find){
								find[`${row.size}`]-=row.num
								find.total-=row.num
								this.cartList=this.cartList.filter(item=>item.total!==0)
								if(this.outSourcingList.length===0){
									this.modelData.billName=''
									this.modelData.billType=''
									this.modelData.position=''
									this.modelData.completeFlag=''
								}
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//打开部位弹窗
			selectUser(){
				if(this.outSourcingList.length===0){
					return toasting('请扫描扎包条码',()=>{},3000)
				}
				const arr=this.checkTagsList.map(i=>i.partsName)
				this.tagList=this.position.split(',').map(item=>{
					if(arr.includes(item)){
						return {partsName:item,flag:true}
					}else{
						return {partsName:item,flag:false}
					}
				})
				this.popValue=true
			},
			// 点击部位
			handleTag(e){
				const find=this.tagList.find(item=>item.partsName===e)
				find.flag=!find.flag
			},
			// 关闭部位弹窗
			closePort(){
				this.checkTagsList=this.tagList.filter(item=>item.flag===true)
				this.modelData.position=this.checkTagsList.map(i=>i.partsName).join(',')
				this.popValue=false
			},
			// 保存收货单
			handleOutSourcing(){
				if(this.modelData.position===''){
					return toasting('请选择部位',()=>{},3000)
				}
				const {assistId,billNo,existDetail}=this.modelData
				const obj={
					...this.modelData,
					barCodeList:this.outSourcingList.map((item,index)=>({...item,sort:this.outSourcingList.length-index}))
				}
				const that=this.receiveId?Api.outsourcingTakeDelieveryUpdate:Api.outsourcingTakeDelieverySave
				that(obj).then(res=>{
					if(res.code!==0){
						return toasting(res.msg,()=>{},3000)
					}else{
						uni.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 3000,
							success:()=>{
								this.modelData={}
								this.cartList=[{color:'颜色/尺码'}]
								this.outSourcingList=[]
								uni.redirectTo({
									url: `./outsourcingReceiptList?productionId=${assistId}&id=${billNo}&existDetail=${existDetail}`
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
	.outSourcing{
		height: calc(100vh - 112rpx);
		overflow-y: auto;
		position: relative;
		.storage{
			.storage-item{
				height: 100%;
			}
			.storage-item-left{
				width: 70rpx;
				display: flex;
				align-items: center;
			}
			.storage-item-right{
				align-items: center;
				max-width: 600rpx;
				.info{
					max-width: 600rpx;
					color: #ccc;
					margin-right: 15rpx;
				}
				.info-active{
					max-width: 600rpx;
					color: #000;
					margin-right: 15rpx;
				}
			}
		}
		.outsouring-add-content{
			background-color: #FFFFFF;
			padding: 0 30rpx;
			.storage-item{
				height: 100rpx;
				display: flex;
				justify-content: space-between;
				font-size: 34rpx;
				line-height: 100rpx;
				.storage-item-left{
					font-weight: 900;
				}
				.info{
					color: #1794D1;
					font-size: 30rpx;
				}
			}
			.ul{
				min-height: 90rpx;
				max-height: 180rpx;
				background-color: #FAFAFA;
				border: 1px solid #EAEAEA;
				border-bottom: none;
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
					align-items: center;
					padding: 0rpx 15rpx;
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
			box-shadow: 0 -8rpx 10rpx #ddd;
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
			.pop-switch{
				display: flex;
				height: 88rpx;
				align-items: center;
			}
			.header {
				width: 100%;
				padding: 20rpx;
				display: flex;
				overflow: hidden;
				background-color: white;
				border-bottom: 1px dashed #ccc;
				.header-image {
					display: flex;
					flex-direction: column;
					flex-wrap: wrap;
					width: 140rpx;
					justify-content: center;

					.image {
						margin-bottom: 5rpx;
						width: 140rpx;
						height: 140rpx;
					}
				}
				
				.header-title {
					width: calc(100% - 204rpx);
					display: flex;
					flex-wrap: wrap;
					margin-left: 20rpx;

					.title {
						width: 100%;
						font-size: 30rpx;
						font-weight: 600;
						.title-no{
							width: 100%;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
						}
					}

					.header-grid-alllist {
						width: 100%;
						display: flex;
						flex-wrap: wrap;

						.header-grid-all-list {
							width: 50%;
							display: flex;
							font-size: 24rpx;
							align-items: center;

							.name {
								color: #999;
								width: 80rpx;
							}

							.code {
								width: calc(100% - 80rpx);
								overflow: hidden;
								while-space: nowrap;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
					}
					.button {
						width: 200rpx;
						height: 60rpx;
						padding: 4rpx 10rpx;
						text-align: center;
						color: white;
						font-weight: normal;
					}
				}
				.uni-list-item__extra{
					line-height: 160rpx;
				}
				
			}
		}
	}
</style>
