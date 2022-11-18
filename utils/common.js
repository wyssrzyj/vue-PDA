export const houseList = [
	{
		name: '本厂出入',
		backgroundColor: '#ecf8f3',
		permissions: ['mes:mespiecesmarket:cutInStorage','mes:mespiecesmarket:cutOutStorage','mes:mespiecesmarket:repealCutInStorage'],
		list:  [
		  {
			title: '裁片入库',
			permissions: 'mes:mespiecesmarket:cutInStorage',
			src: '../../static/menuIcon/mes_cutInStorage.svg',
			link: '/pages/cutWarehouse/mes_cutInStorage'
		  },
		  {
			title: '裁片出库',
			permissions: 'mes:mespiecesmarket:cutOutStorage',
			src: '../../static/menuIcon/mes_cutOutStorage.svg',
			link: '/pages/cutWarehouse/mes_cutOutStorage'
		  },
		  {
			title: '撤销裁片入库',
			permissions: 'mes:mespiecesmarket:repealCutInStorage',
			src: '../../static/menuIcon/mes_repealCutInStorage.svg',
			link: '/pages/cutWarehouse/mes_repealCutInStorage'
		  }
		]
	},
	{
		name: '外发加工出入',
		backgroundColor: '#ecf8f3',
		permissions: ['mes:mespiecesmarket:outsourcingReceipt','mes:mespiecesmarket:outsourcingDelivery'],
		list: [
		  {
			title: '外发加工入库',
			permissions: 'mes:mespiecesmarket:outsourcingReceipt',
			src: '../../static/menuIcon/mes_outsourcingReceipt.svg',
			link: '/pages/outwardProcessing/mes_outsourcingReceipt'
		  },
		  {
			title: '外发加工出库',
			permissions: 'mes:mespiecesmarket:outsourcingDelivery',
			src: '../../static/menuIcon/mes_outsourcingDelivery.svg',
			link: '/pages/outwardProcessing/mes_outsourcingDelivery'
		  }
		]
	},
	{
		name: '按包报工',
		backgroundColor: '#ecf8f3',
		permissions: ['mes:mesengineeringmanagement:workReport'],
		list: [
			{
				title:"按包报工",
				permissions: 'mes:mesengineeringmanagement:workReport',
				src: '../../static/menuIcon/mes_workReport.svg',
				link: '/pages/workReport/mes_workReport'
			}
		]
	},
	{
		name: '铺布数据采集',
		backgroundColor: '#ecf8f3',
		permissions: ['mes:messpreadcloth:blanketDataCollect'],
		list: [
			{
				title: '铺布数据采集',
				permissions: 'mes:messpreadcloth:blanketDataCollect',
				src: '../../static/menuIcon/blanketDataCollect.svg',
				link: '/pages/blanket/blanketDataCollect'
			}
		]
	},
	{
		name: '外协收货',
		backgroundColor: '#fef7e4',
		permissions: ['mes:assist:save','mes:assist:page'],
		list: [
			{
				title: '添加外协',
				permissions: 'mes:assist:save',
				src: '../../static/menuIcon/outsourcingAdd.svg',
				link: '/pages/outsourcingReceipt/outsourcingAdd'
			},
			{
				title: '外协收货',
				permissions: 'mes:assist:page',
				src: '../../static/menuIcon/orderList.svg',
				link: '/pages/outsourcingReceipt/orderList'
			}
		]
	},
	{
		name: '手动报工',
		backgroundColor: '#ecf2ff',
		permissions: ['mes:mesengineeringmanagement:saveEngineeringManualPda','mes:mesengineeringmanagement:saveMaterialsReportingPda'],
		list: [
			{
				title: '颜色尺码报工',
				permissions: 'mes:mesengineeringmanagement:saveEngineeringManualPda',
				src: '../../static/menuIcon/ManualReportingType1.svg',
				link: '/pages/ManualReporting/ManualReporting?type=1'
			},
			{
				title: '数量报工',
				permissions: 'mes:mesengineeringmanagement:saveMaterialsReportingPda',
				src: '../../static/menuIcon/ManualReportingType2.svg',
				link: '/pages/ManualReporting/ManualReporting?type=0'
			}
		]
	}
]
 
 

