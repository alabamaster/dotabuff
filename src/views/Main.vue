<template>
	<div class="container pt-4">
		<div class="card">
			<div class="card-header">Введите AccountID (взять можно&nbsp;<a href="https://steamdb.info/calculator/" target="_blank">тут</a>)</div>
			<div class="card-body">
				<form @submit.prevent="handlerSubmit" class="row g-2">
					<div class="col-auto" style="flex: 1 0 0;">
						<input :value="$store.getters.getAccountId" ref="accountid" type="text" class="form-control form-control-lg">
					</div>
					<div class="col-auto">
						<button type="submit" class="btn btn-lg btn-primary" ref="handlerBtn">Получить данные</button>
					</div>
				</form>
			</div>
		</div>
		<div class="row mt-2">
			<div class="col-md-8">
				<MatchesHistory></MatchesHistory>
			</div>
			<div class="col-md-4">
				<PlayerInfo></PlayerInfo>
			</div>
		</div>
	</div>
	<Alerts></Alerts>
</template>

<script>
import Alerts from '@/components/Alerts'
import MatchesHistory from '@/components/MatchesHistory'
import PlayerInfo from '@/components/PlayerInfo'

export default {
	components: { Alerts, MatchesHistory, PlayerInfo },
	mounted() {
		// setTimeout(() => {
		// 	console.log(this.heroes);
		// }, 3000)
		this.$store.dispatch('setHeroes')
	},
	methods: {
		async handlerSubmit() {
			const params = {
				limit: 5
			}

			const acc = +this.$refs.accountid.value

			try {
				const response = await fetch(`https://api.opendota.com/api/players/${acc}/matches?${new URLSearchParams(params)}`)
				const data = await response.json()

				// console.log(data);
				this.$refs.handlerBtn.disabled = true

				data.forEach(match => {
					fetch(`https://api.opendota.com/api/matches/${match.match_id}`)
						.then(r => r.json())
						.then(matchData => {
							match.win = matchData.players.filter(p => p.account_id === acc)[0]?.win ?? null
						})
						.then(() => {
							if (data.error) throw new Error('Bad account id or steam id');

							this.$store.commit('setMatchesHistory', data)
							this.$store.commit('setAccountId', acc)
							this.$store.dispatch('profileInfo', acc)

							setTimeout(() => {
								this.$refs.handlerBtn.disabled = false
							}, 5000)
						})
						.catch(err => console.warn(err))
				})
			} catch (error) {
				this.$store.commit('pushError', {type: 'danger', message: error.message})
				console.error(error);
			}
		},
	},
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
