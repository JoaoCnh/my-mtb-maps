<script lang="ts">
	import SvelteIcon from './SvelteIcon.svelte';
</script>

<div class="w-full h-full flex items-center justify-center">
	<div class="flex flex-col items-center p-10 bg-slate-500 dark:bg-white rounded-lg">
		<a href="https://kit.svelte.dev/" target="_blank" rel="noreferrer">
			<SvelteIcon class="w-12 h-12 text-[#FF3E00] hover:scale-125 transition-transform" />
		</a>
		<header class="mt-4 max-w-2xl">
			<h1 class="text-4xl font-bold tracking-tight text-zinc-100 dark:text-zinc-800 sm:text-5xl">
				Built with
				<span class="bg-gradient-to-r from-orange-500 to-[#FF3E00] text-transparent bg-clip-text">
					Svelte
				</span>
			</h1>
			<h2 class="text-xl font-bold tracking-tight text-zinc-100 dark:text-zinc-800 sm:text-3xl">
				<!-- TODO: Add link once website is launched -->
				By João Cunha
			</h2>
		</header>
	</div>
</div>
