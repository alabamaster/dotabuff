<template>
	<div v-if="errors" aria-live="polite" aria-atomic="true" class="toast-list">
		<!-- Position it: -->
		<!-- - `.toast-container` for spacing between toasts -->
		<!-- - `.position-absolute`, `top-0` & `end-0` to position the toasts in the upper right corner -->
		<!-- - `.p-3` to prevent the toasts from sticking to the edge of the container  -->
		<div class="toast-container position-absolute bottom-0 end-0 p-3">

			<!-- Then put toasts within -->
			<div v-for="(error, idx) in errors" :key="idx" :class="errroClasses(error.type)" class="toast align-items-center text-white border-0" role="alert" aria-live="assertive" aria-atomic="true">
				<div class="d-flex">
					<div :class="{'text-dark':error.type === 'light'}" class="toast-body">{{ error.message }}</div>
					<button 
						:class="{ 'btn-close-dark': error.type === 'light', 'btn-close-white': error.type !== 'light' }" 
						type="button" 
						class="btn-close me-2 m-auto" 
						data-bs-dismiss="toast" 
						aria-label="Close"
					></button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Toast } from 'bootstrap';

export default {
	// mounted() {
	// 	// toast
	// 	Array.from(document.querySelectorAll('.toast'))
	// 		.forEach(toastNode => new Toast(toastNode, {delay: 5000}).show())
	// },
	methods: {
		errroClasses(type) {
			return {
				'bg-danger': type == 'danger',
				'bg-primary': type == 'primary',
				'bg-success': type == 'success',
				'bg-light': type == 'light',
			}
		}
	},
	computed: {
		errors() {
			return this.$store.getters.getErrors
		},
	},
	watch: {
		errors(v) {
			console.log(v);
			Array.from(document.querySelectorAll('.toast'))
				.forEach(toastNode => new Toast(toastNode, {delay: 5000}).show())
		}
	}
}
</script>

<style lang="scss">
.toast-list {
	position: absolute;
	height: auto;
	width: 100%;
	bottom: 0;
	right: 0;
}
</style>
