var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
(function(vue) {
  "use strict";
  function _interopNamespace(e) {
    if (e && e.__esModule)
      return e;
    var n = { __proto__: null, [Symbol.toStringTag]: "Module" };
    if (e) {
      Object.keys(e).forEach(function(k) {
        if (k !== "default") {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function() {
              return e[k];
            }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }
  var vue__namespace = /* @__PURE__ */ _interopNamespace(vue);
  Object.freeze({});
  Object.freeze([]);
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  function isDebugMode() {
    return typeof __channelId__ === "string" && __channelId__;
  }
  function jsonStringifyReplacer(k, p) {
    switch (toRawType(p)) {
      case "Function":
        return "function() { [native code] }";
      default:
        return p;
    }
  }
  function normalizeLog(type, filename, args) {
    if (isDebugMode()) {
      args.push(filename.replace("at ", "uni-app:///"));
      return console[type].apply(console, args);
    }
    const msgs = args.map(function(v) {
      const type2 = toTypeString(v).toLowerCase();
      if (type2 === "[object object]" || type2 === "[object array]") {
        try {
          v = "---BEGIN:JSON---" + JSON.stringify(v, jsonStringifyReplacer) + "---END:JSON---";
        } catch (e) {
          v = type2;
        }
      } else {
        if (v === null) {
          v = "---NULL---";
        } else if (v === void 0) {
          v = "---UNDEFINED---";
        } else {
          const vType = toRawType(v).toUpperCase();
          if (vType === "NUMBER" || vType === "BOOLEAN") {
            v = "---BEGIN:" + vType + "---" + v + "---END:" + vType + "---";
          } else {
            v = String(v);
          }
        }
      }
      return v;
    });
    return msgs.join("---COMMA---") + " " + filename;
  }
  function formatAppLog(type, filename, ...args) {
    const res = normalizeLog(type, filename, args);
    res && console[type](res);
  }
  const hasToken = () => {
    const token = uni.getStorageSync("token");
    return token ? token : null;
  };
  const arrayToHeavy = (arr) => {
    let obj = {};
    arr = arr.reduce(function(item, next) {
      obj[next.id] ? "" : obj[next.id] = item.push(next);
      return item;
    }, []);
    return arr;
  };
  const touchStart = (e) => {
    if (e.touches.length == 1) {
      return e.touches[0].clientX;
    }
  };
  const touchMove = (e, startX, inStorageArr) => {
    if (e.touches.length == 1) {
      let index = e.currentTarget.dataset.index;
      let moveX = e.touches[0].clientX;
      let disX = startX - moveX;
      let delBtnWidth = 60;
      let txtStyle = "";
      let list = inStorageArr;
      if (disX == 0 || disX < 0) {
        txtStyle = "left:0px";
        list[index].arrowFlag = true;
      } else if (disX > 0) {
        list[index].arrowFlag = false;
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      list[index].txtStyle = txtStyle;
      return list;
    }
  };
  const touchEnd = (e, startX, inStorageArr) => {
    if (e.changedTouches.length == 1) {
      let endX = e.changedTouches[0].clientX;
      let disX = startX - endX;
      let delBtnWidth = 60;
      let txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      let index = e.currentTarget.dataset.index;
      let list = inStorageArr;
      list[index].txtStyle = txtStyle;
      return list;
    }
  };
  const toasting = (message, func = () => {
  }, time = 1e3) => {
    uni.showToast({
      title: message,
      icon: "none",
      duration: time,
      success: function() {
        let timer = setTimeout(async () => {
          clearTimeout(timer);
          uni.hideToast();
          func ? await func() : formatAppLog("log", "at utils/index.js:91", "toasting no func");
        }, time);
      }
    });
  };
  const requestApi = async (url, method, options = {}) => {
    return new Promise((resolve, reject) => {
      uni.showLoading({
        title: "\u52A0\u8F7D\u4E2D..."
      });
      uni.request({
        method: method ? method : "GET",
        header: {
          "Content-Type": "application/json",
          "X-AjaxPro-Method": "ShowList",
          "Access-Control-Allow-Origin": "*",
          "Origin-Terminal": "PDA",
          token: uni.getStorageSync("token")
        },
        url,
        data: options,
        async success(res) {
          if (res.statusCode == 200) {
            if (res.data.code == 401) {
              toasting(res.data.msg);
              if (!hasToken()) {
                uni.navigateTo({
                  url: "/pages/login/login"
                });
              }
            } else {
              await resolve(res.data);
              uni.hideLoading();
            }
          } else if (res.statusCode == 500) {
            toasting("\u670D\u52A1\u5668\u9519\u8BEF");
            uni.hideLoading();
          } else {
            uni.hideLoading();
          }
        },
        async fail(res) {
          await reject(res);
          uni.hideLoading();
        }
      });
    });
  };
  const API_ADDRESS = "http://192.168.99.140/proxyApi";
  const Api = {
    login(reqData) {
      return requestApi(`${API_ADDRESS}/login`, "POST", reqData);
    },
    getLocation(reqData) {
      return requestApi(`${API_ADDRESS}/MesLocationManagement/meslocationmanagement/getLocation`, "GET", reqData);
    },
    getInfoBySearch(reqData) {
      return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/getInfoBySearch`, "GET", reqData);
    },
    addPiecesMarket(reqData) {
      return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/addPiecesMarket`, "POST", reqData);
    },
    getReason(reqData) {
      return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/getReason`, "GET", reqData);
    },
    getSewingExecution(reqData) {
      return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/getSewingExecution`, "GET", reqData);
    },
    getPiecesByPCSNum(reqData) {
      return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/getPiecesByPCSNum`, "GET", reqData);
    },
    outOfStock(reqData) {
      return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/outOfStock`, "POST", reqData);
    }
  };
  var _export_sfc = (sfc, props) => {
    for (const [key, val] of props) {
      sfc[key] = val;
    }
    return sfc;
  };
  const _sfc_main$6 = vue.defineComponent({
    name: "login",
    onLoad() {
    },
    onShow() {
      uni.removeStorageSync("token");
    },
    setup() {
      const formSubmit = (e) => {
        try {
          const { username, password } = e.detail.value;
          if (!username) {
            toasting("\u8BF7\u8F93\u5165\u7528\u6237\u540D");
            return;
          } else if (!password) {
            toasting("\u8BF7\u8F93\u5165\u5BC6\u7801");
            return;
          }
          Api.login({
            username,
            password
          }).then((res) => {
            if (res.code === 0) {
              toasting("\u767B\u5F55\u6210\u529F");
              uni.removeStorageSync("token");
              uni.setStorageSync("token", res.data.token);
              uni.navigateTo({
                url: "/pages/cutWarehouse/cutWarehouse"
              });
            }
          });
        } catch (error) {
          formatAppLog("log", "at pages/login/login.vue:70", error);
        }
      };
      return {
        formSubmit
      };
    }
  });
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "logoBox" }, [
        vue.createElementVNode("image", {
          src: "/static/login/logo.png",
          mode: "widthFix",
          class: "logo"
        })
      ]),
      vue.createElementVNode("form", {
        onSubmit: _cache[0] || (_cache[0] = (...args) => _ctx.formSubmit && _ctx.formSubmit(...args)),
        class: "form-box"
      }, [
        vue.createElementVNode("view", { class: "cu-form-group input-ba" }, [
          vue.createElementVNode("image", {
            src: "/static/login/username@3x.png",
            class: "icon-login"
          }),
          vue.createElementVNode("input", {
            class: "input-box",
            placeholder: "\u8BF7\u8F93\u5165\u8D26\u53F7",
            name: "username",
            value: ""
          })
        ]),
        vue.createElementVNode("view", { class: "cu-form-group margin-lr-xl input-ba" }, [
          vue.createElementVNode("image", {
            src: "/static/login/password.png",
            class: "icon-login"
          }),
          vue.createElementVNode("input", {
            class: "input-box",
            type: "password",
            placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
            name: "password",
            value: ""
          })
        ]),
        vue.createElementVNode("view", { class: "padding flex flex-direction margin-top-xl" }, [
          vue.createElementVNode("button", {
            class: "cu-btn bg-blue lg btn-login",
            "form-type": "submit"
          }, "\u767B\u5F55")
        ]),
        vue.createCommentVNode(` <view class="padding flex flex-direction" v-if="type!=='dd'">\r
				<view class="text-blue lg text-center" @tap="register">\u6CE8\u518C</view>\r
			</view> `)
      ], 32)
    ]);
  }
  var PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-b237504c"]]);
  const cutWarehouseList = [
    {
      title: "\u88C1\u7247\u5165\u5E93",
      src: "../../static/cutWarehouse/ruku.png",
      color: "linear-gradient(180deg, #08B0D0 0%, #06B8D7 100%)",
      link: "/pages/cutWarehouse/cutInStorage"
    },
    {
      title: "\u88C1\u7247\u51FA\u5E93",
      src: "../../static/cutWarehouse/chuku.png",
      color: "linear-gradient(180deg, #4F94EF 0%, #438CF0 100%)",
      link: "/pages/cutWarehouse/cutOutStorage"
    },
    {
      title: "\u64A4\u9500\u88C1\u7247\u5165\u5E93",
      src: "../../static/cutWarehouse/chexiaoruku.png",
      color: " linear-gradient(0deg, #F0AA38 0%, #F48D34 100%)",
      link: "/pages/cutWarehouse/repealCutInStorage"
    }
  ];
  const _sfc_main$5 = vue.defineComponent({
    name: "cutWarehouse",
    setup() {
      const state = vue.reactive({
        list: cutWarehouseList
      });
      const toList = (item) => {
        uni.navigateTo({
          url: item.link
        });
      };
      return __spreadProps(__spreadValues({}, vue.toRefs(state)), {
        toList
      });
    }
  });
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "tabBox" }, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.list, (item, index) => {
        return vue.openBlock(), vue.createElementBlock("view", {
          key: index,
          class: vue.normalizeClass([index % 2 ? "" : "addRightMargin", "boxItem"]),
          onClick: ($event) => _ctx.toList(item),
          style: vue.normalizeStyle({ background: item.color })
        }, [
          vue.createElementVNode("image", {
            src: item.src,
            class: "image"
          }, null, 8, ["src"]),
          vue.createElementVNode("text", { class: "boxItemTitle" }, vue.toDisplayString(item.title), 1)
        ], 14, ["onClick"]);
      }), 128))
    ]);
  }
  var PagesCutWarehouseCutWarehouse = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-7fcbf5a6"]]);
  var main, receiver, filter;
  var _codeQueryTag = false;
  const _sfc_main$4 = {
    data() {
      return {
        scanCode: ""
      };
    },
    created: function(option) {
      this.initScan();
      this.startScan();
    },
    onHide: function() {
      this.stopScan();
    },
    destroyed: function() {
      this.stopScan();
    },
    methods: {
      initScan() {
        let _this = this;
        main = plus.android.runtimeMainActivity();
        var IntentFilter = plus.android.importClass("android.content.IntentFilter");
        filter = new IntentFilter();
        filter.addAction("com.scanner.broadcast");
        receiver = plus.android.implements("io.dcloud.feature.internal.reflect.BroadcastReceiver", {
          onReceive: function(context, intent) {
            plus.android.importClass(intent);
            let code = intent.getStringExtra("data");
            _this.queryCode(code);
          }
        });
      },
      startScan() {
        main.registerReceiver(receiver, filter);
      },
      stopScan() {
        main.unregisterReceiver(receiver);
      },
      queryCode(code) {
        if (_codeQueryTag)
          return false;
        _codeQueryTag = true;
        setTimeout(function() {
          _codeQueryTag = false;
        }, 150);
        uni.$emit("scancodedate", { code });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" });
  }
  var scanCode = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-2f5306b8"]]);
  const _sfc_main$3 = vue.defineComponent({
    name: "cutInStorage",
    onLoad() {
    },
    onShow() {
      uni.$off("scancodedate");
      uni.$on("scancodedate", (data) => {
        formatAppLog("log", "at pages/cutWarehouse/cutInStorage.vue:92", data);
        if (this.storageValue) {
          formatAppLog("log", "at pages/cutWarehouse/cutInStorage.vue:94", "\u626B\u63CFPCS\u7801");
          this.handleScanPCS(data.code);
        } else {
          formatAppLog("log", "at pages/cutWarehouse/cutInStorage.vue:98", "\u626B\u63CF\u5E93\u4F4D");
          this.handleScanStorage(data.code);
        }
      });
    },
    setup() {
      const state = vue.reactive({
        showModal: false,
        showSuccessPop: false,
        showErrorPop: false,
        showSuccessMessage: "",
        showErrorMessage: "",
        storageValue: "",
        wareHouseLocation: "",
        typeMode: "1",
        inStorageArr: [],
        startX: ""
      });
      const handleScanCodeBox = () => {
        uni.scanCode({
          onlyFromCamera: true,
          success: (res) => {
            formatAppLog("log", "at pages/cutWarehouse/cutInStorage.vue:122", res.result);
            if (state.storageValue) {
              formatAppLog("log", "at pages/cutWarehouse/cutInStorage.vue:125", "\u626B\u63CF\u626B\u63CFPCS\u7801");
              handleScanPCS(res.result);
            } else {
              formatAppLog("log", "at pages/cutWarehouse/cutInStorage.vue:129", "\u626B\u63CF\u626B\u63CF\u5E93\u4F4D");
              handleScanStorage(res.result);
            }
          },
          fail: (err) => {
          }
        });
      };
      const handleScanStorage = (locationCode) => {
        Api.getLocation({
          locationCode
        }).then((res) => {
          if (res.code === 0) {
            uni.showToast({
              title: "\u626B\u63CF\u5E93\u4F4D\u6210\u529F\uFF01",
              icon: "none",
              duration: 3e3
            });
            formatAppLog("log", "at pages/cutWarehouse/cutInStorage.vue:150", res.data);
            state.wareHouseLocation = res.data.id;
            state.storageValue = res.data.locationCode;
          } else {
            state.showErrorMessage = res.msg;
            state.showErrorPop = true;
            let timer = setTimeout(() => {
              clearTimeout(timer);
              state.showErrorPop = false;
            }, 2e3);
          }
        });
      };
      const handleScanPCS = (pcsNum) => {
        state.inStorageArr = state.inStorageArr.reverse();
        Api.getInfoBySearch({
          pcsNum,
          type: state.typeMode,
          wareHouseLocation: state.wareHouseLocation
        }).then((res) => {
          if (res.code === 0) {
            formatAppLog("log", "at pages/cutWarehouse/cutInStorage.vue:173", res.data);
            uni.showToast({
              title: "\u626B\u63CFPCS\u7801\u6210\u529F\uFF01",
              icon: "none",
              duration: 3e3
            });
            state.inStorageArr.push({
              id: res.data.subpackageId || "",
              productId: res.data.productId || "",
              produceId: res.data.produceId || "",
              subpackageId: res.data.subpackageId || "",
              proNum: res.data.proNum || "",
              colorCode: res.data.colorCode || "",
              colorName: res.data.colorName || "",
              sizeCode: res.data.sizeCode || "",
              sizeName: res.data.sizeName || "",
              packageNum: res.data.packageNum || "",
              inputNumber: res.data.inputNumber || "",
              arrowFlag: true
            });
            state.inStorageArr = arrayToHeavy(state.inStorageArr);
            state.inStorageArr = state.inStorageArr.reverse();
          } else {
            state.showErrorMessage = res.msg;
            state.showErrorPop = true;
            let timer = setTimeout(() => {
              clearTimeout(timer);
              state.showErrorPop = false;
            }, 2e3);
          }
        });
      };
      const handleTouchStart = (e) => {
        state.startX = touchStart(e);
      };
      const handleTouchMove = (e) => {
        state.inStorageArr = touchMove(e, state.startX, state.inStorageArr);
      };
      const handleTouchEnd = (e) => {
        state.inStorageArr = touchEnd(e, state.startX, state.inStorageArr);
      };
      const deleteMember = (index) => {
        state.inStorageArr.splice(index, 1);
      };
      const handleMore = () => {
        state.showModal = true;
      };
      const handleInStorage = () => {
        let listArr = state.inStorageArr.map((item, index) => {
          return {
            index: state.inStorageArr.length - index,
            productId: item.productId || "",
            produceId: item.produceId || "",
            subpackageId: item.subpackageId || "",
            proNum: item.proNum || "",
            colorCode: item.colorCode || "",
            colorName: item.colorName || "",
            sizeCode: item.sizeCode || "",
            sizeName: item.sizeName || "",
            packageNum: item.packageNum || "",
            inputNumber: item.inputNumber || "",
            outputNumber: 0,
            storageStatus: 0,
            warehouseLocationId: state.wareHouseLocation
          };
        });
        Api.addPiecesMarket({
          list: listArr
        }).then((res) => {
          if (res.code === 0) {
            state.inStorageArr = [];
            state.showSuccessMessage = "\u5165\u5E93\u6210\u529F\uFF01";
            state.showSuccessPop = true;
            let timer = setTimeout(() => {
              clearTimeout(timer);
              state.showSuccessPop = false;
            }, 2e3);
          }
        });
      };
      const handleEmpty = () => {
        state.inStorageArr = [];
        state.showModal = false;
        state.storageValue = "";
      };
      return __spreadProps(__spreadValues({}, vue.toRefs(state)), {
        handleScanCodeBox,
        handleScanStorage,
        handleScanPCS,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        deleteMember,
        handleMore,
        handleInStorage,
        handleEmpty
      });
    },
    components: {
      scanCode
    }
  });
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_scanCode = vue.resolveComponent("scanCode");
    return vue.openBlock(), vue.createElementBlock("view", { class: "mainContent" }, [
      vue.createCommentVNode(' <view class="commonBtn" @tap="handleScanStorage" style="background-color: #fca147;">\u626B\u63CF\u5E93\u4F4D</view> '),
      vue.createCommentVNode(' <view class="commonBtn" @tap="handleScanPCS" style="background-color: #4a70f5;">\u626B\u63CFPCS\u7801</view> '),
      vue.createElementVNode("view", { class: "location" }, [
        vue.createElementVNode("image", {
          class: "scanCodeBox",
          src: "/static/cutWarehouse/scanCodeBox.png",
          mode: "aspectFit",
          onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleScanCodeBox && _ctx.handleScanCodeBox(...args))
        }),
        vue.createElementVNode("input", {
          class: "uni-input scanInput",
          "placeholder-style": "font-size: 34rpx",
          "confirm-type": "search",
          placeholder: _ctx.storageValue ? "\u8BF7\u626B\u63CFPCS\u7801" : "\u8BF7\u626B\u63CF\u5E93\u4F4D\u7801"
        }, null, 8, ["placeholder"])
      ]),
      vue.createElementVNode("view", { class: "storageLocation" }, [
        vue.createElementVNode("text", { class: "storageTitle" }, "\u5F53\u524D\u5E93\u4F4D\uFF1A"),
        vue.withDirectives(vue.createElementVNode("input", {
          class: "uni-input storageInput",
          "placeholder-style": "font-size: 34rpx",
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.storageValue = $event),
          "confirm-type": "search",
          placeholder: "\u8BF7\u8F93\u5165\u5F53\u524D\u5E93\u4F4D",
          disabled: ""
        }, null, 512), [
          [vue.vModelText, _ctx.storageValue]
        ])
      ]),
      vue.createElementVNode("view", { class: "pannelContent" }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.inStorageArr, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "storageItem",
            key: index
          }, [
            vue.createElementVNode("view", {
              class: vue.normalizeClass([index == 0 ? "selectLine" : "", "touch-list", "list-touch"]),
              onTouchstart: _cache[2] || (_cache[2] = (...args) => _ctx.handleTouchStart && _ctx.handleTouchStart(...args)),
              onTouchmove: _cache[3] || (_cache[3] = (...args) => _ctx.handleTouchMove && _ctx.handleTouchMove(...args)),
              onTouchend: _cache[4] || (_cache[4] = (...args) => _ctx.handleTouchEnd && _ctx.handleTouchEnd(...args)),
              "data-index": index,
              style: vue.normalizeStyle(item.txtStyle)
            }, [
              vue.createElementVNode("text", { class: "serialNumber" }, vue.toDisplayString(_ctx.inStorageArr.length - index) + ".", 1),
              vue.createElementVNode("view", null, [
                vue.createElementVNode("view", { class: "storageCode" }, vue.toDisplayString(item.proNum), 1),
                vue.createElementVNode("view", null, [
                  vue.createElementVNode("text", null, "\u989C\u8272\u5C3A\u7801\uFF1A"),
                  vue.createElementVNode("text", {
                    decode: "true",
                    space: "true"
                  }, vue.toDisplayString(item.colorCode) + "\u2003" + vue.toDisplayString(item.colorName) + "\u2003" + vue.toDisplayString(item.sizeName), 1)
                ]),
                vue.createElementVNode("view", { class: "storageContent" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode("text", null, "\u624E\u53F7\uFF1A"),
                    vue.createElementVNode("text", null, vue.toDisplayString(item.packageNum), 1)
                  ]),
                  vue.createElementVNode("view", { class: "storageNum" }, [
                    vue.createElementVNode("text", null, "\u6570\u91CF\uFF1A"),
                    vue.createElementVNode("text", null, vue.toDisplayString(item.inputNumber), 1)
                  ])
                ])
              ]),
              item.arrowFlag ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                class: "arrowImage",
                src: "/static/cutWarehouse/leftArrow.png",
                mode: "aspectFit"
              })) : (vue.openBlock(), vue.createElementBlock("image", {
                key: 1,
                class: "arrowImage",
                src: "/static/cutWarehouse/rightArrow.png",
                mode: "aspectFit"
              }))
            ], 46, ["data-index"]),
            vue.createElementVNode("view", {
              class: "touch-list list-delete",
              onClick: ($event) => _ctx.deleteMember(index)
            }, " \u5220\u9664 ", 8, ["onClick"])
          ]);
        }), 128))
      ]),
      vue.createElementVNode("view", { class: "bottomLocation" }, [
        vue.createElementVNode("view", { class: "scanNum" }, "\u5DF2\u626B\u63CF\u884C\u6570\uFF1A" + vue.toDisplayString(_ctx.inStorageArr.length), 1),
        vue.createElementVNode("view", { class: "btnLocation" }, [
          vue.createElementVNode("view", {
            class: "commonBtn moreBtn",
            onClick: _cache[5] || (_cache[5] = (...args) => _ctx.handleMore && _ctx.handleMore(...args))
          }, "\u66F4\u591A"),
          _ctx.inStorageArr.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "commonBtn inStorageBtn",
            onClick: _cache[6] || (_cache[6] = (...args) => _ctx.handleInStorage && _ctx.handleInStorage(...args))
          }, "\u5165\u5E93")) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "commonBtn noInStorageBtn"
          }, "\u5165\u5E93"))
        ])
      ]),
      vue.withDirectives(vue.createElementVNode("view", { class: "btnModal" }, [
        vue.createElementVNode("image", {
          class: "modalImage",
          src: "/static/cutWarehouse/modalImage.png",
          mode: "aspectFit"
        }),
        vue.createElementVNode("view", {
          class: "commonBtn emptyBtn",
          onClick: _cache[7] || (_cache[7] = (...args) => _ctx.handleEmpty && _ctx.handleEmpty(...args))
        }, "\u6E05\u7A7A")
      ], 512), [
        [vue.vShow, _ctx.showModal]
      ]),
      _ctx.showSuccessPop ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "successPopup remindPopup"
      }, [
        vue.createElementVNode("view", { class: "successImage" }),
        vue.createElementVNode("view", { style: { "margin-left": "20rpx" } }, vue.toDisplayString(_ctx.showSuccessMessage), 1)
      ])) : vue.createCommentVNode("v-if", true),
      _ctx.showErrorPop ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "errorPopup remindPopup"
      }, [
        vue.createElementVNode("view", { class: "errorImage" }),
        vue.createElementVNode("view", { style: { "margin-left": "20rpx" } }, vue.toDisplayString(_ctx.showErrorMessage), 1)
      ])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_scanCode)
    ]);
  }
  var PagesCutWarehouseCutInStorage = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-304ec2f9"]]);
  const _sfc_main$2 = vue.defineComponent({
    name: "repealCutInStorage",
    onLoad() {
    },
    onShow() {
      uni.$off("scancodedate");
      uni.$on("scancodedate", (data) => {
        formatAppLog("log", "at pages/cutWarehouse/repealCutInStorage.vue:118", data);
        if (this.storageValue) {
          formatAppLog("log", "at pages/cutWarehouse/repealCutInStorage.vue:120", "\u626B\u63CFPCS\u7801");
          this.handleScanPCS(data.code);
        } else {
          formatAppLog("log", "at pages/cutWarehouse/repealCutInStorage.vue:124", "\u626B\u63CF\u5E93\u4F4D");
          this.handleScanStorage(data.code);
        }
      });
    },
    setup() {
      const state = vue.reactive({
        showModal: false,
        showSuccessPop: false,
        showErrorPop: false,
        showReasonMask: false,
        showSuccessMessage: "",
        showErrorMessage: "",
        storageValue: "",
        wareHouseLocation: "",
        typeMode: "2",
        inStorageArr: [],
        startX: "",
        selectIndex: 0,
        selectArr: [],
        username: "",
        date: ""
      });
      vue.onMounted(() => {
        Api.getReason({}).then((res) => {
          if (res.code === 0) {
            state.selectArr = res.data.dictList.map((item) => {
              return item.dictLabel;
            });
            state.username = res.data.username;
            state.date = res.data.date;
          }
        });
      });
      const handleScanCodeBox = () => {
        uni.scanCode({
          onlyFromCamera: true,
          success: (res) => {
            formatAppLog("log", "at pages/cutWarehouse/repealCutInStorage.vue:170", res.result);
            if (state.storageValue) {
              formatAppLog("log", "at pages/cutWarehouse/repealCutInStorage.vue:173", "\u626B\u63CF\u626B\u63CFPCS\u7801");
              handleScanPCS(res.result);
            } else {
              formatAppLog("log", "at pages/cutWarehouse/repealCutInStorage.vue:177", "\u626B\u63CF\u626B\u63CF\u5E93\u4F4D");
              handleScanStorage(res.result);
            }
          },
          fail: (err) => {
          }
        });
      };
      const handleScanStorage = (locationCode) => {
        Api.getLocation({
          locationCode
        }).then((res) => {
          if (res.code === 0) {
            uni.showToast({
              title: "\u626B\u63CF\u5E93\u4F4D\u6210\u529F\uFF01",
              icon: "none",
              duration: 3e3
            });
            state.wareHouseLocation = res.data.id;
            state.storageValue = res.data.locationCode;
          } else {
            state.showErrorMessage = res.msg;
            state.showErrorPop = true;
            let timer = setTimeout(() => {
              clearTimeout(timer);
              state.showErrorPop = false;
            }, 2e3);
          }
        });
      };
      const handleScanPCS = (pcsNum) => {
        state.inStorageArr = state.inStorageArr.reverse();
        Api.getInfoBySearch({
          pcsNum,
          type: state.typeMode,
          wareHouseLocation: state.wareHouseLocation
        }).then((res) => {
          if (res.code === 0) {
            uni.showToast({
              title: "\u626B\u63CFPCS\u7801\u6210\u529F\uFF01",
              icon: "none",
              duration: 3e3
            });
            state.inStorageArr.push({
              id: res.data.subpackageId || "",
              productId: res.data.productId || "",
              produceId: res.data.produceId || "",
              subpackageId: res.data.subpackageId || "",
              proNum: res.data.proNum || "",
              colorCode: res.data.colorCode || "",
              colorName: res.data.colorName || "",
              sizeCode: res.data.sizeCode || "",
              sizeName: res.data.sizeName || "",
              packageNum: res.data.packageNum || "",
              inputNumber: res.data.inputNumber || "",
              arrowFlag: true
            });
            state.inStorageArr = arrayToHeavy(state.inStorageArr);
            state.inStorageArr = state.inStorageArr.reverse();
          } else {
            state.showErrorMessage = res.msg;
            state.showErrorPop = true;
            let timer = setTimeout(() => {
              clearTimeout(timer);
              state.showErrorPop = false;
            }, 2e3);
          }
        });
      };
      const handleTouchStart = (e) => {
        state.startX = touchStart(e);
      };
      const handleTouchMove = (e) => {
        state.inStorageArr = touchMove(e, state.startX, state.inStorageArr);
      };
      const handleTouchEnd = (e) => {
        state.inStorageArr = touchEnd(e, state.startX, state.inStorageArr);
      };
      const deleteMember = (index) => {
        state.inStorageArr.splice(index, 1);
      };
      const handleMore = () => {
        state.showModal = true;
      };
      const handleRepealInStorage = () => {
        state.showReasonMask = true;
      };
      const handleEmpty = () => {
        state.inStorageArr = [];
        state.showModal = false;
        state.storageValue = "";
      };
      const bindPickerChange = (e) => {
        state.selectIndex = e.detail.value;
      };
      const handleCancel = () => {
        state.showReasonMask = false;
      };
      const handleConfirm = () => {
        let listArr = state.inStorageArr.map((item, index) => {
          return {
            index: state.inStorageArr.length - index,
            productId: item.productId || "",
            produceId: item.produceId || "",
            subpackageId: item.subpackageId || "",
            proNum: item.proNum || "",
            colorCode: item.colorCode || "",
            colorName: item.colorName || "",
            sizeCode: item.sizeCode || "",
            sizeName: item.sizeName || "",
            packageNum: item.packageNum || "",
            inputNumber: item.inputNumber || "",
            outputNumber: 0,
            storageStatus: 2,
            warehouseLocationId: state.wareHouseLocation
          };
        });
        Api.addPiecesMarket({
          rollReason: String(state.selectIndex + 1),
          list: listArr
        }).then((res) => {
          if (res.code === 0) {
            state.inStorageArr = [];
            state.showReasonMask = false;
            state.showSuccessMessage = "\u64A4\u9500\u5165\u5E93\u6210\u529F\uFF01";
            state.showSuccessPop = true;
            let timer = setTimeout(() => {
              clearTimeout(timer);
              state.showSuccessPop = false;
            }, 2e3);
          }
        });
      };
      return __spreadProps(__spreadValues({}, vue.toRefs(state)), {
        handleScanCodeBox,
        handleScanStorage,
        handleScanPCS,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        deleteMember,
        handleMore,
        handleRepealInStorage,
        handleEmpty,
        bindPickerChange,
        handleCancel,
        handleConfirm
      });
    },
    components: {
      scanCode
    }
  });
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_scanCode = vue.resolveComponent("scanCode");
    return vue.openBlock(), vue.createElementBlock("view", { class: "mainContent" }, [
      vue.createCommentVNode(' <view class="commonBtn" @tap="handleScanStorage" style="background-color: #fca147;">\u626B\u63CF\u5E93\u4F4D</view> '),
      vue.createCommentVNode(' <view class="commonBtn" @tap="handleScanPCS" style="background-color: #4a70f5;">\u626B\u63CFPCS\u7801</view> '),
      vue.createElementVNode("view", { class: "location" }, [
        vue.createElementVNode("image", {
          class: "scanCodeBox",
          src: "/static/cutWarehouse/scanCodeBox.png",
          mode: "aspectFit",
          onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleScanCodeBox && _ctx.handleScanCodeBox(...args))
        }),
        vue.createElementVNode("input", {
          class: "uni-input scanInput",
          "placeholder-style": "font-size: 34rpx",
          "confirm-type": "search",
          placeholder: _ctx.storageValue ? "\u8BF7\u626B\u63CFPCS\u7801" : "\u8BF7\u626B\u63CF\u5E93\u4F4D\u7801"
        }, null, 8, ["placeholder"])
      ]),
      vue.createElementVNode("view", { class: "storageLocation" }, [
        vue.createElementVNode("text", { class: "storageTitle" }, "\u5F53\u524D\u5E93\u4F4D\uFF1A"),
        vue.withDirectives(vue.createElementVNode("input", {
          class: "uni-input storageInput",
          "placeholder-style": "font-size: 34rpx",
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.storageValue = $event),
          "confirm-type": "search",
          placeholder: "\u8BF7\u8F93\u5165\u5F53\u524D\u5E93\u4F4D",
          disabled: ""
        }, null, 512), [
          [vue.vModelText, _ctx.storageValue]
        ])
      ]),
      vue.createElementVNode("view", { class: "pannelContent" }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.inStorageArr, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "storageItem",
            key: index
          }, [
            vue.createElementVNode("view", {
              class: vue.normalizeClass([index == 0 ? "selectLine" : "", "touch-list", "list-touch"]),
              onTouchstart: _cache[2] || (_cache[2] = (...args) => _ctx.handleTouchStart && _ctx.handleTouchStart(...args)),
              onTouchmove: _cache[3] || (_cache[3] = (...args) => _ctx.handleTouchMove && _ctx.handleTouchMove(...args)),
              onTouchend: _cache[4] || (_cache[4] = (...args) => _ctx.handleTouchEnd && _ctx.handleTouchEnd(...args)),
              "data-index": index,
              style: vue.normalizeStyle(item.txtStyle)
            }, [
              vue.createElementVNode("text", { class: "serialNumber" }, vue.toDisplayString(_ctx.inStorageArr.length - index) + ".", 1),
              vue.createElementVNode("view", null, [
                vue.createElementVNode("view", { class: "storageCode" }, vue.toDisplayString(item.proNum), 1),
                vue.createElementVNode("view", null, [
                  vue.createElementVNode("text", null, "\u989C\u8272\u5C3A\u7801\uFF1A"),
                  vue.createElementVNode("text", {
                    decode: "true",
                    space: "true"
                  }, vue.toDisplayString(item.colorCode) + "\u2003" + vue.toDisplayString(item.colorName) + "\u2003" + vue.toDisplayString(item.sizeName), 1)
                ]),
                vue.createElementVNode("view", { class: "storageContent" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode("text", null, "\u624E\u53F7\uFF1A"),
                    vue.createElementVNode("text", null, vue.toDisplayString(item.packageNum), 1)
                  ]),
                  vue.createElementVNode("view", { class: "storageNum" }, [
                    vue.createElementVNode("text", null, "\u6570\u91CF\uFF1A"),
                    vue.createElementVNode("text", null, vue.toDisplayString(item.inputNumber), 1)
                  ])
                ])
              ]),
              item.arrowFlag ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                class: "arrowImage",
                src: "/static/cutWarehouse/leftArrow.png",
                mode: "aspectFit"
              })) : (vue.openBlock(), vue.createElementBlock("image", {
                key: 1,
                class: "arrowImage",
                src: "/static/cutWarehouse/rightArrow.png",
                mode: "aspectFit"
              }))
            ], 46, ["data-index"]),
            vue.createElementVNode("view", {
              class: "touch-list list-delete",
              onClick: ($event) => _ctx.deleteMember(index)
            }, " \u5220\u9664 ", 8, ["onClick"])
          ]);
        }), 128))
      ]),
      vue.createElementVNode("view", { class: "bottomLocation" }, [
        vue.createElementVNode("view", { class: "scanNum" }, "\u5DF2\u626B\u63CF\u884C\u6570\uFF1A" + vue.toDisplayString(_ctx.inStorageArr.length), 1),
        vue.createElementVNode("view", { class: "btnLocation" }, [
          vue.createElementVNode("view", {
            class: "commonBtn moreBtn",
            onClick: _cache[5] || (_cache[5] = (...args) => _ctx.handleMore && _ctx.handleMore(...args))
          }, "\u66F4\u591A"),
          _ctx.inStorageArr.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "commonBtn inStorageBtn",
            onClick: _cache[6] || (_cache[6] = (...args) => _ctx.handleRepealInStorage && _ctx.handleRepealInStorage(...args))
          }, "\u64A4\u9500\u5165\u5E93")) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "commonBtn noInStorageBtn"
          }, "\u64A4\u9500\u5165\u5E93"))
        ])
      ]),
      vue.withDirectives(vue.createElementVNode("view", { class: "btnModal" }, [
        vue.createElementVNode("image", {
          class: "modalImage",
          src: "/static/cutWarehouse/modalImage.png",
          mode: "aspectFit"
        }),
        vue.createElementVNode("view", {
          class: "commonBtn emptyBtn",
          onClick: _cache[7] || (_cache[7] = (...args) => _ctx.handleEmpty && _ctx.handleEmpty(...args))
        }, "\u6E05\u7A7A")
      ], 512), [
        [vue.vShow, _ctx.showModal]
      ]),
      _ctx.showSuccessPop ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "successPopup remindPopup"
      }, [
        vue.createElementVNode("view", { class: "successImage" }),
        vue.createElementVNode("view", { style: { "margin-left": "20rpx" } }, vue.toDisplayString(_ctx.showSuccessMessage), 1)
      ])) : vue.createCommentVNode("v-if", true),
      _ctx.showErrorPop ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "errorPopup remindPopup"
      }, [
        vue.createElementVNode("view", { class: "errorImage" }),
        vue.createElementVNode("view", { style: { "margin-left": "20rpx" } }, vue.toDisplayString(_ctx.showErrorMessage), 1)
      ])) : vue.createCommentVNode("v-if", true),
      _ctx.showReasonMask ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "reasonMask"
      }, [
        vue.createElementVNode("view", { class: "reasonDialog" }, [
          vue.createElementVNode("view", { class: "reasonContent" }, [
            vue.createElementVNode("view", { class: "reasonTitle" }, "\u539F\u56E0\u8BB0\u5F55"),
            vue.createElementVNode("view", { class: "reasonInside" }, [
              vue.createElementVNode("view", { class: "reasonText" }, [
                vue.createElementVNode("text", { style: { "color": "red" } }, "*"),
                vue.createTextVNode("\u64A4\u9500\u5165\u5E93\u539F\u56E0\uFF1A ")
              ]),
              vue.createElementVNode("view", { class: "reasonSelect" }, [
                vue.createElementVNode("picker", {
                  onChange: _cache[8] || (_cache[8] = (...args) => _ctx.bindPickerChange && _ctx.bindPickerChange(...args)),
                  value: _ctx.selectIndex,
                  range: _ctx.selectArr,
                  "range-key": "selectIndex"
                }, [
                  vue.createElementVNode("view", { class: "uni-input" }, [
                    vue.createElementVNode("text", null, vue.toDisplayString(_ctx.selectArr[_ctx.selectIndex]), 1)
                  ])
                ], 40, ["value", "range"]),
                vue.createElementVNode("image", {
                  src: "/static/cutWarehouse/selectDownArrow@2x.png",
                  mode: "aspectFit",
                  class: "selectDownArrow"
                })
              ])
            ]),
            vue.createElementVNode("view", null, "\u64CD\u4F5C\u4EBA\uFF1A" + vue.toDisplayString(_ctx.username), 1),
            vue.createElementVNode("view", null, "\u64CD\u4F5C\u65F6\u95F4\uFF1A" + vue.toDisplayString(_ctx.date), 1)
          ]),
          vue.createElementVNode("view", {
            class: "btnLocation",
            style: { "margin-left": "40rpx" }
          }, [
            vue.createElementVNode("view", {
              class: "cancelBtn",
              onClick: _cache[9] || (_cache[9] = (...args) => _ctx.handleCancel && _ctx.handleCancel(...args))
            }, "\u53D6\u6D88"),
            vue.createElementVNode("view", {
              class: "confirmBtn",
              onClick: _cache[10] || (_cache[10] = (...args) => _ctx.handleConfirm && _ctx.handleConfirm(...args))
            }, "\u786E\u5B9A")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_scanCode)
    ]);
  }
  var PagesCutWarehouseRepealCutInStorage = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-f7eaee28"]]);
  const _sfc_main$1 = vue.defineComponent({
    name: "cutOutStorage",
    onLoad() {
    },
    onShow() {
      uni.$off("scancodedate");
      uni.$on("scancodedate", (data) => {
        formatAppLog("log", "at pages/cutWarehouse/cutOutStorage.vue:92", data);
        if (this.sewingTaskRecord) {
          formatAppLog("log", "at pages/cutWarehouse/cutOutStorage.vue:94", "\u626B\u63CFPCS\u7801");
          this.handleScanPCS(data.code);
        } else {
          formatAppLog("log", "at pages/cutWarehouse/cutOutStorage.vue:98", "\u626B\u63CF\u7F1D\u5236\u4EFB\u52A1\u5355\u53F7");
          this.handleScanTask(data.code);
        }
      });
    },
    setup() {
      const state = vue.reactive({
        isSelectCheckbox: true,
        showModal: false,
        showSuccessPop: false,
        showErrorPop: false,
        showSuccessMessage: "",
        showErrorMessage: "",
        sewingTaskRecord: "",
        outStorageArr: [],
        alreadyOutStorageArr: [],
        startX: ""
      });
      const handleScanCodeBox = () => {
        uni.scanCode({
          onlyFromCamera: true,
          success: (res) => {
            formatAppLog("log", "at pages/cutWarehouse/cutOutStorage.vue:122", res.result);
            if (state.sewingTaskRecord) {
              formatAppLog("log", "at pages/cutWarehouse/cutOutStorage.vue:125", "\u626B\u63CF\u626B\u63CFPCS\u7801");
              handleScanPCS(res.result);
            } else {
              formatAppLog("log", "at pages/cutWarehouse/cutOutStorage.vue:129", "\u626B\u63CF\u626B\u63CF\u7F1D\u5236\u4EFB\u52A1\u5355\u53F7");
              handleScanTask(res.result);
            }
          },
          fail: (err) => {
          }
        });
      };
      const handleScanTask = (sewingExecutionNum) => {
        Api.getSewingExecution({
          sewingExecutionNum
        }).then((res) => {
          if (res.code === 0) {
            uni.showToast({
              title: "\u626B\u63CF\u7F1D\u5236\u4EFB\u52A1\u5355\u53F7\u6210\u529F\uFF01",
              icon: "none",
              duration: 3e3
            });
            state.sewingTaskRecord = res.data.sewingExecutionNum;
            state.outStorageArr = res.data.list.map((item, index) => {
              return {
                id: item.id || "",
                productId: item.productId || "",
                produceId: item.produceId || "",
                subpackageId: item.subpackageId || "",
                proNum: item.proNum || "",
                colorCode: item.colorCode || "",
                colorName: item.colorName || "",
                sizeCode: item.sizeCode || "",
                sizeName: item.sizeName || "",
                packageNum: item.packageNum || "",
                inputNumber: item.inputNumber || "",
                outputNumber: 0,
                storageStatus: 0,
                isShowScan: true,
                isSelectScan: false
              };
            });
          } else {
            state.showErrorMessage = res.msg;
            state.showErrorPop = true;
            let timer = setTimeout(() => {
              clearTimeout(timer);
              state.showErrorPop = false;
            }, 2e3);
          }
        });
      };
      const handleScanPCS = (pcsNum) => {
        Api.getPiecesByPCSNum({
          pcsNum,
          sewingExecutionNum: state.sewingTaskRecord
        }).then((res) => {
          if (res.code === 0) {
            uni.showToast({
              title: "\u626B\u63CFPCS\u7801\u6210\u529F\uFF01",
              icon: "none",
              duration: 3e3
            });
            state.alreadyOutStorageArr.push({
              id: res.data.id || "",
              productId: res.data.productId || "",
              produceId: res.data.produceId || "",
              subpackageId: res.data.subpackageId || "",
              proNum: res.data.proNum || "",
              colorCode: res.data.colorCode || "",
              colorName: res.data.colorName || "",
              sizeCode: res.data.sizeCode || "",
              sizeName: res.data.sizeName || "",
              packageNum: res.data.packageNum || "",
              inputNumber: res.data.inputNumber || "",
              arrowFlag: true
            });
            state.alreadyOutStorageArr = arrayToHeavy(state.alreadyOutStorageArr);
            if (state.isSelectCheckbox) {
              outStorageMethods(false);
            } else {
              outStorageMethods(true);
            }
          } else {
            state.showErrorMessage = res.msg;
            state.showErrorPop = true;
            let timer = setTimeout(() => {
              clearTimeout(timer);
              state.showErrorPop = false;
            }, 2e3);
          }
        });
      };
      const checkboxChange = (e) => {
        if (state.isSelectCheckbox) {
          state.isSelectCheckbox = false;
          outStorageMethods(true);
        } else {
          state.isSelectCheckbox = true;
          outStorageMethods(false);
        }
      };
      const handleMore = () => {
        state.showModal = true;
      };
      const handleOutStorage = () => {
        Api.outOfStock({
          list: state.outStorageArr
        }).then((res) => {
          if (res.code === 0) {
            state.outStorageArr = [];
            state.showSuccessMessage = "\u51FA\u5E93\u6210\u529F\uFF01";
            state.showSuccessPop = true;
            let timer = setTimeout(() => {
              clearTimeout(timer);
              state.showSuccessPop = false;
            }, 2e3);
          }
        });
      };
      const handleEmpty = () => {
        state.outStorageArr = [];
        state.showModal = false;
        state.sewingTaskRecord = "";
      };
      const outStorageMethods = (bool) => {
        for (let i = 0; i < state.outStorageArr.length; i++) {
          for (let j = 0; j < state.alreadyOutStorageArr.length; j++) {
            if (state.outStorageArr[i].id == state.alreadyOutStorageArr[j].id) {
              state.outStorageArr[i].isShowScan = bool;
              state.outStorageArr[i].isSelectScan = bool;
            }
          }
        }
      };
      return __spreadProps(__spreadValues({}, vue.toRefs(state)), {
        handleScanCodeBox,
        handleScanTask,
        handleScanPCS,
        checkboxChange,
        handleMore,
        handleOutStorage,
        handleEmpty,
        outStorageMethods
      });
    },
    components: {
      scanCode
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_scanCode = vue.resolveComponent("scanCode");
    return vue.openBlock(), vue.createElementBlock("view", { class: "mainContent" }, [
      vue.createCommentVNode(' <view class="commonBtn" @tap="handleScanTask" style="background-color: #fca147;">\u626B\u63CF\u7F1D\u5236\u4EFB\u52A1\u5355\u53F7</view> '),
      vue.createCommentVNode(' <view class="commonBtn" @tap="handleScanPCS" style="background-color: #4a70f5;">\u626B\u63CFPCS\u7801</view> '),
      vue.createElementVNode("view", { class: "location" }, [
        vue.createElementVNode("image", {
          class: "scanCodeBox",
          src: "/static/cutWarehouse/scanCodeBox.png",
          mode: "aspectFit",
          onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleScanCodeBox && _ctx.handleScanCodeBox(...args))
        }),
        vue.createElementVNode("input", {
          class: "uni-input scanInput",
          "placeholder-style": "font-size: 34rpx",
          "confirm-type": "search",
          placeholder: _ctx.sewingTaskRecord ? "\u8BF7\u626B\u63CFPCS\u7801" : "\u8BF7\u626B\u63CF\u7F1D\u5236\u4EFB\u52A1\u5355\u53F7"
        }, null, 8, ["placeholder"])
      ]),
      vue.createElementVNode("view", { class: "storageLocation" }, [
        vue.createElementVNode("text", { class: "storageTitle" }, "\u7F1D\u5236\u4EFB\u52A1\u5355\u53F7\uFF1A"),
        vue.withDirectives(vue.createElementVNode("input", {
          class: "uni-input storageInput",
          "placeholder-style": "font-size: 34rpx",
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.sewingTaskRecord = $event),
          "confirm-type": "search",
          placeholder: "\u8BF7\u8F93\u5165\u7F1D\u5236\u4EFB\u52A1\u5355\u53F7",
          disabled: ""
        }, null, 512), [
          [vue.vModelText, _ctx.sewingTaskRecord]
        ])
      ]),
      vue.createElementVNode("view", { class: "radioLocation" }, [
        vue.createElementVNode("checkbox-group", {
          onChange: _cache[2] || (_cache[2] = (...args) => _ctx.checkboxChange && _ctx.checkboxChange(...args))
        }, [
          vue.createElementVNode("view", { class: "checkboxStyle" }, [
            vue.createElementVNode("checkbox", {
              value: "",
              checked: !_ctx.isSelectCheckbox,
              style: { "transform": "scale(0.8)" }
            }, null, 8, ["checked"])
          ]),
          vue.createElementVNode("view", { class: "checkboxStyle" }, "\u5168\u90E8")
        ], 32)
      ]),
      vue.createElementVNode("view", { class: "pannelContent" }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.outStorageArr, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "storageItem",
            key: index
          }, [
            vue.withDirectives(vue.createElementVNode("view", {
              class: vue.normalizeClass([item.isSelectScan ? "selectLine" : "", "touch-list", "list-touch"]),
              style: vue.normalizeStyle(item.txtStyle)
            }, [
              vue.createElementVNode("text", { class: "serialNumber" }, vue.toDisplayString(index + 1) + ".", 1),
              vue.createElementVNode("view", null, [
                vue.createElementVNode("view", { class: "storageCode" }, vue.toDisplayString(item.proNum), 1),
                vue.createElementVNode("view", null, [
                  vue.createElementVNode("text", null, "\u989C\u8272\u5C3A\u7801\uFF1A"),
                  vue.createElementVNode("text", {
                    decode: "true",
                    space: "true"
                  }, vue.toDisplayString(item.colorCode) + "\u2003" + vue.toDisplayString(item.colorName) + "\u2003" + vue.toDisplayString(item.sizeName), 1)
                ]),
                vue.createElementVNode("view", { class: "storageContent" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode("text", null, "\u624E\u53F7\uFF1A"),
                    vue.createElementVNode("text", null, vue.toDisplayString(item.packageNum), 1)
                  ]),
                  vue.createElementVNode("view", { class: "storageNum" }, [
                    vue.createElementVNode("text", null, "\u6570\u91CF\uFF1A"),
                    vue.createElementVNode("text", null, vue.toDisplayString(item.inputNumber), 1)
                  ])
                ])
              ])
            ], 6), [
              [vue.vShow, item.isShowScan]
            ])
          ]);
        }), 128))
      ]),
      vue.createElementVNode("view", { class: "bottomLocation" }, [
        vue.createElementVNode("view", { class: "scanNum" }, "\u603B\u884C\u6570/\u5DF2\u626B\u63CF\u884C\u6570\uFF1A" + vue.toDisplayString(_ctx.outStorageArr.length) + "/" + vue.toDisplayString(_ctx.alreadyOutStorageArr.length), 1),
        vue.createElementVNode("view", { class: "btnLocation" }, [
          vue.createElementVNode("view", {
            class: "commonBtn moreBtn",
            onClick: _cache[3] || (_cache[3] = (...args) => _ctx.handleMore && _ctx.handleMore(...args))
          }, "\u66F4\u591A"),
          _ctx.outStorageArr.length > 0 && _ctx.outStorageArr.length == _ctx.alreadyOutStorageArr.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "commonBtn inStorageBtn",
            onClick: _cache[4] || (_cache[4] = (...args) => _ctx.handleOutStorage && _ctx.handleOutStorage(...args))
          }, "\u51FA\u5E93")) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "commonBtn noInStorageBtn"
          }, "\u51FA\u5E93"))
        ])
      ]),
      vue.withDirectives(vue.createElementVNode("view", { class: "btnModal" }, [
        vue.createElementVNode("image", {
          class: "modalImage",
          src: "/static/cutWarehouse/modalImage.png",
          mode: "aspectFit"
        }),
        vue.createElementVNode("view", {
          class: "commonBtn emptyBtn",
          onClick: _cache[5] || (_cache[5] = (...args) => _ctx.handleEmpty && _ctx.handleEmpty(...args))
        }, "\u6E05\u7A7A")
      ], 512), [
        [vue.vShow, _ctx.showModal]
      ]),
      _ctx.showSuccessPop ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "successPopup remindPopup"
      }, [
        vue.createElementVNode("view", { class: "successImage" }),
        vue.createElementVNode("view", { style: { "margin-left": "20rpx" } }, vue.toDisplayString(_ctx.showSuccessMessage), 1)
      ])) : vue.createCommentVNode("v-if", true),
      _ctx.showErrorPop ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "errorPopup remindPopup"
      }, [
        vue.createElementVNode("view", { class: "errorImage" }),
        vue.createElementVNode("view", { style: { "margin-left": "20rpx" } }, vue.toDisplayString(_ctx.showErrorMessage), 1)
      ])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_scanCode)
    ]);
  }
  var PagesCutWarehouseCutOutStorage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-2e3d52fa"]]);
  if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
    Promise.prototype.finally = function(callback) {
      const promise = this.constructor;
      return this.then((value) => promise.resolve(callback()).then(() => value), (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      }));
    };
  }
  if (uni.restoreGlobal) {
    uni.restoreGlobal(vue__namespace, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
  }
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/cutWarehouse/cutWarehouse", PagesCutWarehouseCutWarehouse);
  __definePage("pages/cutWarehouse/cutInStorage", PagesCutWarehouseCutInStorage);
  __definePage("pages/cutWarehouse/repealCutInStorage", PagesCutWarehouseRepealCutInStorage);
  __definePage("pages/cutWarehouse/cutOutStorage", PagesCutWarehouseCutOutStorage);
  const _sfc_main = {
    onLaunch: function() {
    },
    onShow: function() {
    },
    onHide: function() {
    }
  };
  function createApp() {
    const app = vue.createVueApp(_sfc_main);
    return {
      app
    };
  }
  const __app__ = createApp().app;
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.use(uni.__vuePlugin).mount("#app");
})(Vue);
