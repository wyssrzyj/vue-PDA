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