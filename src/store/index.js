import { createStore } from 'vuex'
// import Heroes from '@/json/heroes.json'

export default createStore({
	state: {
		/*
			use api https://docs.opendota.com/
		*/
		API_KEY: 'AC6A8489E932260F8FB91DE90CFCB074',
		accountID: '93619931', // rastafaya77
		errors: [
			// {type: 'danger', message: 'blablablabalbalbalblab'},
			// {type: 'success', message: 'blablablabalbalbalblab'},
			// {type: 'primary', message: 'blablablabalbalbalblab'},
			// {type: 'light', message: 'blablablabalbalbalblab'},
		],
		matchesHistory: [],
		match: null,
		profile: null,
		heroes: null,
		heroesURL: 'https://steamcdn-a.akamaihd.net',
	},
	getters: {
		heroes(state) {
			return state.heroes
		},
		getErrors(state) {
			return state.errors
		},
		getMatchesHistory(state) {
			return state.matchesHistory
		},
		getAccountId(state) {
			return state.accountID
		},
		getMatchInfo(state) {
			return state.match
		},
		getProfileInfo(state) {
			return state.profile
		}
	},
	mutations: {
		pushError(state, {type, message}) {
			state.errors.push({type: type, message: message})
		},
		setMatchesHistory(state, payload) {
			state.matchesHistory = payload
		},
		setAccountId(state, accountid) {
			state.accountID = accountid
		},
		setMatchInfo(state, data) {
			state.match = data
		},
		setProfileInfo(state, data) {
			state.profile = data
		},
		setHeroes(state, data) {
			state.heroes = data
		}
	},
	actions: {
		async setHeroes({commit}) {
			try {
				const response = await fetch('https://api.opendota.com/api/heroStats')
				const data = await response.json()

				commit('setHeroes', data)
			} catch (error) {
				console.log(error.message);
			}
		},
		async matchInfo({commit}, id) {
			try {
				const response = await fetch(`https://api.opendota.com/api/matches/${id}`)
				const data = await response.json()

				// console.log(data);

				commit('setMatchInfo', data)
			} catch (error) {
				commit('pushError', {type: 'danger', message: error.message})
				console.warn(error.message);
			}
		},
		async profileInfo({commit}, id) {
			try {
				const response = await fetch(`https://api.opendota.com/api/players/${id}?`)
				const data = await response.json()

				commit('setProfileInfo', data)
			} catch (error) {
				commit('pushError', {type: 'danger', message: error.message})
				console.warn(error.message);
			}
		}
	},
	modules: {
	}
})
