// src/lib/components/Select.svelte
<script>
  /** @type {{ value: string | number, text: string }[]} */
  export let options = []; // Expects array like [{ value: 'MALE', text: 'Male' }]
  export let name;
  export let label;
  export let selectedValue = ''; // Use bind:value
  export let required = false;
  export let placeholder = 'Please select...'; // Optional placeholder/default option
  export let description = '';
  export let error = '';
  export let disabled = false;

  // We need an explicit 'change' handler if we want to clear errors on interaction
  // Svelte's bind:value handles the update automatically, but doesn't trigger a generic interaction event easily
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleChange(event) {
      // Update bound value (though bind:value does this, it's good practice)
      selectedValue = event.target.value;
      // Dispatch a change event for the parent if needed
      dispatch('change', selectedValue);
      // Clear error on interaction (if error clearing logic exists in parent)
      if (error) {
          dispatch('clearError', { name }); // Example: Parent can listen for this
      }
  }
</script>

<div class="form-group">
  <label for={name} class="form-label">
    {label}
    {#if required}<span class="required-mark">*</span>{/if}
  </label>
  {#if description}<p class="form-description">{description}</p>{/if}
  <div class="select-wrapper">
    <select
        id={name} 
        {name}
        bind:value={selectedValue}
        {required}
        {disabled}
        class:invalid={error}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        on:change={handleChange}
        >
      {#if placeholder}
        <option value="" disabled selected={!selectedValue}>{placeholder}</option>
      {/if}
      {#each options as option (option.value)}
        <option value={option.value}>{option.text}</option>
      {/each}
    </select>
    <span class="select-arrow" aria-hidden="true">▼</span>
  </div>
  {#if error}<p id="{name}-error" class="form-error">{error}</p>{/if}
</div>

<style>
  .select-wrapper {
    position: relative;
    width: 100%;
  }

  select {
    appearance: none; /* Remove default arrow */
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 100%;
    /* Inherit padding, border, background, etc. from global input styles */
    padding-right: var(--spacing-10); /* Make space for custom arrow */
    cursor: pointer;
  }

  /* Add custom arrow */
  .select-arrow {
    position: absolute;
    top: 50%;
    right: var(--spacing-4);
    transform: translateY(-50%);
    pointer-events: none; /* Allow clicks to pass through to select */
    color: var(--color-text-secondary);
    font-size: 0.8em; /* Adjust size as needed */
    transition: color 0.2s ease-in-out;
  }

  select:hover + .select-arrow,
  select:focus + .select-arrow {
    color: var(--color-text-primary);
  }

  select:disabled {
    cursor: not-allowed;
    opacity: 0.7;
     background-color: var(--color-disabled-bg); /* Match disabled input style */
  }
   select:disabled + .select-arrow {
     opacity: 0.5;
   }


  /* Ensure invalid state styling applies */
  select.invalid {
    border-color: var(--color-error);
  }
  select.invalid:focus {
    border-color: var(--color-error);
    box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.3);
  }
  select.invalid + .select-arrow {
      color: var(--color-error);
  }

  /* Style for the placeholder option */
  select option[disabled] {
      color: var(--color-text-secondary);
  }

</style>