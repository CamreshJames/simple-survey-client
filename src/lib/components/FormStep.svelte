<script>
    import Input from './Input.svelte';
    import TextArea from './TextArea.svelte';
    import RadioGroup from './RadioGroup.svelte';
    import MultiSelect from './MultiSelect.svelte';
    import FileUpload from './FileUpload.svelte';
    import Select from './Select.svelte';
  
    /** @type {App.Question} */
    export let question;
    /** @type {Record<string, any>} */
    export let formData; // Pass entire form data object
     /** @type {Record<string, string>} */
    export let errors; // Pass errors object { fieldName: errorMessage }
  
    // Helper to get/set form data values reactively
    $: value = formData[question.name];
    $: error = errors[question.name] || '';
  
    // Needed for bind:group on radio and bind:files on file upload
    function updateFormData(newValue) {
        formData[question.name] = newValue;
        // Trigger reactivity by reassigning (though direct mutation often works in Svelte 3/4)
        formData = formData;
        // Clear error when user interacts
        if (errors[question.name]) {
            errors[question.name] = '';
            errors = errors; // Trigger reactivity
        }
    }
  
    // Special handling for files (FileUpload binds FileList)
     $: filesValue = formData[question.name] instanceof FileList ? formData[question.name] : null;
     function updateFiles(newFileList) {
         formData[question.name] = newFileList;
         formData = formData;
          if (errors[question.name]) {
             errors[question.name] = '';
             errors = errors;
         }
     }
  
     // Special handling for MultiSelect (binds array)
     $: multiSelectValue = Array.isArray(formData[question.name]) ? formData[question.name] : [];
     function updateMultiSelect(newArray) {
         formData[question.name] = newArray;
         formData = formData;
          if (errors[question.name]) {
             errors[question.name] = '';
             errors = errors;
         }
     }
  </script>
  
  {#if !question}
    <p>Loading question...</p>
  {:else}
    <div class="form-step fade-in">
        {#if question.type === 'short_text'}
            <Input
                label={question.text}
                name={question.name}
                type="text"
                required={question.required === 'yes'}
                description={question.description}
                bind:value={formData[question.name]}
                on:input={() => updateFormData(formData[question.name])}
                {error}
            />
        {:else if question.type === 'email'}
            <Input
                label={question.text}
                name={question.name}
                type="email"
                required={question.required === 'yes'}
                description={question.description}
                bind:value={formData[question.name]}
                on:input={() => updateFormData(formData[question.name])}
                {error}
            />
        {:else if question.type === 'long_text'}
            <TextArea
                label={question.text}
                name={question.name}
                required={question.required === 'yes'}
                description={question.description}
                bind:value={formData[question.name]}
                on:input={() => updateFormData(formData[question.name])}
                {error}
            />
        {:else if question.type === 'choice' && question.options?.multiple === 'no'}
            <RadioGroup
                label={question.text}
                name={question.name}
                required={question.required === 'yes'}
                description={question.description}
                options={question.options?.option || []}
                bind:selectedValue={formData[question.name]}
                on:change={() => updateFormData(formData[question.name])}
                {error}
            />
        {:else if question.type === 'choice' && question.options?.multiple === 'yes'}
             <MultiSelect
                label={question.text}
                name={question.name}
                required={question.required === 'yes'}
                description={question.description}
                options={question.options?.option || []}
                bind:selectedValues={formData[question.name]}
                 on:change={() => updateMultiSelect(formData[question.name])}
                {error}
             />

             {:else if question.type === 'select'} 
         <Select
             label={question.text}
             name={question.name}
             required={question.required === 'yes'}
             description={question.description}
             options={question.options || []} 
             bind:selectedValue={formData[question.name]}
             on:change={() => updateFormData(formData[question.name])}
             on:clearError={(e) => { if (errors[e.detail.name]) { errors[e.detail.name] = ''; errors = errors; } }}
             {error}
         />
        {:else if question.type === 'file'}
            <FileUpload
                label={question.text}
                name={question.name}
                required={question.required === 'yes'}
                description={question.description}
                multiple={question.file_properties?.multiple === 'yes'}
                accept={question.file_properties?.format}
                bind:selectedFiles={formData[question.name]}
                on:change={() => updateFiles(formData[question.name])}
                {error}
            />
        {:else}
            <p>Unsupported question type: {question.type}</p>
        {/if}
    </div>
  {/if}
  
  <style>
      .form-step {
          /* Add any specific step styling if needed */
          margin-bottom: var(--spacing-8); /* Space before nav buttons */
      }
       .fade-in {
         animation: fadeIn 0.3s ease-in-out;
       }
  
       @keyframes fadeIn {
         from { opacity: 0; transform: translateY(10px); }
         to { opacity: 1; transform: translateY(0); }
       }
  </style>