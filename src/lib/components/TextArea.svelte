<script>
    export let value = '';
    export let name;
    export let label;
    export let required = false;
    export let placeholder = '';
    export let description = '';
    export let error = '';
    export let rows = 4;
</script>

<div class="form-group">
    <label for={name} class="form-label">
        {label}
        {#if required}<span class="required-mark">*</span>{/if}
    </label>
    {#if description}<p class="form-description">{description}</p>{/if}
    <textarea
    id={name}
    {name}
    bind:value
    {required}
    {placeholder}
    {rows}
    class:invalid={error}
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={error ? `${name}-error` : undefined}
></textarea>
    {#if error}<p id="{name}-error" class="form-error">{error}</p>{/if}
</div>

<style>
  textarea.invalid {
    border-color: var(--color-error);
  }
  textarea.invalid:focus {
     border-color: var(--color-error);
     box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.3);
  }
</style>