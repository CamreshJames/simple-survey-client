 
<div class="card">
    <slot />
  </div>
  
  <style>
    .card {
      background-color: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-6);
      box-shadow: 0 2px 4px var(--color-card-shadow);
      transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
      overflow: hidden; /* Ensure content respects border radius */
    }
  </style>