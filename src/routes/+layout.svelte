<script>
    import "../app.css"; // Import global styles
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";
    import { navigating } from '$app/stores'; // For loading indicator
    import { theme } from '$lib/stores/theme.js'; // Access theme store
    import { onMount } from 'svelte';
    
    // Mobile menu state
    let mobileMenuOpen = false;
    const toggleMobileMenu = () => {
        mobileMenuOpen = !mobileMenuOpen;
        // Prevent scrolling when menu is open
        if (mobileMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    };
    
    // Smooth scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    // Track scroll position for header effects
    let scrollY = 0;
    let headerCompact = false;
    
    onMount(() => {
        const handleScroll = () => {
            scrollY = window.pageYOffset;
            headerCompact = scrollY > 50;
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
    
    // Close mobile menu when route changes
    $: if ($navigating && mobileMenuOpen) {
        mobileMenuOpen = false;
        document.body.classList.remove('no-scroll');
    }
    
    // Get current year for footer
    const currentYear = new Date().getFullYear();
</script>

<!-- Global loading indicator -->
{#if $navigating}
    <div class="global-loading-indicator"></div>
{/if}

<div class="app-container theme-{$theme}">
    <header class="app-header {headerCompact ? 'compact' : ''}">
        <div class="header-content container flex justify-between items-center">
            <a href="/" class="logo">
                <span class="primary">Sky</span><span class="secondary">Survey</span>
            </a>
            
            <!-- Desktop Navigation -->
            <nav class="main-nav desktop-nav">
                <div class="nav-links flex items-center gap-6">
                    <a href="/" class="nav-link" aria-label="Take Survey">Take Survey</a>
                    <a href="/responses" class="nav-link" aria-label="View Responses">View Responses</a>
                    <ThemeToggle />
                </div>
            </nav>
            
            <!-- Mobile Menu Button -->
            <button class="mobile-menu-button" 
                    aria-label="Toggle menu" 
                    aria-expanded={mobileMenuOpen} 
                    on:click={toggleMobileMenu}>
                <span class="sr-only">Menu</span>
                <div class="hamburger {mobileMenuOpen ? 'active' : ''}">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
        </div>
        
        <!-- Mobile Navigation Overlay -->
        {#if mobileMenuOpen}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="mobile-nav-overlay" on:click={toggleMobileMenu}>
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <nav class="mobile-nav" on:click|stopPropagation>
                    <div class="mobile-nav-header">
                        <a href="/" class="logo">
                            <span class="primary">Sky</span><span class="secondary">Survey</span>
                        </a>
                        <button class="close-menu" on:click={toggleMobileMenu} aria-label="Close menu">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="mobile-nav-links">
                        <a href="/" class="mobile-nav-link" on:click={toggleMobileMenu}>Take Survey</a>
                        <a href="/responses" class="mobile-nav-link" on:click={toggleMobileMenu}>View Responses</a>
                        <div class="mobile-theme-toggle">
                            <p>Theme</p>
                            <ThemeToggle />
                        </div>
                    </div>
                </nav>
            </div>
        {/if}
    </header>

    <main class="main-content container fade-in" class:content-has-overlay={mobileMenuOpen}>
        <slot></slot> 
    </main>

    <footer class="app-footer">
       <div class="container">
           <div class="footer-grid">
               <div class="footer-section">
                   <h3 class="footer-heading">SkySurvey</h3>
                   <p class="footer-description">Exploring opinions that matter across the horizons of human experience.</p>
               </div>
               <div class="footer-section">
                   <h3 class="footer-heading">Quick Links</h3>
                   <ul class="footer-links">
                       <li><a href="/">Take Survey</a></li>
                       <li><a href="/responses">View Responses</a></li>
                   </ul>
               </div>
               <div class="footer-section">
                   <h3 class="footer-heading">Contact</h3>
                   <ul class="footer-links">
                       <li><a href="mailto:irecruitments@skyworld.co.ke">irecruitments@skyworld.co.ke</a></li>
                       <li><a href="tel:0712263989">0712263989</a></li>
                   </ul>
               </div>
           </div>
           <div class="footer-bottom">
               <p>© {currentYear} Sky World Limited. All rights reserved.</p>
               <button class="scroll-to-top" on:click={scrollToTop} aria-label="Scroll to top">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                       <polyline points="18 15 12 9 6 15"></polyline>
                   </svg>
               </button>
           </div>
       </div>
    </footer>
</div>

<style>
    /* Base container structure */
    .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    /* Header styles with transitions */
    .app-header {
        background-color: var(--color-bg-secondary);
        border-bottom: 1px solid var(--color-border);
        padding: var(--spacing-5) 0;
        position: sticky;
        top: 0;
        z-index: 100;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    /* Compact header on scroll */
    .app-header.compact {
        padding: var(--spacing-3) 0;
        background-color: var(--color-bg-primary);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border-bottom-color: var(--color-border);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

    /* Logo styling */
    .logo {
        font-size: 1.6rem;
        font-weight: 800;
        text-decoration: none;
        letter-spacing: -0.03em;
        display: flex;
        align-items: center;
        transition: transform 0.2s ease;
    }
    
    .logo:hover {
        transform: translateY(-1px);
    }
    
    .logo .primary {
        color: var(--color-accent-primary);
    }
    
    .logo .secondary {
        color: var(--color-text-primary);
    }

    /* Desktop Navigation */
    .main-nav {
        display: flex;
        align-items: center;
    }
    
    .nav-link {
        color: var(--color-text-secondary);
        text-decoration: none;
        font-weight: 600;
        padding: var(--spacing-2) var(--spacing-3);
        border-radius: var(--border-radius);
        position: relative;
        transition: all 0.2s ease-in-out;
    }
    
    .nav-link:hover {
        color: var(--color-accent-primary);
        background-color: var(--color-bg-hover);
    }
    
    /* Animated underline effect */
    .nav-link::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 6px;
        left: 50%;
        background-color: var(--color-accent-primary);
        transition: all 0.3s ease;
        opacity: 0;
    }
    
    .nav-link:hover::after {
        width: calc(100% - 1.5rem);
        left: 0.75rem;
        opacity: 1;
    }

    /* Mobile Menu Button */
    .mobile-menu-button {
        display: none;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: var(--spacing-2);
        z-index: 102;
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
    
    .hamburger {
        width: 24px;
        height: 20px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    .hamburger span {
        display: block;
        height: 2px;
        width: 100%;
        background-color: var(--color-text-primary);
        border-radius: 2px;
        transition: all 0.3s ease;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
    }

    /* Mobile Navigation Overlay */
    .mobile-nav-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 101;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        animation: fadeIn 0.3s ease;
    }
    
    .mobile-nav {
        width: 85%;
        max-width: 320px;
        height: 100%;
        background-color: var(--color-bg-primary);
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
        padding: var(--spacing-6);
        display: flex;
        flex-direction: column;
        animation: slideIn 0.3s ease;
        overflow-y: auto;
    }
    
    .mobile-nav-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-8);
    }
    
    .close-menu {
        background: transparent;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: var(--spacing-1);
        border-radius: var(--border-radius);
        transition: all 0.2s ease;
    }
    
    .close-menu:hover {
        color: var(--color-accent-primary);
        background-color: var(--color-bg-hover);
    }
    
    .mobile-nav-links {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
    }
    
    .mobile-nav-link {
        color: var(--color-text-primary);
        text-decoration: none;
        font-size: 1.25rem;
        font-weight: 600;
        padding: var(--spacing-3) var(--spacing-2);
        border-radius: var(--border-radius);
        transition: all 0.2s ease;
    }
    
    .mobile-nav-link:hover {
        background-color: var(--color-bg-hover);
        color: var(--color-accent-primary);
        padding-left: var(--spacing-4);
    }
    
    .mobile-theme-toggle {
        margin-top: var(--spacing-6);
        padding-top: var(--spacing-6);
        border-top: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    /* Content area */
    .main-content {
        flex-grow: 1;
        padding-top: var(--spacing-10);
        padding-bottom: var(--spacing-16);
        transition: opacity 0.3s ease;
    }
    
    .content-has-overlay {
        opacity: 0.4;
        pointer-events: none;
    }
    
    /* Enhanced Footer */
    .app-footer {
        background-color: var(--color-bg-secondary);
        border-top: 1px solid var(--color-border);
        padding: var(--spacing-10) 0 var(--spacing-6);
        margin-top: auto;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        transition: background-color 0.2s ease-in-out;
    }
    
    .footer-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: var(--spacing-10);
        margin-bottom: var(--spacing-8);
    }
    
    .footer-heading {
        font-weight: 600;
        margin-bottom: var(--spacing-4);
        color: var(--color-text-primary);
    }
    
    .footer-description {
        line-height: 1.6;
    }
    
    .footer-links {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
    }
    
    .footer-links a {
        color: var(--color-text-secondary);
        text-decoration: none;
        transition: color 0.2s ease;
    }
    
    .footer-links a:hover {
        color: var(--color-accent-primary);
    }
    
    .footer-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: var(--spacing-6);
        border-top: 1px solid var(--color-border);
    }
    
    /* Scroll to top button */
    .scroll-to-top {
        background-color: var(--color-bg-hover);
        color: var(--color-text-secondary);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .scroll-to-top:hover {
        background-color: var(--color-accent-primary);
        color: white;
        transform: translateY(-2px);
    }
    
    /* Loading indicator */
    .global-loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary));
        z-index: 9999;
        animation: loading-progress 1.5s infinite ease-in-out;
    }
    
    @keyframes loading-progress {
        0% { width: 0%; left: 0; }
        50% { width: 50%; left: 25%; }
        100% { width: 0%; left: 100%; }
    }
    
    /* Fade in animation */
    .fade-in {
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    /* Support no-scroll for body when mobile menu is open */
    :global(body.no-scroll) {
        overflow: hidden;
    }
    
    /* Container utilities */
    .container {
        width: 100%;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        padding-left: var(--spacing-6);
        padding-right: var(--spacing-6);
    }
    
    /* Utility classes */
    .flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .items-center { align-items: center; }
    .gap-6 { gap: var(--spacing-6); }
    
    /* Responsive styles */
    @media (max-width: 1024px) {
        .container {
            max-width: 90%;
        }
        
        .footer-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
    
    @media (max-width: 768px) {
        .desktop-nav {
            display: none;
        }
        
        .mobile-menu-button {
            display: block;
        }
        
        .footer-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-8);
        }
        
        .app-header {
            padding: var(--spacing-4) 0;
        }
        
        .logo {
            font-size: 1.4rem;
        }
        
        .main-content {
            padding-top: var(--spacing-8);
            padding-bottom: var(--spacing-12);
        }
        
        .container {
            padding-left: var(--spacing-4);
            padding-right: var(--spacing-4);
        }
    }
    
    @media (max-width: 480px) {
        .footer-bottom {
            flex-direction: column;
            gap: var(--spacing-4);
            text-align: center;
        }
        
        .app-header.compact {
            padding: var(--spacing-2) 0;
        }
        
        .container {
            padding-left: var(--spacing-3);
            padding-right: var(--spacing-3);
        }
    }
</style>