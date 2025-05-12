<script>
    import { goto } from '$app/navigation';
    import { fade, fly } from 'svelte/transition';

    let email = '';
    let password = '';
    let isLoading = false;
    let error = '';
    let showErrorPopup = false;

    function showError(message) {
        error = message;
        showErrorPopup = true;
        setTimeout(() => {
            showErrorPopup = false;
        }, 3000); // Hide after 3 seconds
    }

    async function handlesubmit() {
        isLoading = true;
        error = '';
        showErrorPopup = false;
        
        try {
            const response = await fetch('/api/authentication/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (!response.ok) {
                throw new Error('User not found');
            }

            const data = await response.json();
            await goto('/users/dashboard');
            
        } catch (err) {
            showError('User not found. Please check your credentials.');
        } finally {
            isLoading = false;
        }
    }
</script>

{#if showErrorPopup}
    <div class="fixed top-4 right-4 z-50" transition:fly="{{ y: -200, duration: 500 }}" role="alert">
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
            <div class="flex items-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
            </div>
        </div>
    </div>
{/if}

<div class="flex items-center justify-center min-h-screen bg-slate-300">
    <div class="w-[400px] p-8 bg-slate-50 border border-slate-100 rounded-lg shadow-md">
        <div class="text-center mb-8">
            <h1 class="text-2xl font-bold">GRAPHIT LOGO HERE</h1>
        </div>
        
        <form on:submit|preventDefault={handlesubmit} class="space-y-4">
            <h2 class="text-xl font-semibold mb-4">Login</h2>
            
            <div class="space-y-2">
                <label for="email" class="block text-sm font-semibold">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    bind:value={email}
                    class="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>

            <div class="space-y-2">
                <label for="password" class="block text-sm font-semibold">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    bind:value={password}
                    class="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>

            <button 
                type="submit" 
                class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
            >
                {#if isLoading}
                    Loading...
                {:else}
                    Login
                {/if}
            </button>

            <div class="text-center text-sm mt-4">
                <span class="text-gray-600">Not registered yet? </span>
                <a href="/signup" class="text-blue-600 hover:underline">Signup here</a>
            </div>
        </form>
    </div>
</div>