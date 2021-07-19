<template>
	<div class="card mb-3" v-if="$store.getters.getProfileInfo">
		<div>
			<div v-if="!matches.length" class="alert alert-warning mb-0">Нет матчей</div>
			<div v-else class="board">
				<div class="board__titles">
					<div id="title-hero">Hero</div>
					<div title="Win / Loss">W/L</div>
					<div>Game Type</div>
					<div title="Kills / Death / Assists">KDA</div>
					<div>Time</div>
					<div>Skill</div>
				</div>
				<div class="board__list">
					<router-link 
						:to="'/match/' + match.match_id" 
						v-for="match in matches" 
						:key="match.match_id" 
						class="board__item-link"
					>
						<div class="board__item">
							<div class="board__col" id="col-hero">
								<img 
									:src="`${$store.state.heroesURL}${heroInfo(match.hero_id).icon}`" 
									:alt="heroInfo(match.hero_id).localized_name"
									class="hero-image"
								>
								<span>{{ heroInfo(match.hero_id).localized_name }}</span>
							</div>
							<div v-html="win(match.win, match.leaver_status)" class="board__col" id="col-wl"></div>
							<div class="board__col" id="col-mode">
								<span>{{ gameMode(match.game_mode) }}</span>
								<span v-if="match.party_size > 1" style="font-size: 12px;">(+{{match.party_size }})</span>
							</div>
							<div class="board__col" id="col-kda">
								<span>{{ match.kills }}/{{ match.deaths }}/{{ match.assists }}</span>
							</div>
							<div class="board__col" id="col-time">
								<span>{{ new Date(match.start_time * 1000).toLocaleString().slice(0, -3) }}</span>
								<span>Duration {{ (match.duration / 60).toFixed() }} min</span>
							</div>
							<div class="board__col" id="col-skill">
								<span>{{ skill(match.skill) }}</span>
							</div>
						</div>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import GM from '@/json/gameModes.json'

export default {
	data() {
		return {
			gameModes: GM
		}
	},
	methods: {
		win(win, leaveStatus) {
			if (leaveStatus >= 2) {
				return '<span class="badge bg-secondary">Leave</span>'
			}
			return win ? '<span class="badge bg-success">Win</span>' : '<span class="badge bg-danger">Loss</span>'
		},
		heroInfo(hid) {
			return this.$store.getters.heroes.filter(h => h.id === hid)[0]
		},
		gameMode(id) {
			return this.gameModes[0][id].title
		},
		skill(num) {
			if (num === null || num === 1) {
				return 'Normal Skill'
			}
			return num === 2 ? 'High Skill' : 'Very High Skill' 
		}
	},
	computed: {
		matches() {
			return this.$store.getters.getMatchesHistory
		}
	}
}
</script>

<style lang="scss" scoped>
tr td {
	vertical-align: middle;
}
.board {
	#col-hero, #title-hero {
		// flex: 0 0 25%;
	}
	#col-wl {}
	#col-mode {}
	#col-kda {}
	#col-time {
		flex-direction: column;
		align-items: start;
		& span {font-size: 14px;}
	}
	#col-skill {}
	&__titles {
		display: flex;
		justify-content: space-between;
		padding-top: 20px;
		padding-bottom: 20px;

		& > div {
			font-weight: 700;
			flex: 0 0 calc(75% / 5);
			
			display: flex;
			justify-content: center;
			
			&:first-child {
				flex: 0 0 25%;
				justify-content: flex-start;
			}
		}
	}
	&__list { }
	&__item-link {
		text-decoration: none;
		color: unset;

		display: block;
		
		border-bottom: 1px solid #eaeaea !important;
		&:last-child {border-bottom: none !important;}

		transition: background-color .4s ease;

		&:hover {
			background-color: #ecf7ff;
		}
	}
	&__item {
		display: flex;
		align-items: center;
		justify-content: space-between;

		min-height: 50px;
		padding: 5px 0;
		color: #1b1b27;
	}
	&__col {
		display: flex;
		align-items: center;
		justify-content: center;

		flex: 0 0 calc(75% / 5);
		&:first-child {
			flex: 0 0 25%;
			justify-content: flex-start;
		}
	}

	&__titles, &__item-link {
		padding-left: 20px;
		padding-right: 20px;
	}
}
</style>
