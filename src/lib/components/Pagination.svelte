<script>
    import Button from './Button.svelte';
  
    export let currentPage;
    export let lastPage;
    export let pageSize;
    export let totalCount;
  
    // Svelte's createEventDispatcher allows emitting events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  
    function goToPage(page) {
      if (page >= 1 && page <= lastPage && page !== currentPage) {
        dispatch('pageChange', { page });
      }
    }
  
    $: startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    $: endItem = totalCount > 0 ? Math.min(currentPage * pageSize, totalCount) : 0;
  </script>
  
  {#if lastPage > 1}
    <nav class="pagination flex justify-between items-center mt-8" aria-label="Pagination">
      <div class="pagination-info">
           {#if totalCount > 0}
              Showing {startItem} to {endItem} of {totalCount} results
           {:else}
              No results
           {/if}
      </div>
      <div class="pagination-controls flex gap-2">
        <Button
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={currentPage >= lastPage}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  {/if}
  
  <style>
    .pagination {
      border-top: 1px solid var(--color-border);
      padding-top: var(--spacing-4);
    }
    .pagination-info {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
    }
    /* Adjust button padding if needed */
     .pagination-controls :global(.btn) {
         padding: var(--spacing-2) var(--spacing-4);
     }
  </style>