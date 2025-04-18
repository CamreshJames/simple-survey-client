<script>
    import Card from './Card.svelte';
    import Button from './Button.svelte';
    import { getCertificateDownloadUrl } from '$lib/utils/api.js';

    /** @type {App.QuestionResponseItem} */
    export let response;

    $: formattedStack = response.programming_stack ? response.programming_stack.split(',').join(', ') : 'N/A';

     function downloadCert(id, filename) {
         const url = getCertificateDownloadUrl(id);

          const link = document.createElement('a');
          link.href = url;
          link.download = filename || `certificate-${id}.pdf`; 
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
     }
</script>

<Card class="response-card">
    <div class="response-header flex justify-between items-start mb-4">
         <h3 class="response-name">{response.full_name}</h3>
         <span class="response-date">{response.date_responded}</span>
    </div>
     <p class="response-email mb-2"><a href="mailto:{response.email_address}">{response.email_address}</a></p>
     <p class="response-gender mb-4"><strong>Gender:</strong> {response.gender || 'N/A'}</p>

    <div class="response-details mb-4">
        <strong class="block mb-1">Description:</strong>
        <p class="response-description">{response.description || 'N/A'}</p>
    </div>

    <div class="response-details mb-4">
         <strong class="block mb-1">Programming Stack:</strong>
         <p>{formattedStack}</p>
    </div>

    {#if response.certificates && response.certificates.certificate.length > 0}
        <div class="response-certificates">
            <strong class="block mb-2">Certificates:</strong>
            <ul class="certificate-list">
                {#each response.certificates.certificate as cert (cert.id)}
                    <li>
                       <button class="link-button" on:click={() => downloadCert(cert.id, cert.text)}>
                           {cert.text} <span class="download-icon">⬇️</span>
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</Card>

<style>
    .response-name {
        font-size: 1.3rem;
        margin-bottom: 0; /* Override default heading margin */
        color: var(--color-accent-primary);
    }
    .response-date {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
        white-space: nowrap;
        margin-left: var(--spacing-4);
    }
    .response-email {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
    }
    .response-email a {
        color: inherit; /* Inherit secondary color */
        text-decoration: none;
    }
    .response-email a:hover {
        color: var(--color-accent-primary);
        text-decoration: underline;
    }
    .response-gender, .response-details {
        font-size: 0.95rem;
    }
     .response-description {
        white-space: pre-wrap; /* Preserve line breaks in description */
        background-color: var(--color-bg-primary); /* Slightly different background */
        padding: var(--spacing-3);
        border-radius: var(--border-radius-sm);
        border: 1px solid var(--color-border);
     }
    .response-certificates {
        margin-top: var(--spacing-4);
        padding: var(--spacing-3);
        background-color: var(--color-bg-secondary); /* Different background for certificates */
        border-radius: var(--border-radius-sm);
        border: 1px solid var(--color-border);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    }
    .certificate-list {
        list-style: none;
        padding-left: 0;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
    }
    .certificate-list li {
        /* Styles for list items */
        display: flex;
    }
     .link-button {
         background: none;
         border: none;
         padding: 0;
         font: inherit;
         color: var(--color-accent-primary);
         cursor: pointer;
         text-align: left;
     }
     .link-button:hover {
         text-decoration: underline;
         color: var(--color-accent-primary-hover);
     }
     .download-icon {
         display: inline-block;
         margin-left: var(--spacing-1);
         font-size: 0.9em;
     }
     .block { display: block; }
     .mb-1 { margin-bottom: var(--spacing-1); }
     .mb-2 { margin-bottom: var(--spacing-2); }
     .mb-4 { margin-bottom: var(--spacing-4); }
</style>