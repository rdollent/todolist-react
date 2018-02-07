(function () {
   const navHamburger = document.getElementsByClassName("nav-hamburger")[0],
        navMenu = document.getElementsByClassName("nav-menu")[0],
        nav = document.getElementsByClassName("nav")[0];

        
   navHamburger.addEventListener("click", function() {
      if(navMenu.classList.contains("no-display")) {
         navMenu.classList.remove("no-display");
         nav.classList.add("nav-height");
      } else {
         navMenu.classList.add("no-display");
         nav.classList.remove("nav-height");
      }
       
   });
})();