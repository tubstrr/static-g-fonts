<script setup>
	// Custom Imports
	import { validate } from "~/helpers/validate";
	import { download } from "~/helpers/download";

	// State
	const url = ref("");

	// Methods
	const submit = async () => {
		if (validate(url.value)) {
			const res = await $fetch("/api/generate", {
				method: "POST",
				body: { url: url.value },
				responseType: "blob"
			});

			download(res);
		}
	};
</script>

<template>
	<main id="main">
		<section id="box">
			<h1>Hello world</h1>
			<p>Message is: {{ url }}</p>
			<form @submit.prevent="submit">
				<input v-model="url" placeholder="Google Fonts URL" />
				<button type="submit">Submit</button>
			</form>
		</section>
	</main>
</template>

<style lang="scss">
	@import "~/assets/styles/main.scss";
	#main {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		min-width: 100vw;

		#box {
			border: 2px solid black;
			padding: 1em;
			width: clamp(300px, 75ch, 800px);

			input {
				border: 5px solid pink;
				padding: 0.5em;
			}
		}
	}
</style>
