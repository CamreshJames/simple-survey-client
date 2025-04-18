<script>
    // Expects options like [{ value: 'MALE', text: 'Male' }, ...]
    export let options = [];
    export let name;
    export let label;
    export let selectedValue = ''; // Use bind:group for simplicity
    export let required = false;
    export let description = '';
    export let error = '';
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
              type="radio"
              {name}
              value={option.value}
              bind:group={selectedValue}
              {required}
              class="form-radio"
            />
            <span class="option-text">{option.text}</span>
          </label>
        {/each}
      </div>
        {#if error}
        <p class="form-error">{error}</p>
        {/if}
    </fieldset>
  </div>
  
  <style>
    fieldset {
      border: none;
      padding: 0;
      margin: 0;
    }
    legend { /* Style like a label */
       margin-bottom: var(--spacing-2);
       font-weight: 500;
       font-size: 1rem;
       padding: 0; /* Reset fieldset legend padding */
    }
    .options-wrapper {
      display: flex;
      flex-direction: column; /* Stack options vertically */
      gap: var(--spacing-3);
    }
    .option-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: normal; /* Override potential label boldness */
    }
    .form-radio {
      margin-right: var(--spacing-2);
       width: auto; /* Override default block width */
       appearance: none; /* Custom styling */
       border: 1px solid var(--color-input-border);
       width: 1.2em;
       height: 1.2em;
       border-radius: 50%;
       transition: border-color 0.15s ease-in-out;
       position: relative;
       top: -0.1em; /* Align better with text */
    }
    .form-radio:checked {
       border-color: var(--color-accent-primary);
       background-color: var(--color-accent-primary);
    }
     .form-radio:checked::before {
       content: '';
       display: block;
       width: 0.6em;
       height: 0.6em;
       border-radius: 50%;
       background-color: white;
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
     }
    .form-radio:focus {
       outline: none;
       box-shadow: 0 0 0 3px rgba(var(--color-accent-primary-rgb), 0.3);
    }
    .option-text {
       line-height: 1.3;
    }
  </style>