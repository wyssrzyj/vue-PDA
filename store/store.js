import Vue from 'vue'
import Vuex from 'vuex'
import Api from '../service/api.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	is_b_link:"",
	permissions: [],
	func:[],
	dicts:[],
	user: {
	  createDate: '',
	  deptId: '',
	  deptName: '',
	  email: '',
	  gender: 0,
	  headUrl: '',
	  id: '',
	  mobile: '',
	  postIdList: '',
	  realName: '',
	  roleIdList: '',
	  status: 0,
	  superAdmin: 0,
	  username: '',
	  staffId:"",
	  staffName:"",
	  systemId:"", //平台id
	  tenantCode:"", // 编码
	  workType:"" //工种信息
	} //用户信息
	},
  mutations: {
		set_is_b_link(state,val){
			state.is_b_link=val
		},
		setPermissions (state,val) {
			state.permissions = val
		},
		updateState(state, payload) {
		Object.keys(payload).forEach((x) => {
			state[x] = payload[x]
			})
		},
		setStaff(state,val) {
			state.user.staffId = val.staffId
			state.user.staffName = val.realName
			state.user.systemId=val.systemId
			state.user.tenantCode=val.tenantCode
			state.user.workType=val.workType
			state.user.id=val.id
		},
	},
	actions: {
		updateState(ctx, { payload }) {
		  ctx.commit('updateState', payload)
		},
		async updateStaff(ctx){
			const res=await Api.getUserInfo()
			ctx.commit('setStaff',res.data)
		},
		initApp(ctx) {
		  return Promise.all([
			Api.getFunc(),		//加载功能配置
			Api.getDicts()
		  ]).then(([func,dicts]) => {
			func = func.data?.map((item) => {
			  return item.authorizationInfo
			})
			ctx.commit('updateState', {
			  func: func || [],
			  dicts: dicts.data || []
			})
		  })
		}
	}
})
