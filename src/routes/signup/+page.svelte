<script lang="ts">
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    import { fade, fly } from 'svelte/transition';

    let { data }: { data: PageData } = $props();

    let fname = '';
    let lname = '';
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
        }, 3000);
    }

    async function handleSubmit() {
        isLoading = true;
        error = '';
        showErrorPopup = false;
        
        try {
            const response = await fetch('/api/authentication/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fname,
                    lname,
                    email,
                    password
                })
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }

            const data = await response.json();
            await goto('/login');
            
        } catch (err) {
            showError('Failed to create account. Please try again.');
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

<div class="flex flex-col items-center justify-center min-h-screen bg-slate-300">

    <div class=" mb-8">
        <h1 class="text-2xl font-bold">GRAPHIT LOGO HERE</h1>
    </div>

    <div class="w-[400px] p-8 bg-slate-50 border border-slate-100 rounded-lg shadow-md">
        <form on:submit|preventDefault={handleSubmit} class="space-y-2">
            <h2 class="text-xl font-semibold mb-4">Sign Up</h2>
            
            <div class="">
                <label for="firstName" class="block text-sm font-semibold">First Name</label>
                <input 
                    type="text" 
                    id="firstName" 
                    bind:value={fname}
                    class="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>

            <div class="">
                <label for="lastName" class="block text-sm font-semibold">Last Name</label>
                <input 
                    type="text" 
                    id="lastName" 
                    bind:value={lname}
                    class="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>

            <div class="">
                <label for="email" class="block text-sm font-semibold">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    bind:value={email}
                    class="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>

            <div class="">
                <label for="password" class="block text-sm font-semibold">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    bind:value={password}
                    class="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>

            <div class="flex justify-end ">
                <button 
                type="submit" 
                class="w-[40%] text-sm border border-black shadow-md font-semibold py-2 rounded-md hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                disabled={isLoading}
            >
                {#if isLoading}
                    Loading...
                {:else}
                    Sign Up
                {/if}
            </button>
            </div>
            
        </form>
    </div>
</div>