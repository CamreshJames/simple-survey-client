<script>
    export let type = 'button'; // button, submit, reset
    export let variant = 'primary'; // primary, secondary, outline, danger
    export let disabled = false;
    export let onClick = () => {}; // Optional click handler prop
  </script>
  
  <button
    {type}
    class="btn {variant}"
    {disabled}
    on:click={onClick}
    on:click
  >
    <slot />
  </button>
  
  <style>
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-3) var(--spacing-6);
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.5;
      border-radius: var(--border-radius-md);
      border: 1px solid transparent;
      cursor: pointer;
      transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      white-space: nowrap; /* Prevent wrapping */
    }
  
    .btn:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(var(--color-accent-primary-rgb), 0.4);
    }
  
    .btn:disabled,
    .btn[disabled] {
      cursor: not-allowed;
      opacity: 0.65;
       background-color: var(--color-disabled-bg);
       border-color: var(--color-disabled-border);
       color: var(--color-disabled-text);
       box-shadow: none;
    }
  
    /* Variants */
    .btn.primary {
      color: #ffffff;
      background-color: var(--color-accent-primary);
      border-color: var(--color-accent-primary);
    }
    .btn.primary:not(:disabled):hover {
      background-color: var(--color-accent-primary-hover);
      border-color: var(--color-accent-primary-hover);
    }
  
    .btn.secondary {
      color: var(--color-accent-primary);
      background-color: rgba(var(--color-accent-primary-rgb), 0.1);
      border-color: transparent;
    }
    .btn.secondary:not(:disabled):hover {
       background-color: rgba(var(--color-accent-primary-rgb), 0.2);
    }
  
    .btn.outline {
      color: var(--color-accent-primary);
      background-color: transparent;
      border-color: var(--color-accent-primary);
    }
     .btn.outline:not(:disabled):hover {
       background-color: rgba(var(--color-accent-primary-rgb), 0.1);
     }
  
    .btn.danger {
      color: #ffffff;
      background-color: var(--color-error);
      border-color: var(--color-error);
    }
     .btn.danger:not(:disabled):hover {
       background-color: #c53030; /* Darker red */
       border-color: #c53030;
     }
  
  </style>