### 表格
	表格组件
##  注意事项
	组件需要依赖 scss 插件, 或自己去手动修改css样式（很简单）
##  属性 Props
|  属性名	| 类型		| 默认值|    说明										|
|  ----		| ----		| ----	|  ----											|
| thList	| Array		|[]		| 表头数据										|
| items		| Array		|[ ]	| 表格显示所需的数据，数据格式见下方示例			|
| activeIds	| Array		|[ ]	| 默认选中项id												|
| select	| String	|''		| 是否可选，空值：不可选		radio：单选 		multiple：多选	|
| sort	    | String	|'desc'	| 排序，	desc: 降序    acs: 升序					|
| isClick	| Boolean	|false	| 是否可点击										|
| sortKey	| String	|''		| 排序关键词										|
| links		| String	|''		| 跳转路由										|
| linksKey	| String	|''		| 路由参数 多个用,隔开							|
| rightBorder | Boolean	|false	| 是否显示固定区与滚动区的分隔线					|
| selectStr | String	|'选择'	| 选择列的表头文本								|

### 表头thList  item项
|  属性名	| 类型		| 默认值		|    说明										|
|  ----		| ----		| ----		|  ----											|
| text		| Boolean	| false		| 名称								        	|
| fixed		| Boolean   | false		| 固定在前的列,	一般设置1-2项					|
| sortKey	| String	| ''		| 排序关键词，有值就可排序						|
| dataKey	| String	| 'index' 	| 该列渲染的数据字段, 必填项						|
| markKey	| String	| ''		| 该列渲染标记字段     							|
| width		| String	| '200rpx'	| 该列渲染的宽度 								|
| isInput	| Boolean	| false		| 该列是否可编辑									|
| inputType	| String   	| 'text'	| input 类型									|
| inputPlaceholder	| String	| ''		| input placeholder属性值				|
| inputWidth		| String	| '80rpx' 	| input 宽度							|
| inputHeight		| String	| '44rpx'	| input 高度 							|
| inputSize			| String	| '26rpx'	| input 字体大小 						|
| unit				| String	| ''	| 该列的单位值，如%,只,份, 元.....			|


### 表格items  item项
|  属性名	| 类型		| 默认值|    说明										|
|  ----		| ----		| ----	|  ----											|
| disabled	| Boolean	| false	| 是否禁止选择	select 为多选或全选时有效       	|
| checked	| Boolean	| false	| 是否选中		select 为多选或全选时有效       	|

	
##  方法  Events
|  属性名	| 返回值    |    说明										    	|
|  ----		| ----	    |  ----											    	|
| onSelect	| Array	 	|  返回全部items 数据									|
| onSort	| Object	| 返回排序数据 {sort:  'desc/asc', sortKey: ''}			|
| onSetting	| Object	| 表头 isInput 为true 时有效，返回修改后的item数据 		|
| onClick	| Object	| isClick 为true 时有效，返回点击项item数据 				|
	    	
	
### 代码示例
```
<template>
	<view class="page">
		<view class="p">
			<view>是否显示分割线</view>
			<switch :checked="rightBorder" style="transform:scale(0.8)" @change="switchChange" />
		</view>
		<view class="p">
			<view>是否可选</view>
			<picker mode="selector" :range="selects" @change="bindPickerChange">
				<view>{{selects[index]}} ></view>
			</picker>
		</view>
		<wyh-table :items="list" :thList="thList" :select="select" :rightBorder="rightBorder"></wyh-table>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rightBorder: false,
				select: '',   	//空  不可选    radio   单选   multiple   多选
				selects: ['不可选','单选', '多选'],
				index: 0,
				thList: [{
					text: '排名',
					fixed: true,        //固定在前的列   一般设置1-2项
					sortKey: '',    //有就可以排序
					dataKey: 'index',    //该列渲染的数据字段 
					markKey: '',	//该列渲染的标记字段 
					width: '80rpx'
				},{
					text: '掌柜',
					fixed: true,       
					sortKey: '',    
					dataKey: 'name', 
					markKey: 'mark',
					width: '180rpx'
				},{
					text: '手机号',
					fixed: false,        
					sortKey: '',    
					dataKey: 'phone',   
				},{
					text: '奖励总额',
					fixed: false,        
					sortKey: 'count',    
					dataKey: 'count',  
				},{
					text: '已提现奖励',
					fixed: false,        
					sortKey: 'cash',    
					dataKey: 'cash',  	
				},{
					text: '售卡奖励',
					fixed: false,        
					sortKey: 'sales',    
					dataKey: 'sales',  	
				},{
					text: '消费奖励',
					fixed: false,        
					sortKey: 'order',    
					dataKey: 'order',  	
				},{
					text: '介绍奖励',
					fixed: false,        
					sortKey: 'share',    
					dataKey: 'share',  	
				}],
				list: [{
					name: '吴佳烨1',
					phone: '13569869863',
					count: 296.00,
					cash: 296.00,
					sales: 269.00,
					order: 296.00,
					share: 296.00,
					mark: '转'
				},{
					name: '吴佳烨2',
					phone: '13569869863',
					count: 296.00,
					cash: 296.00,
					sales: 269.00,
					order: 296.00,
					share: 296.00,
					mark: '转'
				},{
					name: '吴佳烨3',
					phone: '13569869863',
					count: 296.00,
					cash: 296.00,
					sales: 269.00,
					order: 296.00,
					share: 296.00,
					mark: '-'
				},{
					name: '吴佳烨4',
					phone: '13569869863',
					count: 296.00,
					cash: 296.00,
					sales: 269.00,
					order: 296.00,
					share: 296.00,
					mark: '转'
				},{
					name: '吴佳烨5',
					phone: '13569869863',
					count: 296.00,
					cash: 296.00,
					sales: 269.00,
					order: 296.00,
					share: 296.00,
					mark: '-'
				}]
			}
		},
		methods: {
			switchChange(e) {
				this.rightBorder = e.detail.value;
			},
			bindPickerChange: function(e) {
				this.index = e.detail.value;
				if(this.index == 0) {
					this.select = '';
				} else if (this.index == 1) {
					this.select = 'radio';
				} else if (this.index == 2) {
					this.select = 'multiple';
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		padding: 40rpx 0;
	}
	.p {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
	}
</style>


```