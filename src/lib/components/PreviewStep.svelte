<script>
    /** @type {App.Question[]} */
    export let questions = [];
    /** @type {Record<string, any>} */
    export let formData = {};

    function getDisplayValue(question, value) {
        if (value === undefined || value === null || value === '') return 'N/A';

        if (question.type === 'choice' && question.options?.multiple === 'yes') {
            if (!Array.isArray(value) || value.length === 0) return 'N/A';
            // Map values back to text labels for display
            const labels = value.map(v => question.options.option.find(opt => opt.value === v)?.text || v);
            return labels.join(', ');
        }

        if (question.type === 'choice' && question.options?.multiple === 'no') {
             // Map value back to text label
             return question.options.option.find(opt => opt.value === value)?.text || value;
        }

         if (question.type === 'file') {
            if (value instanceof FileList && value.length > 0) {
                return Array.from(value).map(f => f.name).join(', ');
            }
             return 'No files selected';
         }

         // For text, email, long_text
         return value;
    }
</script>

<div class="preview-step">
    <h3>Review Your Answers</h3>
    {#each questions as question (question.name)}
        <div class="preview-item">
            <strong class="preview-label">{question.text}</strong>
            <div class="preview-value">
                {getDisplayValue(question, formData[question.name])}
            </div>
        </div>
    {/each}
</div>

<style>
    .preview-step {
        margin-bottom: var(--spacing-8);
    }
    .preview-item {
        margin-bottom: var(--spacing-4);
        padding-bottom: var(--spacing-4);
        border-bottom: 1px solid var(--color-border);
    }
     .preview-item:last-child {
         border-bottom: none;
         margin-bottom: 0;
         padding-bottom: 0;
     }
    .preview-label {
        display: block;
        font-weight: 500;
        margin-bottom: var(--spacing-2);
        color: var(--color-text-secondary);
    }
    .preview-value {
        font-size: 1rem;
        word-break: break-word; /* Prevent long strings from overflowing */
    }
</style>