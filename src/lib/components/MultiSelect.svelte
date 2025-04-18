<script>
    // Expects options like [{ value: 'REACT', text: 'React JS' }, ...]
    export let options = [];
    export let name;
    export let label;
    // Bind to an array of selected values
    export let selectedValues = []; // e.g., ['REACT', 'SQL']
    export let required = false; // Note: HTML 'required' doesn't work well with checkboxes, validation logic needed in parent
    export let description = '';
    export let error = '';
  
    // Helper to check if a value is selected
    function isChecked(value) {
      return selectedValues.includes(value);
    }
  
    // Update the selectedValues array when a checkbox changes
    function handleChange(event) {
      const { value, checked } = event.target;
      if (checked) {
        selectedValues = [...selectedValues, value];
      } else {
        selectedValues = selectedValues.filter(v => v !== value);
      }
    }
  </script>
  
  <div class="form-group">
    <fieldset>
      <legend class="form-label">
        {label}
        {#if required}<span class="required-mark">*</span>{/if}
      </legend>
      {#if description}<p class="form-description">{description}</p>{/if}
  
      <div class="options-wrapper">
        {#each options as option (option.value)}
          <label class="option-label">
            <input
              type="checkbox"
              {name}
              value={option.value}
              checked={isChecked(option.value)}
              on:change={handleChange}
              class="form-checkbox"
            />
            <span class="option-text">{option.text}</span>
          </label>
        {/each}
      </div>
      {#if error}<p class="form-error">{error}</p>{/if}
    </fieldset>
  </div>
  
  <style>
     fieldset { border: none; padding: 0; margin: 0; }
     legend { margin-bottom: var(--spacing-2); font-weight: 500; font-size: 1rem; padding: 0; }
     .options-wrapper { display: flex; flex-direction: column; gap: var(--spacing-3); }
     .option-label { display: flex; align-items: center; cursor: pointer; font-weight: normal; }
     .form-checkbox {
       margin-right: var(--spacing-2);
       width: auto;
       appearance: none;
       border: 1px solid var(--color-input-border);
       width: 1.2em;
       height: 1.2em;
       border-radius: var(--border-radius-sm);
       transition: border-color 0.15s ease-in-out, background-color 0.15s ease-in-out;
        position: relative;
        top: -0.1em;
     }
     .form-checkbox:checked {
       border-color: var(--color-accent-primary);
       background-color: var(--color-accent-primary);
     }
      .form-checkbox:checked::before { /* Checkmark */
        content: '';
        display: block;
        width: 0.3em;
        height: 0.6em;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg) translate(-10%, -10%); /* Adjust position */
        position: absolute;
        top: 15%; /* Adjust fine tuning */
        left: 35%; /* Adjust fine tuning */
      }
     .form-checkbox:focus {
       outline: none;
       box-shadow: 0 0 0 3px rgba(var(--color-accent-primary-rgb), 0.3);
     }
     .option-text { line-height: 1.3; }
  </style>