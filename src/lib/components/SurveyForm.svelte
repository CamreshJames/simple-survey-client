<script>
    import { onMount } from 'svelte';
    import { fetchQuestions, submitSurveyResponse } from '$lib/utils/api.js';
    import FormStep from './FormStep.svelte';
    import PreviewStep from './PreviewStep.svelte';
    import Button from './Button.svelte';
    import Card from './Card.svelte';
  
    /** @type {App.Question[]} */
    let questions = [];
    let currentStep = 0; // 0-based index
    let formData = {}; // Holds all collected data { questionName: value }
    let errors = {};   // Holds validation errors { questionName: message }
    let isLoading = true;
    let isSubmitting = false;
    let submitError = '';
    let submitSuccess = false;
    let apiError = ''; // Error fetching questions
  
    onMount(async () => {
      isLoading = true; // Ensure loading state is true initially
      apiError = ''; // Clear previous errors
      try {
        const data = await fetchQuestions();
        if (data && data.question) {
            questions = data.question; // Access the nested array
            initializeFormData();
        } else {
            // Handle case where data.question might be missing or empty
            questions = [];
            console.warn("No questions received from API or invalid format.");
            // Optionally set an apiError here if empty questions list is an error state
            // apiError = "No survey questions are available at the moment.";
        }
      } catch (err) {
         apiError = err.message || 'Failed to load survey questions. Please try refreshing.';
         console.error("Failed to load questions:", err);
         questions = []; // Ensure questions is empty on error
      } finally {
          isLoading = false;
      }
    });
  
    // Initialize formData with default values based on question types
    function initializeFormData() {
      const initialData = {};
      questions.forEach(q => {
        if (!q || !q.name) {
            console.warn("Skipping invalid question object:", q);
            return; // Skip malformed question data
        }
        if (q.type === 'choice' && q.options?.multiple === 'yes') {
          initialData[q.name] = []; // Array for multi-select
        } else if (q.type === 'file') {
            initialData[q.name] = null; // null or undefined for FileList
        } else {
          // Handle potential undefined/null values by defaulting to empty string
          initialData[q.name] = formData[q.name] ?? ''; // Keep existing value if any, else empty string
        }
      });
       // Update formData reactively
       formData = initialData;
       errors = {}; // Reset errors on re-initialization
    }
  
    // Reactive declarations
    $: currentQuestion = questions && questions.length > currentStep ? questions[currentStep] : null;
    $: isLastQuestionStep = questions.length > 0 && currentStep === questions.length - 1;
    $: isPreviewStep = questions.length > 0 && currentStep === questions.length;
  
    function validateStep() {
      // Ensure currentQuestion is valid before proceeding
      if (!currentQuestion || !currentQuestion.name) return true; // If no question, technically valid (or handle as error)
  
      const question = currentQuestion;
      const value = formData[question.name];
      let isValid = true;
      let currentErrors = { ...errors }; // Work on a copy to batch updates
  
      // Clear previous error for this field before re-validating
      delete currentErrors[question.name];
  
      if (question.required === 'yes') {
        // Validation for multi-choice (checkboxes)
        if (question.type === 'choice' && question.options?.multiple === 'yes') {
          if (!Array.isArray(value) || value.length === 0) {
            currentErrors[question.name] = 'Please select at least one option.';
            isValid = false;
          }
        }
        // Validation for file uploads
        else if (question.type === 'file') {
           if (!value || value.length === 0) { // Check if FileList exists and has files
             currentErrors[question.name] = 'Please upload at least one file.';
             isValid = false;
           } else {
                // Client-side file validation (format, size) - Keep backend validation as primary
                const allowedFormat = question.file_properties?.format?.toLowerCase();
                const maxSizeMB = parseFloat(question.file_properties?.max_file_size);
                const maxSizeBytes = (maxSizeMB && question.file_properties?.max_file_size_unit === 'mb') ? maxSizeMB * 1024 * 1024 : null;
                let fileError = '';
  
                for (const file of value) { // Iterate through FileList
                     // Format Check
                     if (allowedFormat && allowedFormat !== '*') { // Allow '*' for any type
                         const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
                         // Check if allowedFormat is a comma-separated list (e.g., ".jpg,.png")
                         const allowedFormats = allowedFormat.split(',').map(f => f.trim());
                         if (!allowedFormats.includes(fileExt)) {
                              fileError = `Invalid file type: ${file.name}. Only ${allowedFormat} allowed.`;
                              break;
                         }
                     }
                     // Size Check
                     if (maxSizeBytes && file.size > maxSizeBytes) {
                          fileError = `File too large: ${file.name}. Max size is ${maxSizeMB}MB.`;
                          break;
                     }
                }
  
                if (fileError) {
                    currentErrors[question.name] = fileError;
                    isValid = false;
                }
           }
        }
        // Validation for other required types (text, email, radio, etc.)
        else if (value === null || value === undefined || String(value).trim() === '') {
          currentErrors[question.name] = 'This field is required.';
          isValid = false;
        }
      }
  
      // Additional specific validations (run only if required check passed or not required)
      if (isValid && question.type === 'email' && value && String(value).trim() !== '') {
        // Basic email format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
           currentErrors[question.name] = 'Please enter a valid email address.';
           isValid = false;
        }
      }
  
      // Update errors object reactively
      errors = currentErrors;
      return isValid;
    }
  
    function nextStep() {
      if (!isPreviewStep) { // Only validate if moving from a question step
          if (!validateStep()) {
              return; // Stop if validation fails
          }
      }
      // Check bounds before incrementing
      if (currentStep < questions.length) {
        currentStep += 1;
         window.scrollTo(0, 0); // Scroll to top on step change
      }
    }
  
    function prevStep() {
      // Check bounds before decrementing
      if (currentStep > 0) {
        currentStep -= 1;
         window.scrollTo(0, 0);
      }
    }
  
    async function handleSubmit() {
      if (isSubmitting) return;
  
      isSubmitting = true;
      submitError = '';
      submitSuccess = false;
  
      // Final validation check (optional, but good practice)
      // Could re-validate all steps here if needed, but validateStep on "Next" should cover most cases.
  
      const submissionData = new FormData();
      questions.forEach(q => {
          if (!q || !q.name) return; // Skip invalid questions
  
          const value = formData[q.name];
  
          if (q.type === 'file') {
              // Ensure value is a FileList and has files before appending
              if (value instanceof FileList && value.length > 0) {
                  for (let i = 0; i < value.length; i++) {
                      submissionData.append(q.name, value[i], value[i].name);
                  }
              }
              // Do NOT append if no files are selected for an optional file input
              // If required, validation should have caught it earlier.
           } else if (q.type === 'choice' && q.options?.multiple === 'yes') {
               // Join array into comma-separated string for backend
               if (Array.isArray(value)) {
                   submissionData.append(q.name, value.join(','));
               } else {
                   submissionData.append(q.name, ''); // Send empty if somehow not an array
               }
           }
            else if (value !== null && value !== undefined) {
               // Append other values as strings
               submissionData.append(q.name, String(value));
          } else {
               // Send empty string for other null/undefined fields (e.g., optional text not filled)
               submissionData.append(q.name, '');
          }
      });
  
       // Debugging: Log FormData just before sending
       // console.log("Submitting FormData:");
       // for (let [key, value] of submissionData.entries()) {
       //    console.log(`${key}:`, value);
       // }
  
      try {
        await submitSurveyResponse(submissionData);
        submitSuccess = true;
        window.scrollTo(0, 0); // Scroll to top to show success message
        // Reset form state after successful submission (optional)
        // currentStep = 0;
        // initializeFormData();
      } catch (err) {
         submitError = err.message || 'An unexpected error occurred during submission. Please check your inputs and try again.';
         console.error("Submission Failed:", err);
         window.scrollTo(0, 0); // Scroll to top to show error message
      } finally {
        isSubmitting = false;
      }
    }
  </script>
  
  {#if isLoading}
      <div class="spinner" aria-label="Loading survey questions..."></div>
  {:else if apiError}
      <Card>
          <div class="alert alert-error" role="alert">{apiError}</div>
      </Card>
  {:else if submitSuccess}
      <Card>
          <div class="alert alert-success text-center" role="alert">
              <h3>Thank You!</h3>
              <p>Your response has been submitted successfully.</p>
              <!-- Consider navigating away or disabling this button -->
              <Button class="mt-4" onClick={() => window.location.reload()}>Submit Another Response</Button>
          </div>
      </Card>
  {:else if questions.length > 0}
      <Card role="form" aria-label="Survey Form">
          {#if !isPreviewStep && currentQuestion}
              <!-- Progress Indicator -->
              <div class="progress-indicator mb-6" aria-live="polite">
                  Step {currentStep + 1} of {questions.length}: {currentQuestion.text}
                  <progress max={questions.length} value={currentStep + 1} aria-valuemin="1" aria-valuemax={questions.length} aria-valuenow={currentStep + 1} class="w-full"></progress>
              </div>
  
              <!-- Render the current question's form step -->
               {#key currentStep} <!-- Use key to force re-render on step change -->
                  <FormStep
                      question={currentQuestion}
                      bind:formData
                      bind:errors
                  />
               {/key}
  
          {:else if isPreviewStep}
              <!-- Render the preview step -->
              <PreviewStep {questions} {formData} />
               {#if submitError}
                   <div class="alert alert-error mt-4" role="alert">{submitError}</div>
               {/if}
          {/if}
  
          <!-- Navigation Buttons -->
          <div class="navigation-buttons flex justify-between items-center mt-8">
              {#if currentStep > 0}
                  <Button variant="secondary" on:click={prevStep} disabled={isSubmitting}>
                      Previous
                  </Button>
              {:else}
                  <!-- Provides space but is invisible and non-interactive -->
                  <span aria-hidden="true" style="display: inline-block; width: 0;"></span>
              {/if}
  
              {#if !isPreviewStep}
                   <Button variant="primary" on:click={nextStep} disabled={isSubmitting}>
                      {#if isLastQuestionStep}Review{:else}Next{/if}
                   </Button>
              {:else}
                  <Button type="submit" variant="primary" on:click={handleSubmit} disabled={isSubmitting} aria-live="polite">
                      {#if isSubmitting}
                          <span class="submitting-spinner" aria-hidden="true"></span> Submitting...
                      {:else}
                          Submit
                      {/if}
                  </Button>
              {/if}
          </div>
      </Card>
  {:else}
      <!-- Case where API returned successfully but questions array is empty -->
       <Card>
           <p class="text-center">No survey questions are currently available.</p>
       </Card>
  {/if}
  
  <style>
      .progress-indicator {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
      }
      progress {
          width: 100%;
          height: 8px;
          appearance: none;
          border: none;
          border-radius: var(--border-radius-lg);
          overflow: hidden; /* Needed for border-radius on track */
          margin-top: var(--spacing-2);
      }
      /* Track */
      progress::-webkit-progress-bar {
          background-color: var(--color-border);
          border-radius: var(--border-radius-lg);
      }
      /* Value */
      progress::-moz-progress-bar { /* Firefox */
          background-color: var(--color-accent-primary);
          border-radius: var(--border-radius-lg);
           transition: width 0.3s ease;
      }
       progress::-webkit-progress-value { /* Chrome, Safari, Edge */
          background-color: var(--color-accent-primary);
          border-radius: var(--border-radius-lg);
           transition: width 0.3s ease;
      }
  
      .navigation-buttons {
          border-top: 1px solid var(--color-border);
          padding-top: var(--spacing-6);
          & > span { flex-grow: 1; } /* Allows right button to align right */
      }
      .alert { /* Ensure alerts inside card are visible */
          margin-top: var(--spacing-4);
      }
  
      /* Basic spinner for submitting state */
      .submitting-spinner {
          display: inline-block;
          width: 1em;
          height: 1em;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin-right: var(--spacing-2);
          vertical-align: middle; /* Align with text */
          position: relative; /* Adjust position if needed */
          top: -0.1em;
      }
       /* Ensure spinner animation is defined if not globally */
       @keyframes spin {
         to { transform: rotate(360deg); }
       }
  
        /* Base spinner style if not global */
      .spinner {
        border: 4px solid rgba(var(--color-text-primary-rgb, 26, 32, 44), 0.1);
        border-left-color: var(--color-accent-primary);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: var(--spacing-8) auto;
      }
       .text-center { text-align: center; }
       .w-full { width: 100%; }
       .mb-6 { margin-bottom: var(--spacing-6); }
       .mt-4 { margin-top: var(--spacing-4); }
       .mt-8 { margin-top: var(--spacing-8); }
       .flex { display: flex; }
       .justify-between { justify-content: space-between; }
       .items-center { align-items: center; }
  </style>