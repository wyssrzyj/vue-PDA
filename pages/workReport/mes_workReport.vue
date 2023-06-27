<template>
	<view class="mainContent" @click="handleClcik">
		<view class="borderBottom">
			<view class="scanInput">请扫描包条码!</view>
			<view class="storage">
				<view class="storage-item">
					<view class="test-left">
						<text class="requier">*</text>当前员工
					</view>

					<view class="storage-item-right" @click="selectUser">
						<text class="info">{{ realName || "未绑定" }}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<view class="storage-item">
					<view class="storage-item-left">
						<view class="test-left">
							<text class="requier">*</text>报工工段
						</view>
						<view class="empty" @click="sectionSelectClick({ name: null })">
							清空工段
						</view>
					</view>
					<view class="storage-item-right" @click="clickSection">
						<text class="info">{{ section || "请选择报工工段" }}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<view class="storage-item">
					<view class="storage-item-left ">
						<view class="test-left">
							<text class="requier">*</text>报工工序
						</view>
						<view class="empty" @click="getCodeMu([])">
							清空工序
						</view>
					</view>
					<view class="storage-item-right" @click="showMultiple">
						<text class="info">请选择报工工序</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<ul>
					<li v-for="item in checkedList" :key="item.name" style="font-size: 30rpx">
						{{ item.value }}
					</li>
				</ul>
				<view class="storage-item">
					<view class="storage-item-left">
						<view class="test-left">
							<text class="requier">*</text>自动报工
						</view>
						<view class="empty" @click="inputDialogToggle">
							自动时间
						</view>
					</view>
					<view class="storage-item-right" style="display: flex; align-items: center">
						<!-- <icon type="info" size="26" @click="inputDialogToggle"/> -->
						<evan-switch id="evanSwitch" v-model="isAutoReporting" :active-value="true"
							:inactive-value="false" inactive-color="#C5C5C5" :size="30" @change="handleAutoChange" />
					</view>
				</view>
			</view>
		</view>
		<view class="pannelContent">
			<view class="storageItem" v-for="(item, index) in outStorageArr" :key="index"
				:class="index == 0 ? 'selectStorage' : ''">
				<text class="serialNumber">{{ index + 1 }}.</text>
				<view class="storageInfo">
					<text class="storageCode">{{ item.productOrderNum }}</text>
					<view class="storageColor">
						<text>
							<text style="font-weight: bold">颜色尺码：</text>
							{{ item.colorCode }}&emsp;{{ item.colorName }}&emsp;{{
								item.sizeCode
							}}
						</text>
					
					</view>
					<view class="storageContent">
						<view class="count">
							<text>床号：</text>
							<text>{{ item.bedNum }}</text>
						</view>
					</view>
					<view class="storageContent">
						<view class="count">
							<text>包号：</text>
							<text>{{ item.packageNum }}</text>
						</view>
					</view>
					<view class="storageContent">
						<view class="count">
							<text>数量：</text>
							<input v-model="item.count" type="number" @input="handleInput($event, item)" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 更多组件 -->
		<u-action-sheet :actions="list" :show="showMore" @select="selectClick" :closeOnClickOverlay="true"
			:closeOnClickAction="true" @close="showMore = false" />
		<view class="bottomTab">
			<view class="bottom-left" @click="showMore = true" id="moreBtn">
				更多 <view class="iconfont icon-gengduo"></view>
			</view>
			<view class="bottom-right">
				<view class="count">
					已扫描包数：{{ outStorageArr.length ? outStorageArr.length : "0" }}
				</view>
				<view v-if="outStorageArr.length > 0" id="outButton" class="btn btnActive" :loading="loading"
					:disabled="loading" @click="handleOutStorage">
					报工{{ seconds !== 0 ? `(${seconds})` : "" }}
				</view>
				<view class="btn btnDisable" v-else>报工</view>
			</view>
		</view>
		<!-- 选择工序弹窗 -->
		<select-code-multiple :visible="showM" :checkedValue="checkedList" :optionList="coutryList" @confirm="getCodeMu"
			@cancel="showM = false" />
		<!-- 选择工段弹窗 -->
		<u-action-sheet :actions="sectionList" :show="showSection" @select="sectionSelectClick"
			:closeOnClickOverlay="true" :closeOnClickAction="true" @close="showSection = false" />
		<scan-code />
		<!-- 选择用户 -->
		<searchSelect ref="jpicker" :options="userList" valKey="id" :showKey="'showKey'" @sure="selectSure" />
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="请输入自动报工的时间" @confirm="handleAutoComfirm"
				@close="handleAutoClose">
				<div style="
						display: flex;
						align-items: center;
						justify-content: space-between;
						width: 70%;
					">
					<uni-number-box :min="1" :max="60" :value="beforSetSeconds" @change="handleBeforeChange" />
					<uni-tag text="s" />
				</div>
			</uni-popup-dialog>
		</uni-popup>
		<workReportDialog :show="showDialog" :infoList="dialogInfoList" @close="showDialog = false"
			@delPackage="delPackage" @clearPackage="selectClick({ name: '清空' })" />
	</view>
</template>

<script>
	import {
		formateDate,
		findKey,
		useDebounce,
		checkFunc
	} from "@/utils/index.js";
	import Api from "../../service/api";
	
	import scanCode from "@/components/scan/scan.vue";
	import evanSwitch from "@/components/evan-switch/evan-switch.vue";
	import selectCodeMultiple from "@/components/mulSelection/mulSelection.vue";
	import searchSelect from "../../components/J-Picker/jPicker.vue";
	import workReportDialog from "./workReport-dialog.vue";
	import {
		KEY_MAP
	} from "../../constant/index.js";
	let message = (msg, time = 3000) =>
		uni.showToast({
			icon: "none",
			duration: time,
			title: msg
		});
	const longyoungKeyEventListen = uni.requireNativePlugin(
		"longyoung-KeyEventListen"
	);
	var timer;
	var preKeyCode = "";
	var allKeyCodeTemp = "";
	export default {
		components: {
			selectCodeMultiple,
			scanCode,
			evanSwitch,
			searchSelect,
			workReportDialog,
		},
		data() {
			return {
				type: null, //0个人报工，1组长报工
				produceId: "", //生产单id
				workType: "",
				productNum: "",
				outStorageArr: [],
				columns: [],
				userId: null, //用户id
				realName: "", //前端用户名称
				userList: [], //用户列表
				showM: false,
				checkedList: [], //选中的工序列表
				coutryList: [], //可选工序列表
				showSection: false,
				section: "", //工段
				sectionList: [], //工段列表
				sectionAndCoutry: {}, //工段工序组合数据
				reportNum: null, //今日报工数量
				workshopObj: {},
				// 更多组件
				showMore: false,
				list: [{
					name: "清空",
					color: "#FC361D"
				}],
				tag: "1", //不必理会，固定 1 就好,
				isAutoReporting: false, //是否自动报工
				seconds: 0, //倒计时时间
				setSeconds: 5, //倒计时时间
				beforSetSeconds: 5, //弹出框倒计时时间
				isAutoReportTimer: null,
				dataList: {
					allEmployeeList: [], //所有员工列表
					THEmployeeList: [], //包装员工列表
				},
				showDialog: false, //控制弹窗显示
				dialogInfoList: [], //弹窗内容
				loading: false,
			};
		},
		onLoad(option) {
			this.type = option.type;
			// this.setOnKeyEventListener();
			// 个人报工默认填上当前员工
			if (this.type == "0") {
				this.userId = this.$store.state.user.id;
				this.realName = this.$store.state.user.staffName;
			} else {
				let userInfo = uni.getStorageSync("reportUserInfo") || {};
				this.userId = userInfo.userId;
				this.realName = userInfo.realName;
			}
			
		},
		onUnload() {
			this.disableAllOnKeyEventListener(); //取消所有监听
		},
		
		onShow() {
			uni.$off("scancodedate"); // 每次进来先 移除全局自定义事件监听器

			uni.$on("scancodedate", (data) => {
				// 扫描PCS码
				this.handleScanPCS(decodeURI(data.code));
			
			});

			//自动报工
			if (this.type == "0") {
				this.isAutoReporting = uni.getStorageSync("personal_isAutoReporting");
				this.setSeconds = uni.getStorageSync("personal_setSeconds") || 5;
				this.beforSetSeconds = uni.getStorageSync("personal_setSeconds") || 5;
			} else {
				this.isAutoReporting = uni.getStorageSync("group_isAutoReporting");
				this.setSeconds = uni.getStorageSync("group_setSeconds") || 5;
				this.beforSetSeconds = uni.getStorageSync("group_setSeconds") || 5;
			}
		},
		mounted() {
			// 获取员工列表
			const {
				systemId,
				tenantCode,
				workType
			} = this.$store.state.user;

			this.workType = workType;
			//按包报工关联工种
			Api.getAlluser("/njp-plus-mes-api/mes/mesemployee/packagingList", {
				systemId,
				tenantCode,
				orgType: "shop",
			}).then((ret1) => {
				if (ret1.code == "0") {
					
					this.dataList.THEmployeeList = ret1.data.map((item) => ({
						id: item.id,
						showKey: `${item.realName}-${item.staffId}`,
					}));
				}
			});
			
			Api.getAlluser("/njp-plus-mes-api/mes/mesemployee/list", {
				systemId,
				tenantCode,
				orgType: "shop",
			}).then((ret4) => {
				if (ret4.code == "0") {
					
					this.dataList.allEmployeeList = ret4.data.map((item) => ({
						id: item.id,
						showKey: `${item.realName}-${item.staffId}`,
					}));
				}
			});
			// 工段多选测试生产单
			// this.handleScanPCS("1665634578039119876");
		},
		methods: {
			setOnKeyEventListener() {
				let that = this;
				// longyoungKeyEventListen = uni.requireNativePlugin('longyoung-KeyEventListen');//引用插件
				//设置监听，可设置多个，回调按 tag 区分哪个监听返回。
				longyoungKeyEventListen.setOnKeyEventListenerLy({
						tag: that.tag, //不必理会，固定 1 就好
					},
					(result) => {
						if (!result.keyCode) {
							that.resultStr += "\n" + JSON.stringify(result) + "\n";
						}
						if (result && result.return_code == "SUCCESS") {
							if (result.return_type == "dataBack") {
								//return_type=dataBack是返回数据标识，返回的数据在此获取

								//页面只显示1和a，供查看数据结构
								if (
									result.keyCode == "KEYCODE_1" ||
									result.keyCode == "KEYCODE_A"
								) {
									that.resultStr += "\n" + JSON.stringify(result) + "\n";
								}
								that.handleData(result);
							}
						}
					}
				);
			},
			handleData(result) {
				let that = this;
				if (result.return_type == "dataBack") {
					if (result.action == "ACTION_UP") {
						//只取弹起事件
						let keyCode = result.keyCode;
						if (keyCode == "KEYCODE_ENTER") {
							//扫码结束
							that.resultStrFinal = allKeyCodeTemp; //最终拼接的字符串赋值
							allKeyCodeTemp = "";
							preKeyCode = "";
							this.handleScanPCS(decodeURI(that.resultStrFinal));
						} else if (
							keyCode == "KEYCODE_SHIFT_LEFT" ||
							keyCode == "KEYCODE_SHIFT_RIGHT"
						) {
							//转换键
							preKeyCode = "KEYCODE_SHIFT_RIGHT";
						} else {
							if (preKeyCode == "KEYCODE_SHIFT_RIGHT") {
								//转换键，拿大写
								if (keyCode && KEY_MAP[keyCode]) {
									allKeyCodeTemp += KEY_MAP[keyCode].shiftChar;
								}
							} else {
								if (keyCode && KEY_MAP[keyCode]) {
									allKeyCodeTemp += KEY_MAP[keyCode].normalChar;
								}
							}
							preKeyCode = "";
						}
					}
				}
			},
			disableAllOnKeyEventListener() {
				let that = this;
				//取消所有监听
				longyoungKeyEventListen.disableAllOnKeyEventListenerLy({}, (result) => {
					that.resultStr += "\n" + JSON.stringify(result) + "\n";
					if (result && result.return_code == "SUCCESS") {
						console.log("取消所有监听成功");
					}
				});
			},
			//打开多选
			showMultiple() {
				if (this.coutryList.length === 0) return message("暂无工序可供选择！");
				this.showM = true;
			},
			//获取多选的值
			getCodeMu(event) {
				this.checkedList = [];
				if (event.length > 0) this.checkedList = event;
				this.showM = false;
			},
			// 弹出工段选择
			clickSection() {
				if (Object.keys(this.sectionAndCoutry).length === 0) {
					message("暂无工段可供选择！");
				} else {
					this.showSection = true;
				}
			},
			//选择不同的工段
			sectionSelectClick(e) {
				this.section = e.name;
				this.checkedList = [];
				this.coutryList = [];
				if (!e.name) return;
				this.sectionAndCoutry[e.name].forEach((item) => {
					this.coutryList.push({
						name: item.idx ?
							`${item.idx} - ${item.productName}` :
							`${item.productName}`,
						value: item.productName,
						valid: 1,
						...item,
					});
				});
			},
			// 选择用户弹窗
			selectUser() {
				if (this.userList.length === 0) {
					message("暂无员工可供选择!");
					// this.$refs.jpicker.showPicker();
				} else {
					this.$refs.jpicker.showPicker();
				}
			},
			// 选择了员工
			async selectSure(val) {
				//员工姓名
				this.realName = val.showKey.split("-")[0];
				this.staffId = val.showKey.split("-")[1];
				this.userId = val.id;
				// if (this.type == "1")
				this.getCache(this.userId);
				const data = {
					userId: val.id,
					id: this.produceId,
				};
				const res = await Api.getProcessByUser(data);
				if (res.code !== 0) {
					message(res.msg);
					return;
				}
				
				this.sectionList = Object.keys(res.data).map((v) => {
					return {
						name: v,
					};
				});
				this.section = this.sectionList[0]?.name;

				this.sectionSelectClick(this.sectionList[0]);
			},
			//取消修改报工数据
			handleAutoClose() {
				this.beforSetSeconds = this.setSeconds;
			},
			//确认修改报工数据
			handleAutoComfirm() {
				this.setSeconds = this.beforSetSeconds;
				if (this.type == "0") {
					uni.setStorageSync("personal_setSeconds", this.setSeconds);
				} else {
					uni.setStorageSync("group_setSeconds", this.setSeconds);
				}
			},
			handleBeforeChange(value) {
				this.beforSetSeconds = value;
			},
			//弹出修改日期的时间
			inputDialogToggle() {
				this.$refs.inputDialog.open();
			},
			//点击页面取消报工
			handleClcik(e) {
				if (
					e.target.id != "evanSwitch" &&
					e.target.id != "outButton" &&
					this.seconds > 0
				) {
					this.seconds = 0;
					clearInterval(this.isAutoReportTimer);
					this.isAutoReportTimer = null;
				}
			},
			//取消自动报工
			handleAutoChange(e) {
				if (this.type == "0") {
					uni.setStorageSync("personal_isAutoReporting", e);
				} else {
					uni.setStorageSync("group_isAutoReporting", e);
				}
				if (!e) {
					this.seconds = 0;
					clearInterval(this.isAutoReportTimer);
					this.isAutoReportTimer = null;
				}
			},
			//修改数量
			handleInput(e, item) {
				if (Number(e.target.value) <= Number(item.limitCount) && e.target.value) {
					e.target.value = e.target.value
						.split(".")[0]
						.replace(/^[^\d]|[.]/g, "");
					this.$nextTick(() => {
						item.count = Number(e.target.value);
					});
				} else if (!e.target.value) {
					this.$nextTick(() => {
						item.count = "";
					});
				} else {
					this.$nextTick(() => {
						item.count = Number(item.limitCount);
					});
					if (item.pcsType) {
						message("数量不能大于上一个报工的件数");
					} else {
						message("报工数量不能大于件数");
					}
				}
			},
			// 获取组码报工今日数量
			async getReportNumFunc() {
				let res = await Api.getReportNum();
				if (res.code === 0) {
					this.reportNum = res.data;
				}
			},
			// 通过员工id和生产单id获取缓存工段工序
			getCache(userId, autoReporting = false) {
				Api.getStaffInfoCache({
					userId,
					produceId: this.produceId || 1
				}).then(
					(res) => {
						if (res.code !== 0) {
							return message(res.msg);
						}
						this.userId = res.data.mesEmployeeDTO.id;
						this.realName = res.data.mesEmployeeDTO.realName;
						// 判断是否有工段工序缓存
						let oldSection = res.data.section; //工段
						let oldCheckedList = res.data.checkedList; //工序
						if (oldCheckedList.length) {
							//判断工段是否删除
							let sectionList = this.sectionList.map((item) => item.name);
							if (sectionList.includes(oldSection)) {
								this.sectionSelectClick({
									name: oldSection
								}); //设置工序列表
								// 判断工序是否删除,只把没被删除的工序缓存取出来
								let coutryList = this.coutryList.map((item) => item.name);
								oldCheckedList.forEach((item) => {
									if (coutryList.includes(item.name)) this.checkedList.push(item);
								});

							}
						}

						// 自动报工
						if (!autoReporting) return;
						if (
							this.isAutoReporting &&
							this.userId &&
							this.section &&
							this.checkedList.length > 0 &&
							this.outStorageArr.length > 0
						) {
							this.seconds = this.setSeconds;
							this.isAutoReportTimer = setInterval(() => {
								this.seconds--;
								if (this.seconds === 0) {
									this.handleOutStorage();
									clearInterval(this.isAutoReportTimer);
									this.isAutoReportTimer = null;
								}
							}, 1000);
						}
					}
				);
			},
			// 报工分为组码报工和pcs码报工，新增组码报工，不能不同的报工类型，不同的生产单，员工码
			handleScanPCS(pcs) {
				// 扫描PCS码
				// 判断是员工码还是报工码
				let str = pcs.substring(0, 2);
				if (str === "01") {
					//员工码
					if (this.type == "0") return message("扫描的条码无效！");
					// if(this.outStorageArr.length === 0) return message('请先扫描包条码！')
					this.getCache(pcs.slice(2), true);
				} else {
					Api.productionReportingPCS({
						pcs, // '1595303609325703169'
					}).then((res) => {
						if (res.code === 0) {
							// 第一次扫码
							if (this.outStorageArr.length === 0) {
								this.produceId = res.data.produceOrderId;
								this.scanPCSEncapsulation(res);
							} else {
								// 不是第一次扫码，判断是否扫的都是同一个生产单下的扎包码,并且清除定时器
								if (this.produceId === res.data.produceOrderId) {
									if (this.isAutoReportTimer) {
										//清除定时器
										this.seconds = 0;
										clearInterval(this.isAutoReportTimer);
										this.isAutoReportTimer = null;
									}
									// 判断是否扫描了相同的码
									let s = this.outStorageArr.find(
										(item) => item.packageCode === res.data.packageCode
									);
									if (s) return message("请勿重复扫描相同条码！");
									this.scanPCSEncapsulation(res);
								} else {
									message("请提交后再扫描其他生产单下条码!");
								}
							}
						} else {
							message(res.msg);
						}
					});
				}
			},
			//封装函数
			scanPCSEncapsulation(res) {
				message("扫描包条码成功！");
				this.outStorageArr.unshift(res.data);

				// 扎包报工工序
				if (res.data.pcsType == 0) {
					this.sectionAndCoutry = res.data.sectionsAndProcess || {};
					this.sectionList =
						res.data.sectionsAndProcess &&
						Object.keys(res.data.sectionsAndProcess).map((item) => {
							return {
								name: item
							};
						});
					//工种为包装为包装员工
					if (this.workType == 3) {
						this.userList = this.dataList.THEmployeeList;
					} else {
						this.$nextTick(() => {
							this.userList = this.dataList.allEmployeeList;
						})
					}
					
					// 组码报工工序
				} else {
					this.section = "尾部";
					this.coutryList = res.data.processName.map((i) => {
						return {
							...i,
							value: i.productName,
							name: i.productName
						};
					});
					this.userList = this.dataList.allEmployeeList;
				}
				/**
				 * 如果是个人报工
				 * 判断是否时第一次扫码，第一次扫码才读取缓存
				 * 根据不同条码获取不同缓存
				 * 工段，工序
				 * 如果被删除了缓存需要清除
				 */

				
				if (this.type == "0" && this.outStorageArr.length === 1) {
					let stateStorage = uni.getStorageSync("productionReport") || {};
					//判断工段是否删除
					let sectionList = this.sectionList.map((item) => item.name);
					if (sectionList.includes(stateStorage.section)) {
						this.sectionSelectClick({
							name: stateStorage.section
						}); //设置工序列表
						// 判断工序是否删除,只把没被删除的工序缓存取出来
						let coutryList = this.coutryList.map((item) => item.name);
						stateStorage.checkedList.forEach((item) => {
							if (coutryList.includes(item.name)) this.checkedList.push(item);
						});
					}
				}
				// 如果是组长报工，工段工序为空时，请求工段工序缓存 //有问题
				if (
					this.type == "1" &&
					!this.section &&
					this.checkedList.length === 0 &&
					this.userId
				)
					this.getCache(this.userId);
				//只要点击自动报工就报工
				if (
					this.isAutoReporting &&
					this.userId &&
					this.section &&//工段
					this.checkedList.length > 0&& //选中的工序列表
					this.outStorageArr.length === 1
				) {
					this.seconds = this.setSeconds;
					this.isAutoReportTimer = setInterval(() => {
						this.seconds--;
						if (this.seconds === 0) {
							this.handleOutStorage();
							clearInterval(this.isAutoReportTimer);
							this.isAutoReportTimer = null;
						}
					}, 1000);
				}
			},
			//弹出按钮点击事件
			selectClick(e) {
				if (e.name == "清空") {
					this.outStorageArr = [];
					this.coutryList = [];
					this.productNum = "";
					this.checkedList = [];
					this.section = "";
					this.sectionAndCoutry = {};
					this.sectionList = [];
					this.columns = [];
					this.realName = "";
					this.userId = null;
					this.produceId = "";

					// 个人报工默认填上当前员工
					if (this.type == "0") {
						this.userId = this.$store.state.user.id;
						this.realName = this.$store.state.user.staffName;
					} else {
						let userInfo = uni.getStorageSync("reportUserInfo") || {};
						this.userId = userInfo.userId;
						this.realName = userInfo.realName;
					}
				}
			},

			handleOutStorage() {
				// 报工
				if (!this.section) return message("请选择报工工段");

				if (this.checkedList.length === 0) return message("请选择报工工序");

				const find = this.outStorageArr.find((item) => !item.count);
				if (find) return message("报工数量不能为0");

				if (!this.userId) return message("当前员工不能为空");

				this.loading = true;

				let mesEngineeringManagementDTOS = this.outStorageArr.map((item) => {
					return {
						...item,
						section: this.section,
						processVoList: this.checkedList,
						engineeringManagementDate: null,
						userId: this.userId,
					};
				});
				Api.productionReporting({
					mesEngineeringManagementDTOS,
				}).then((res) => {
					if (res.code === 0) {
						// 个人报工时才记录缓存
						if (this.type == "0") {
							// // 删除缓存
							uni.removeStorageSync("productionReport");
							//设置缓存
							uni.setStorageSync("productionReport", {
								section: this.section, //工段
								checkedList: this.checkedList, //工序列表
							});

							// 自动报工信息缓存分开
							this.isAutoReporting = uni.getStorageSync(
								"personal_isAutoReporting"
							);
							this.setSeconds = uni.getStorageSync("personal_setSeconds") || 5;
						} else {
							// 缓存员工信息
							uni.setStorageSync("reportUserInfo", {
								userId: this.userId, //员工信息
								realName: this.realName, //员工名称
							});

							this.isAutoReporting = uni.getStorageSync("group_isAutoReporting");
							this.setSeconds = uni.getStorageSync("group_setSeconds") || 5;
						}

						this.selectClick({
							name: "清空"
						});
						clearInterval(this.isAutoReportTimer);
						this.isAutoReportTimer = null;
						this.loading = false;
						message("报工成功！");
					} else if (res.code === 2) {
						// 报工失败，展示报工问题弹窗
						this.showDialog = false;
						this.dialogInfoList = res.data || [];
						if (this.dialogInfoList.length > 0) this.showDialog = true;
						this.loading = false;
					} else {
						this.loading = false;
						message(res.msg);
					}
				});
			},
			// 删除重复扎包
			delPackage() {
				if (this.dialogInfoList.length === this.outStorageArr.length) {
					//全部都有问题时清空全部
					this.selectClick({
						name: "清空"
					});
					return;
				}

				let arr = this.dialogInfoList.map((item) => item.pcs);
				this.outStorageArr = this.outStorageArr.filter(
					(item) => !arr.includes(item.pcs)
				);
			},
		},
		created() {
			//防抖
			this.handleOutStorage = useDebounce(this.handleOutStorage);
		},
	};
</script>

<style lang="scss" scoped>
	::v-deep .uni-actionsheet__menu {
		background-color: #fc361d !important;
		color: #007aff;
	}

	.requier {
		color: red;
		margin-right: 10rpx;
	}

	.iconfont {
		font-size: 12rpx;
	}

	::v-deep .u-toolbar[data-v-6d25fc6f] {
		border-bottom: 1px solid #eaeaea !important;
	}

	.test-left {
		width: 200rpx;
		height: 100rpx;
		color: #000;
		font-weight: bold;
	}

	.storage-item-left {
		width: 380rpx;
		display: flex;
		// align-items: center
	}

	.empty {
		width: 190rpx;
		padding: 10rpx;
		height: 80rpx;
		border: 1px solid #ccc;
		text-align: center;
		line-height: 60rpx;
		border-radius: 10rpx;
		margin-top: 12rpx;
	}

	.mainContent {
		position: relative;
		background-color: #f3f3f3;

		.borderBottom {
			padding-bottom: 10rpx;
		}

		#evanSwitch {
			margin-left: 50rpx;
		}

		//查询按钮样式
		.queryBtn {
			background-color: $theme-color;
			width: 130rpx;
			border-radius: 8rpx;
			margin: 0 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60rpx;
			color: white;
			font-weight: 600;
			cursor: pointer;
		}

		.radioLocation {
			text-align: right;
			margin-right: 20rpx;

			.checkboxStyle {
				display: inline-block;
			}
		}

		.pannelContent {
			height: calc(100vh - 474rpx);
			margin-bottom: 160rpx;
			overflow: auto;
			width: 100%;

			.first_item {
				color: #0c99f2;
			}

			.storageItem {
				width: 100%;
				display: flex;
				margin: 10rpx 0;
				padding: 20rpx 30rpx;
				background-color: #ffffff;

				.serialNumber {
					width: 60rpx;
					font-size: 36rpx;
					font-weight: bold;
					color: #333333;
					margin: auto;
					padding-right: 30rpx;
				}

				.storageInfo {
					font-size: 34rpx;
					color: #333333;

					.storageCode {
						line-height: 80rpx;
						font-weight: bold;
					}

					.storageColor {
						width: 750rpx;
						overflow: hidden;
						margin-bottom: 10rpx;
					}

					.storageContent {
						display: flex;
						justify-content: space-between;

						.number {
							text:first-child {
								font-weight: bold;
							}

							text:last-child {
								color: #666666;
							}
						}

						.count {
							display: flex;

							text:first-child {
								font-weight: bold;
								width: 120rpx;
							}

							input {
								width: 140rpx;
								height: 52rpx;
								border: 1px solid #0c99f2;
								border-radius: 4rpx;
								text-align: center;
							}
						}
					}
				}
			}

			//index为1的时候
			.selectStorage {
				background: #e4f4ff !important;
			}

			.selectStorage text {
				color: #0c99f2 !important;
			}

			.selectStorage input {
				color: #0c99f2 !important;
			}
		}
	}

	.info {
		width: 180rpx !important;
	}
</style>
