<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    onMount(() => {
        goto('/login');
    });
</script>

<div class="flex items-center justify-center min-h-screen bg-slate-300">
    <!-- This will show briefly before redirect -->
    <div class="text-slate-600">
        Redirecting to login...
    </div>
</div>
