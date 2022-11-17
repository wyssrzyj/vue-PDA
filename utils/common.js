export const cutWarehouseList = [
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
export const outwardProcessingList = [
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
export const workReportList=[
	{
		title:"按包报工",
		permissions: 'mes:mesengineeringmanagement:workReport',
		src: '../../static/menuIcon/mes_workReport.svg',
		link: '/pages/workReport/mes_workReport'
	},
]
export const blanketDataList = [
	{
		title: '铺布数据采集',
		permissions: 'mes:messpreadcloth:blanketDataCollect',
		src: '../../static/menuIcon/blanketDataCollect.svg',
		link: '/pages/blanket/blanketDataCollect'
	}
]
export const outsourcingDataList = [
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
// export const qualityTestingDataList = [
// 	{
// 		title: '质检',
// 		// permissions: 'mes:messpreadcloth:blanketDataCollect',
// 		src: '../../static/menuIcon/qualityTesting.svg',
// 		link: '/pages/qualityTesting/mes-qualityTesting'
// 	},
// 	{
// 		title: '返修',
// 		// permissions: 'mes:messpreadcloth:blanketDataCollect',
// 		src: '../../static/menuIcon/repairList.svg',
// 		link: '/pages/qualityTesting/mes-repairList'
// 	}
// ]

export const ManualReportingList = [
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
