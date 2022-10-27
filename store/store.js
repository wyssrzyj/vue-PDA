import Vue from 'vue'
import Vuex from 'vuex'
import Api from '../service/api.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	is_b_link:"",
	permissions: [],
	func:[],
	dicts:[]
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
	  }
	},
	actions: {
		updateState(ctx, { payload }) {
		  ctx.commit('updateState', payload)
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
			  dicts: dicts.data || [],
			})
		  })
		}
	}
})