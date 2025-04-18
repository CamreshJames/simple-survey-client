<script>
    export let name;
    export let label;
    export let required = false;
    export let description = '';
    export let error = '';
    export let multiple = false;
    export let accept = '.pdf';
    import Button from './Button.svelte';
  
    // This will hold the FileList object for the parent component
    export let selectedFiles = null; // Use bind:files
  
    let fileInput; // Reference to the input element
  
    function handleFileChange(event) {
       selectedFiles = event.target.files;
    }
  
    // Display selected file names
    function getFileNames() {
        if (!selectedFiles || selectedFiles.length === 0) {
            return "No files selected";
        }
        return Array.from(selectedFiles).map(f => f.name).join(', ');
    }
  </script>
  
  <div class="form-group">
    <label for={name} class="form-label">
      {label}
      {#if required}<span class="required-mark">*</span>{/if}
    </label>
    {#if description}<p class="form-description">{description}</p>{/if}
  
    <!-- Hidden actual file input -->
    <input
  type="file"
  id={name} 
  {name}
  {required}
  {multiple}
  {accept}
  bind:this={fileInput}
  on:change={handleFileChange}
  class="file-input-hidden"
  aria-describedby={error ? `${name}-error` : (description ? `${name}-desc` : undefined)}
/>
  
    <Button variant="outline" onClick={() => fileInput?.click()} type="button">
      Choose File(s)
    </Button>
  
    <!-- Display selected file names -->
    <div class="file-names mt-2">
        {#if selectedFiles && selectedFiles.length > 0}
            <strong>Selected:</strong> {getFileNames()}
        {:else}
            <span class="text-secondary">No file chosen</span>
        {/if}
    </div>
  
  
    {#if error}<p id="{name}-error" class="form-error">{error}</p>{/if}
  </div>
  
  <style>
      .file-input-hidden {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
      }
      .file-names {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
      }
      .mt-2 {
          margin-top: var(--spacing-2);
      }
       .text-secondary {
           color: var(--color-text-secondary);
       }
  </style>