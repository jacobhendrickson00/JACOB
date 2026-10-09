// Keep the menu toggle state in sync after navigating within the page.
document.querySelectorAll('.mobile-nav a').forEach(link=>link.addEventListener('click',()=>{
 document.querySelector('.mobile-nav').hidden=true;
 document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');
}));
