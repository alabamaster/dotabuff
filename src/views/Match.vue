<template>
   <div class="container pt-4">
      <div v-if="!match" class="row">
         <div class="col-md-12">
            <div class="alert alert-warning mb-0">Loading data ...</div>
         </div>
      </div>
      <div v-else class="row">
         <div class="col-md-12">
            <div class="card">
               <div class="card-body">
                  <div class="row">
                     <div class="col-md-12">
                        <div class="row justify-content-between">
                           <div class="col-auto">
                              <div>
                                 <router-link to="/">Get back</router-link>
                              </div>
                              <div>
                                 <span>Date </span>
                                 <b>{{ new Date(match.start_time * 1000).toLocaleString().slice(0, -3) }}</b>
                              </div>
                           </div>
                           <div class="col-auto">
                              Download replay: <a :href="match.replay_url">donwload</a>
                           </div>
                        </div>
                     </div>
                     <hr class="mt-3 mb-0" />

                     <div class="row justify-content-between align-items-center mx-auto" style="min-height: 80px;">
                        <div class="col-md-4 d-flex justify-content-start">
									<div class="score score--flex">
										<div class="score__text">RADIANT</div>
										<div class="score__num">{{ match.radiant_score }}</div>
									</div>
								</div>
								<div class="col-md-4 d-flex align-items-center flex-column">
									<div :class="{'radiant-win': match.radiant_win, 'dire-win': !match.radiant_win}">
										{{ match.radiant_win ? 'RADIANT VICTORY' : 'DIRE VICTORY' }}
									</div>
									<small>Duration <strong>{{ Math.floor(match.duration / 60) + ':' + match.duration % 60 }}</strong> minutes</small>
								</div>
								<div class="col-md-4 d-flex justify-content-end">
									<div class="score score--flex">
										<div class="score__text">DIRE</div>
										<div class="score__num">{{ match.dire_score }}</div>
									</div>
								</div>
                     </div>

							<div class="col-md-12">
								<div class="table-responsive">
                           <table class="table table-hover">
                              <thead class="table-dark">
                                 <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">KDA</th>
                                    <th scope="col">Net worth</th>
                                    <th scope="col">LH / D</th>
                                    <th scope="col">GPM / XPM</th>
                                    <th scope="col">DMG</th>
                                    <th scope="col">HEAL</th>
                                    <th scope="col" data-bs-toggle="tooltip" data-bs-placement="top" title="Build damage">BDMG</th>
											</tr>
                              </thead>
                              <tbody>
                                 <tr
                                    v-for="player in match.players"
                                    :key="player.player_slot"
												:class="{'table-radiant-line': player.isRadiant, 'table-dire-line': !player.isRadiant}"
												class="table-stats-line"
                                 >
                                    <th :class="{ 'text-secondary': !player.personaname }" scope="row">
													<div class="d-flex align-items-center">
														<img 
															:src="`${$store.state.heroesURL}${heroInfo(player.hero_id).icon}`" 
															:alt="heroInfo(player.hero_id).localized_name"
															class="hero-image"
														>
														<span>[{{ player.party_id }}] {{ player.personaname ?? "Anonymous" }}</span>
													</div>
                                    </th>
                                    <td>{{ player.kills }}/{{ player.deaths }}/{{ player.assists }}</td>
                                    <td>{{ player.net_worth.toLocaleString("de-DE") }}</td>
                                    <td>{{ +player.benchmarks.last_hits_per_min.raw.toFixed()}}/{{ player.denies }}</td>
                                    <td>{{ player.gold_per_min.toFixed() }}/{{ player.xp_per_min }}</td>
                                    <td>{{ player.hero_damage.toLocaleString("de-DE") }}</td>
                                    <td>{{ player.hero_healing.toLocaleString("de-DE") }}</td>
                                    <td>{{ player.tower_damage.toLocaleString("de-DE") }}</td>
                                 </tr>
                              </tbody>
                           </table>
                        </div>
							</div>
                  </div>
               </div>
            </div>
         </div>

         <div class="col-md-12">
            <div class="card my-3">
               <div class="card-header">Chat history</div>
               <div class="chat chat__wrap">
                  <div v-if="match.chat === null || !chatHistory.length" class="alert alert-info">Нет сообщений</div>
                  <div v-else class="chat__history">
                     <div
                        v-for="(chat, idx) in chatHistory"
                        :key="idx"
                        class="chat__item"
                     >
                        <span class="chat__time">{{ (chat.time / 60).toFixed(2) }}</span>
                        <span class="chat__name" v-html="playerChatName(chat.player_slot)"></span>
                        <span class="chat__text">{{ chat.key }}</span>
                     </div>
                     <!-- {{ match.chat }} -->
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
// import bootstrap from 'bootstrap/dist/js/bootstrap.min.js'

export default {
	mounted() {
		this.$store.dispatch('matchInfo', this.$route.params.id)
		this.$store.dispatch('setHeroes')

      // tooltips
      // let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      // let tooltipList = tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
      // tooltipList.forEach(item => {
      //    new bootstrap.Tooltip(item, options)
      // })
	},
	methods: {
		playerChatName(player_slot) {
			const player = this.match.players.filter(p => p.player_slot === player_slot)[0]
         
			const values = {
				name: !player.personaname ? 
				`<span style="font-weight: 400;">[${player.party_id}] Anonymous:</span>` 
				: `[${player.party_id}] ` + player.personaname + ':',
				icon: this.heroInfo(player.hero_id).icon
			}

			return `<img src="${this.$store.state.heroesURL + values.icon}" style="width: 20px;height:20px;"/> ${values.name}`
		},
		whoHasWon() {
			return this.match.radiant_win 
				? '<div class="radiant-win>RADIANT VICROTY</div>' 
				: '<div class="dire-win">DIRE VICROTY</div>'
		},
		heroInfo(hid) {
			return !this.$store.getters.heroes ? {} : this.$store.getters.heroes.filter(h => h.id === hid)[0]
		},
	},
	computed: {
		match() {
			return this.$store.getters.getMatchInfo
		},
		chatHistory() {
			return this.match ? this.match.chat.filter(i => i.type === 'chat') : 0
		},
		radiantPlayers() {
			return this.match.players.filter(p => p.isRadiant)
		},
		direPlayers() {
			return this.match.players.filter(p => !p.isRadiant)
		}
	}
}
</script>

<style lang="scss">
// win 
.radiant-win, .dire-win {
	text-transform: uppercase;
	letter-spacing: .3rem;
	font-size: 2rem;
	font-weight: 700;
}
.radiant-win {color: rgb(36, 161, 36);}
.dire-win {color: var(--btn-primary-bg)}

// score 
.score {
	&--flex {
		display: flex;
		align-items: center;
	}
	&__text, &__num {
		font-weight: bold;
		font-size: 1.6rem;
		margin-right: 5px;
		font-weight: 600;
	}
	&__num {
		color: var(--btn-info-bg);
	}
}

// table 
.table-stats-line td {vertical-align: middle;}
.table-radiant-line {
	background-color: rgba(62, 201, 131, 0.120);
}
.table-dire-line {
	background-color: rgba(209, 102, 102, 0.120);
}

.chat {
   &__wrap {
   }
   &__history {
      height: 200px;
      width: 100%;
      overflow: auto;
   }
   &__item {
      margin-bottom: 4px;
      padding: 5px 10px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;

      transition: background-color 0.2s ease-in;

      &:hover {
         background-color: var(--body-bg);
      }
   }
   &__time {
		width: 40px;
		display: inline-block;
		text-align: right;
      margin-right: 15px;
   }
   &__name {
      font-weight: bold;
      margin-right: 5px;
      color: var(--color-base-alpha);
   }
   &__text {
   }
}
</style>
