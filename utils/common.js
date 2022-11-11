export const cutWarehouseList = [
  {
    title: '裁片入库',
	permissions: 'mes:mespiecesmarket:cutInStorage',
    src: '../../static/outwardProcessing/cutInStorage.png',
    link: '/pages/cutWarehouse/mes_cutInStorage'
  },
  {
    title: '裁片出库',
	permissions: 'mes:mespiecesmarket:cutOutStorage',
    src: '../../static/outwardProcessing/cutOutStorage.png',
    link: '/pages/cutWarehouse/mes_cutOutStorage'
  },
  {
    title: '撤销裁片入库',
	permissions: 'mes:mespiecesmarket:repealCutInStorage',
    src: '../../static/outwardProcessing/repealCutStorage.png',
    link: '/pages/cutWarehouse/mes_repealCutInStorage'
  }
]
export const outwardProcessingList = [
  {
    title: '外发加工入库',
	permissions: 'mes:mespiecesmarket:outsourcingReceipt',
    src: '../../static/outwardProcessing/outSourcingReceipt.png',
    link: '/pages/outwardProcessing/mes_outsourcingReceipt'
  },
  {
    title: '外发加工出库',
	permissions: 'mes:mespiecesmarket:outsourcingDelivery',
    src: '../../static/outwardProcessing/outSourcingDelivery.png',
    link: '/pages/outwardProcessing/mes_outsourcingDelivery'
  }
]
export const workReportList=[
	{
		title:"按包报工",
		permissions: 'mes:mesengineeringmanagement:workReport',
		src: '../../static/workReport/workReport.png',
		link: '/pages/workReport/mes_workReport'
	},
]
export const blanketDataList = [
	{
		title: '铺布数据采集',
		permissions: 'mes:messpreadcloth:blanketDataCollect',
		src: '../../static/blanket/blanket.png',
		link: '/pages/blanket/blanketDataCollect'
	}
]
export const outsourcingDataList = [
	{
		title: '添加外协',
		permissions: 'mes:assist:save',
		src: '../../static/blanket/blanket.png',
		link: '/pages/outsourcingReceipt/outsourcingAdd'
	},
	{
		title: '外协收货',
		permissions: 'mes:assist:page',
		src: '../../static/blanket/blanket.png',
		link: '/pages/outsourcingReceipt/orderList'
	}
]
// export const qualityTestingDataList = [
// 	{
// 		title: '质检',
// 		// permissions: 'mes:messpreadcloth:blanketDataCollect',
// 		src: '../../static/workReport/workReport.png',
// 		link: '/pages/qualityTesting/mes-qualityTesting'
// 	},
// 	{
// 		title: '返修',
// 		// permissions: 'mes:messpreadcloth:blanketDataCollect',
// 		src: '../../static/outwardProcessing/outSourcingReceipt.png',
// 		link: '/pages/qualityTesting/mes-repairList'
// 	}
// ]

export const ManualReportingList = [
	{
		title: '颜色尺码报工',
		src: '../../static/workReport/workReport.png',
		link: '/pages/ManualReporting/ManualReporting?type=1'
	},
	{
		title: '数量报工',
		src: '../../static/outwardProcessing/outSourcingReceipt.png',
		link: '/pages/ManualReporting/ManualReporting?type=0'
	}
]
