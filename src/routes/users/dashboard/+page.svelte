<script lang="ts">
    import type { PageData } from './$types';
    import Navbar from '$lib/components/+navbar.svelte';
    let { data }: { data: PageData } = $props();
</script>

<div class=""> 
    <Navbar></Navbar>
</div>