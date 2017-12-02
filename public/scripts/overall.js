(function () {
   const navHamburger = document.getElementsByClassName("nav-hamburger")[0],
        navMenu = document.getElementsByClassName("nav-menu")[0],
        nav = document.getElementsByClassName("nav")[0];

        
   navHamburger.addEventListener("click", function() {
      if(navMenu.classList.contains("noDisplay")) {
         navMenu.classList.remove("noDisplay");
         nav.classList.add("nav-height");
      } else {
         navMenu.classList.add("noDisplay");
         nav.classList.remove("nav-height");
      }
       
   });
})();