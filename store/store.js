import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	is_b_link:"",
	permissions: [],
},
  mutations: {
	set_is_b_link(state,val){
		state.is_b_link=val
	},
	setPermissions (state,val) {
		state.permissions = val
	}
},
})