<template>
	<div class="card" v-if="profile">
		<div class="card-header">Profile info</div>
		<div class="card-body">
			<div class="player">
				<div class="player__pre-info">
					<div class="avatar avatar__wh">
						<img :src="profile.profile.avatarfull" :alt="profile.name" class="avatar__image">
					</div>
					<div class="player__tire">
						<div>Tier <strong>{{ profile.rank_tier }}</strong></div>
						<div>MMR <strong>{{ profile.mmr_estimate.estimate }}</strong></div>
					</div>
				</div>
			</div>
			<h4>{{ profile.profile.personaname }}</h4>
			<div>Last login: {{ new Date(profile.profile.last_login).toLocaleString() }}</div>
			<div>Steam link: <a :href="profile.profile.profileurl" target="_blank">profile</a></div>
		</div>
	</div>
</template>

<script>
export default {
	computed: {
		profile() {
			return this.$store.getters.getProfileInfo
		}
	}
}
</script>

<style lang="scss">
.avatar {
	&__wh {
		width: 200px;
		height: 200px;

		border-radius: 4px;
    	overflow: hidden;
	}
	&__image {
		width: 100%;
		display: block;
	}
}

.player {
	&__pre-info {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	&__tire {
		flex: 1 0 0;
		padding: 0 20px;
	}
}
</style>
