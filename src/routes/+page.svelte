<script>
	import SurveyForm from '$lib/components/SurveyForm.svelte';
</script>

<svelte:head>
	<title>SkySurvey - Share Your Thoughts</title>
	<meta name="description" content="Complete the SkySurvey and help us understand better." />
</svelte:head>

<main class="survey-page">
	<div class="survey-container">
		<header class="survey-header">
			<h1>SkySurvey Form</h1>
			<p class="subtitle">
				We appreciate you taking the time to share your thoughts. Please answer the questions below.
			</p>
		</header>

		<SurveyForm />

	</div>
</main>

<style>
    
    .survey-page {
        padding: var(--spacing-8);
        display: flex;
        justify-content: center;
        min-height: 100vh;
        box-sizing: border-box;
    }

    .survey-container {
        background-color: var(--color-surface);
        padding: var(--spacing-8) var(--spacing-12);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        max-width: 768px;
        width: 100%;
        margin: auto 0;
        box-sizing: border-box;
    }

    .survey-header {
        text-align: center;
        margin-bottom: var(--spacing-8);
        border-bottom: 1px solid #eee;
        padding-bottom: var(--spacing-6);
    }

    h1 {
        color: var(--color-heading);
        font-size: 2.25em;
        font-weight: 600;
        margin: 0 0 var(--spacing-2) 0;
    }

    .subtitle {
        color: var(--color-text-secondary);
        font-size: 1.1em;
        margin-bottom: 0;
        max-width: 60ch;
        margin-left: auto;
        margin-right: auto;
    }

    :global(.survey-form) { /* Target component's root if needed */
       margin-top: var(--spacing-6);
    }

    /* Responsive adjustments */
    @media (max-width: 600px) {
        .survey-page {
            padding: var(--spacing-4);
        }
        .survey-container {
            padding: var(--spacing-6);
        }
        h1 {
            font-size: 1.8em;
        }
        .subtitle {
            font-size: 1em;
        }
    }
</style>