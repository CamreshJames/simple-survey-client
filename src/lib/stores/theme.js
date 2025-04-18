// src/lib/stores/theme.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Check for saved theme preference or use system preference
function getInitialTheme() {
  if (browser) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }

    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light'; // Default for SSR
}

// Function to apply the theme class to the document element
function applyTheme(themeValue) {
    if (browser) {
        if (themeValue === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
    }
}

const initialTheme = getInitialTheme();
export const theme = writable(initialTheme);

// Apply the initial theme when the store is initialized (client-side)
if (browser) {
    applyTheme(initialTheme);
}


// Save theme preference when it changes and apply class
theme.subscribe(value => {
  if (browser) {
    localStorage.setItem('theme', value);
    applyTheme(value);
  }
});

// Toggle between light and dark theme
export function toggleTheme() {
  theme.update(current => (current === 'light' ? 'dark' : 'light'));
}