//vuex 状态管理
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	//数据源
	state: {
		userinfo: uni.getStorageSync('USERINFO') || {},
		historyLists: uni.getStorageSync('__history') || []
	},
	//修改state的值
	mutations: {
		SET_USER_INFO(state, userinfo) {
			state.userinfo = userinfo
		},
		SET_HISTORY_LISTS(state, history) {
			state.historyLists = history
		},
		CLEAR_HISTORY(state) {
			state.historyLists = []
		}
	},
	//修改mutations里面的方法，一般在此对象中修改
	actions: {
		set_userinfo({
			commit
		}, userinfo) {
			uni.setStorageSync('USERINFO', userinfo)
			commit('SET_USER_INFO', userinfo)
		},
		//修改方法，state的值  客户端传入的数据
		set_history({
			commit,
			state
		}, history) {
			let list = state.historyLists
			list.unshift(history)
			uni.setStorageSync('__history', list)
			commit('SET_HISTORY_LISTS', list)
		},
		clearHistory({
			commit
		}) {
			uni.setStorageSync('__history', [])
			uni.removeStorageSync('__history')
			commit('CLEAR_HISTORY', [])
		}
	}
})
export default store
