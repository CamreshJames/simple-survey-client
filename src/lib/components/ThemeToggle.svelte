<script>
    import { theme, toggleTheme } from '$lib/stores/theme.js';
    import Button from './Button.svelte'; // Assuming Button component exists
  
    // Icons (simple text or SVG)
    const sunIcon = '☀️';
    const moonIcon = '🌙';
  </script>
  
  <Button variant="secondary" on:click={toggleTheme} aria-label="Toggle theme">
    {#if $theme === 'light'}
      {moonIcon} <span class="sr-only">Switch to Dark Mode</span>
    {:else}
      {sunIcon} <span class="sr-only">Switch to Light Mode</span>
    {/if}
  </Button>
  
  <style>
    /* Screen Reader only class */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
  </style>