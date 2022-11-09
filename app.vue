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
	<header id="header">
		<h1 class="title">Static Fonts</h1>
		<a href="https://jonknoll.dev/?static-g-fonts" target="_blank" class="sub-title">A web app by Jonathan Knoll</a>
	</header>
	<main id="main">
		<section id="box">
			<h2>Introduction</h2>
			<p>Static Fonts is a web app that enables you to easily generate static font assets from 3rd parties.</p>
			<p>
				Currently only has support for Google Font's. If there's an other provider your interested in, please let me
				know on <a href="https://github.com/tubstrr/static-g-fonts" target="_blank">GitHub</a>
			</p>
			<form @submit.prevent="submit">
				<input v-model="url" placeholder="Google Fonts URL" />
				<button type="submit">Submit</button>
			</form>
		</section>
		<div class="decoration">
			<SvgCpu class="cpu" />
			<SvgShape class="shape" />
		</div>
	</main>
</template>

<style lang="scss">
	@import "~/assets/styles/main.scss";
	#header {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 2;

		.title {
			padding-top: 1rem;
			margin-left: 1rem;
			line-height: 1.2;
		}
		.sub-title {
			font-family: var(--font-headline);
			margin-left: 1rem;
			font-size: 1em;
			font-weight: 600;
			font-feature-settings: "smcp";
			font-variant: small-caps;
		}
	}

	#main {
		display: flex;
		justify-content: center;
		position: relative;
		align-items: center;
		min-height: 100vh;
		min-width: 100vw;

		#box {
			background: var(--white);
			color: var(--black);
			padding: 2em;
			max-width: 90%;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			border: 4px solid var(--black);
			box-shadow: -1em 1em 0 var(--light-blue);
			width: clamp(300px, calc(60ch + 2em), 800px);

			input {
				border: 5px solid pink;
				padding: 0.5em;
			}
		}

		.decoration {
			z-index: -1;
			user-select: none;
			pointer-events: none;
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;

			.cpu {
				position: absolute;
				width: 10vw;
				height: 10vw;
				bottom: 1rem;
				left: 1rem;
			}

			.shape {
				position: absolute;
				right: -10vw;
				height: 20vw;
				width: 20vw;
				top: -3em;
			}
		}
	}
</style>
