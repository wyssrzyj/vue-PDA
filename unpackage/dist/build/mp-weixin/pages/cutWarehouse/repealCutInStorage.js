(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/cutWarehouse/repealCutInStorage"],{"1dbe":function(e,o,t){"use strict";t.r(o);var n=t("af00"),r=t("efc4");for(var a in r)"default"!==a&&function(e){t.d(o,e,(function(){return r[e]}))}(a);t("b63b");var c,u=t("f0c5"),s=Object(u["a"])(r["default"],n["b"],n["c"],!1,null,"4154e049",null,!1,n["a"],c);o["default"]=s.exports},"7ad0":function(e,o,t){},"9be0":function(e,o,t){"use strict";(function(e){Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var n=t("dc04"),r=t("d583"),a=c(t("8f88"));function c(e){return e&&e.__esModule?e:{default:e}}function u(e,o){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);o&&(n=n.filter((function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var o=1;o<arguments.length;o++){var t=null!=arguments[o]?arguments[o]:{};o%2?u(Object(t),!0).forEach((function(o){i(e,o,t[o])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))}))}return e}function i(e,o,t){return o in e?Object.defineProperty(e,o,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[o]=t,e}var d=function(){t.e("components/scan/scan").then(function(){return resolve(t("b2dc"))}.bind(null,t)).catch(t.oe)},l=(0,n.defineComponent)({name:"repealCutInStorage",onLoad:function(){},onShow:function(){var o=this;e.$off("scancodedate"),e.$on("scancodedate",(function(e){console.log(e),o.storageValue?(console.log("扫描PCS码"),o.handleScanPCS(e.code)):(console.log("扫描库位"),o.handleScanStorage(e.code))}))},setup:function(){var o=(0,n.reactive)({showModal:!1,showSuccessPop:!1,showErrorPop:!1,showReasonMask:!1,showSuccessMessage:"",showErrorMessage:"",storageValue:"",wareHouseLocation:"",typeMode:"2",inStorageArr:[],startX:"",selectIndex:0,selectArr:[],username:"",date:""});(0,n.onMounted)((function(){a.default.getReason({}).then((function(e){0===e.code&&(o.selectArr=e.data.dictList.map((function(e){return e.dictLabel})),o.username=e.data.username,o.date=e.data.date)}))}));var t=function(){e.scanCode({onlyFromCamera:!0,success:function(e){console.log(e.result),o.storageValue?(console.log("扫描扫描PCS码"),u(e.result)):(console.log("扫描扫描库位"),c(e.result))},fail:function(e){}})},c=function(t){a.default.getLocation({locationCode:t}).then((function(t){if(0===t.code)e.showToast({title:"扫描库位成功！",icon:"none",duration:3e3}),o.wareHouseLocation=t.data.id,o.storageValue=t.data.locationCode;else{o.showErrorMessage=t.msg,o.showErrorPop=!0;var n=setTimeout((function(){clearTimeout(n),o.showErrorPop=!1}),2e3)}}))},u=function(t){o.inStorageArr=o.inStorageArr.reverse(),a.default.getInfoBySearch({pcsNum:t,type:o.typeMode,wareHouseLocation:o.wareHouseLocation}).then((function(t){if(0===t.code)e.showToast({title:"扫描PCS码成功！",icon:"none",duration:3e3}),o.inStorageArr.push({id:t.data.subpackageId||"",productId:t.data.productId||"",produceId:t.data.produceId||"",subpackageId:t.data.subpackageId||"",proNum:t.data.proNum||"",colorCode:t.data.colorCode||"",colorName:t.data.colorName||"",sizeCode:t.data.sizeCode||"",sizeName:t.data.sizeName||"",packageNum:t.data.packageNum||"",inputNumber:t.data.inputNumber||"",arrowFlag:!0}),o.inStorageArr=(0,r.arrayToHeavy)(o.inStorageArr),o.inStorageArr=o.inStorageArr.reverse();else{o.showErrorMessage=t.msg,o.showErrorPop=!0;var n=setTimeout((function(){clearTimeout(n),o.showErrorPop=!1}),2e3)}}))},i=function(e){o.startX=(0,r.touchStart)(e)},d=function(e){o.inStorageArr=(0,r.touchMove)(e,o.startX,o.inStorageArr)},l=function(e){o.inStorageArr=(0,r.touchEnd)(e,o.startX,o.inStorageArr)},f=function(e){o.inStorageArr.splice(e,1)},p=function(){o.showModal=!0},g=function(){o.showReasonMask=!0},h=function(){o.inStorageArr=[],o.showModal=!1,o.storageValue=""},m=function(e){o.selectIndex=e.detail.value},b=function(){o.showReasonMask=!1},S=function(){var e=o.inStorageArr.map((function(e,t){return{index:o.inStorageArr.length-t,productId:e.productId||"",produceId:e.produceId||"",subpackageId:e.subpackageId||"",proNum:e.proNum||"",colorCode:e.colorCode||"",colorName:e.colorName||"",sizeCode:e.sizeCode||"",sizeName:e.sizeName||"",packageNum:e.packageNum||"",inputNumber:e.inputNumber||"",outputNumber:0,storageStatus:2,warehouseLocationId:o.wareHouseLocation}}));a.default.addPiecesMarket({rollReason:String(o.selectIndex+1),list:e}).then((function(e){if(0===e.code){o.inStorageArr=[],o.showReasonMask=!1,o.showSuccessMessage="撤销入库成功！",o.showSuccessPop=!0;var t=setTimeout((function(){clearTimeout(t),o.showSuccessPop=!1}),2e3)}}))};return s(s({},(0,n.toRefs)(o)),{},{handleScanCodeBox:t,handleScanStorage:c,handleScanPCS:u,handleTouchStart:i,handleTouchMove:d,handleTouchEnd:l,deleteMember:f,handleMore:p,handleRepealInStorage:g,handleEmpty:h,bindPickerChange:m,handleCancel:b,handleConfirm:S})},components:{scanCode:d}});o.default=l}).call(this,t("d5d0")["default"])},af00:function(e,o,t){"use strict";var n;t.d(o,"b",(function(){return r})),t.d(o,"c",(function(){return a})),t.d(o,"a",(function(){return n}));var r=function(){var e=this,o=e.$createElement;e._self._c},a=[]},b19f:function(e,o,t){"use strict";(function(e){t("1848");n(t("dc04"));var o=n(t("1dbe"));function n(e){return e&&e.__esModule?e:{default:e}}wx.__webpack_require_UNI_MP_PLUGIN__=t,e(o.default)}).call(this,t("97ff")["createPage"])},b63b:function(e,o,t){"use strict";var n=t("7ad0"),r=t.n(n);r.a},efc4:function(e,o,t){"use strict";t.r(o);var n=t("9be0"),r=t.n(n);for(var a in n)"default"!==a&&function(e){t.d(o,e,(function(){return n[e]}))}(a);o["default"]=r.a}},[["b19f","common/runtime","common/vendor"]]]);