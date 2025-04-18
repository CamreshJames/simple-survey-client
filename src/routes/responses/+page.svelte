<script>
    import { onMount } from 'svelte';
    import { fetchResponses, getCertificateDownloadUrl } from '$lib/utils/api.js';
    import Card from '$lib/components/Card.svelte';
    import Button from '$lib/components/Button.svelte';
    import Input from '$lib/components/Input.svelte';
    import ResponseCard from '$lib/components/ResponseCard.svelte';
    import Pagination from '$lib/components/Pagination.svelte';

    /** @type {App.QuestionResponseList | null} */
    let responseData = null;
    let isLoading = false;
    let apiError = '';
    let emailFilter = '';
    let currentPage = 1;
    const pageSize = 10;
    let isFiltering = false;
    
    // New variables to store all responses and filtered results
    let allResponses = [];
    let filteredResponses = [];
    
    // Security code implementation
    let securityCode = '';
    let isAuthenticated = false;
    const CORRECT_CODE = 'Responses';
    let securityAttempts = 0;
    let securityError = '';
    const AUTH_STORAGE_KEY = 'survey_auth_status';
    const AUTH_EXPIRY_KEY = 'survey_auth_expiry';
    const AUTH_EXPIRY_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

    function verifySecurityCode() {
        securityAttempts++;
        if (securityCode === CORRECT_CODE) {
            isAuthenticated = true;
            securityError = '';
            
            // Save authentication to localStorage with expiry
            const expiryTime = Date.now() + AUTH_EXPIRY_DURATION;
            localStorage.setItem(AUTH_STORAGE_KEY, 'true');
            localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());
            
            loadResponses(1);
        } else {
            securityError = `Invalid security code. Please try again. (Attempt ${securityAttempts}/5)`;
            if (securityAttempts >= 5) {
                securityError = 'Too many failed attempts. Please contact the administrator.';
            }
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            verifySecurityCode();
        }
    }

    function checkStoredAuthentication() {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        const expiryTime = localStorage.getItem(AUTH_EXPIRY_KEY);
        
        if (storedAuth === 'true' && expiryTime) {
            // Check if the authentication has expired
            if (Date.now() < parseInt(expiryTime)) {
                isAuthenticated = true;
                return true;
            } else {
                // Clear expired authentication
                localStorage.removeItem(AUTH_STORAGE_KEY);
                localStorage.removeItem(AUTH_EXPIRY_KEY);
            }
        }
        return false;
    }
    
    function logout() {
        // Clear authentication from localStorage
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_EXPIRY_KEY);
        
        // Reset state variables
        isAuthenticated = false;
        securityCode = '';
        securityAttempts = 0;
        securityError = '';
        responseData = null;
        emailFilter = '';
        apiError = '';
        allResponses = [];
        filteredResponses = [];
    }

    async function loadResponses(page = 1) {
        if (!isAuthenticated) return;
        
        isLoading = true;
        apiError = '';
        
        try {
            // Load all responses without server-side filtering
            responseData = await fetchResponses(page, pageSize, null);
            currentPage = responseData.current_page;
            
            // Store all responses for client-side filtering
            allResponses = responseData.question_response;
            
            // Apply any existing filter
            applyFilter();
        } catch (err) {
            apiError = err.message || 'Failed to load responses.';
            console.error("Error fetching responses:", err);
            responseData = null;
            allResponses = [];
            filteredResponses = [];
        } finally {
            isLoading = false;
        }
    }

    // Apply client-side filtering
    function applyFilter() {
        if (!emailFilter.trim()) {
            // If no filter, show all responses
            filteredResponses = [...allResponses];
            isFiltering = false;
        } else {
            // Apply filter to show only matching emails
            const searchTerm = emailFilter.trim().toLowerCase();
            filteredResponses = allResponses.filter(response => 
                response.email && response.email.toLowerCase().includes(searchTerm)
            );
            isFiltering = true;
        }
        
        // Update the response data for display
        if (responseData) {
            responseData = {
                ...responseData,
                question_response: filteredResponses,
                total_count: filteredResponses.length
            };
        }
        
        // Handle no results for filtered data
        if (isFiltering && filteredResponses.length === 0) {
            apiError = `No responses found for email: "${emailFilter}"`;
        } else {
            apiError = '';
        }
    }

    onMount(() => {
        // Check for stored authentication on page load
        if (checkStoredAuthentication()) {
            loadResponses(currentPage);
        }
    });

    function handlePageChange(event) {
        const newPage = event.detail.page;
        if (newPage !== currentPage) {
            loadResponses(newPage);
        }
    }

    let filterTimeout;
    function handleFilterInput() {
        clearTimeout(filterTimeout);
        
        filterTimeout = setTimeout(() => {
            applyFilter();
        }, 300);
    }

    function clearFilter() {
        emailFilter = '';
        apiError = '';
        applyFilter();
    }

    function handleFilterKeyPress(event) {
        if (event.key === 'Enter') {
            clearTimeout(filterTimeout);
            applyFilter();
        }
    }
</script>

<svelte:head>
    <title>Survey Responses</title>
    <meta name="description" content="View submitted survey responses" />
</svelte:head>

<div class="container">
    <h1>Survey Responses</h1>
    
    {#if !isAuthenticated}
        <Card class="security-gate">
            <h2>Privacy Protection</h2>
            <p>Due to privacy laws and data protection regulations, you must verify your authorization to access this information.</p>
            
            <div class="security-form">
                <Input
                    name="securityCode"
                    label="Security Code"
                    placeholder="Enter security code..."
                    bind:value={securityCode}
                    type="password"
                    on:keypress={handleKeyPress}
                />
                
                <Button on:click={verifySecurityCode}>Verify Access</Button>
                
                {#if securityError}
                    <div class="error-message">{securityError}</div>
                {/if}
                <p class="hint">For testing: The security code is "Responses"</p>
            </div>
        </Card>
    {:else}
        <div class="header-controls">
            <h2>Survey Responses</h2>
            <Button variant="secondary" on:click={logout} class="logout-button">Log Out</Button>
        </div>
        
        <Card class="mb-6">
            <div class="filter-controls flex items-center gap-4">
                <div class="flex-grow">
                    <Input
                        name="emailFilter"
                        label="Filter by Email Address"
                        placeholder="Enter email to filter responses..."
                        bind:value={emailFilter}
                        on:input={handleFilterInput}
                        on:keypress={handleFilterKeyPress}
                    />
                    <label for="emailFilter" class="sr-only">Filter by Email Address</label>
                </div>
                <Button variant="secondary" on:click={clearFilter}>Clear Filter</Button>
            </div>
            {#if isFiltering}
                <div class="filter-indicator">
                    Currently filtering by: "{emailFilter}"
                    {#if filteredResponses.length > 0}
                        <span class="result-count">({filteredResponses.length} results found)</span>
                    {/if}
                </div>
            {/if}
        </Card>

        {#if isLoading}
            <div class="spinner">Loading...</div>
        {:else if apiError}
            <Card>
                <div class="alert alert-error">
                    <p>{apiError}</p>
                    {#if emailFilter}
                        <Button variant="link" on:click={clearFilter}>Clear filter and show all responses</Button>
                    {/if}
                </div>
            </Card>
        {:else if responseData && responseData.question_response.length > 0}
            <div class="response-list">
                {#each responseData.question_response as response (response.response_id)}
                    <ResponseCard {response} />
                {/each}
            </div>

            {#if !isFiltering && responseData.last_page > 1}
                <Pagination
                    currentPage={responseData.current_page}
                    lastPage={responseData.last_page}
                    totalCount={responseData.total_count}
                    pageSize={responseData.page_size}
                    on:pageChange={handlePageChange}
                />
            {/if}
        {:else if responseData && responseData.question_response.length === 0}
            <Card>
                <p class="text-center">No responses found.</p>
                {#if isFiltering}
                    <p class="text-center">Your filter "{emailFilter}" returned no results.</p>
                    <div class="flex justify-center mt-4">
                        <Button variant="primary" on:click={clearFilter}>Clear Filter</Button>
                    </div>
                {/if}
            </Card>
        {/if}
    {/if}
</div>

<style>
    .response-list {
        display: grid;
        gap: var(--spacing-6);
        margin-bottom: var(--spacing-8);
    }
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
    .filter-controls {
        margin-bottom: var(--spacing-4);
    }
    .filter-controls :global(.form-group) {
        margin-bottom: 0;
    }
    .text-center {
        text-align: center;
    }
    .security-form {
        margin-top: var(--spacing-6);
    }
    .error-message {
        color: var(--color-error);
        margin-top: var(--spacing-3);
        font-weight: 500;
    }
    .hint {
        font-size: 0.85rem;
        color: var(--color-text-light);
        margin-top: var(--spacing-4);
        text-align: center;
    }
    .spinner {
        text-align: center;
        padding: var(--spacing-6);
        color: var(--color-primary);
    }
    .alert {
        padding: var(--spacing-4);
        border-radius: var(--radius-md);
    }
    .alert-error {
        background-color: var(--color-error-bg);
        color: var(--color-error);
    }
    .flex {
        display: flex;
    }
    .items-center {
        align-items: center;
    }
    .gap-4 {
        gap: var(--spacing-4);
    }
    .flex-grow {
        flex-grow: 1;
    }
    .justify-center {
        justify-content: center;
    }
    .mt-4 {
        margin-top: var(--spacing-4);
    }
    .header-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-4);
    }
    .filter-indicator {
        margin-top: var(--spacing-2);
        font-size: 0.9rem;
        color: var(--color-primary);
        font-style: italic;
    }
    .result-count {
        font-weight: 500;
    }
</style>