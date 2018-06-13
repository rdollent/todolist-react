(function () {
   const navHamburger = document.querySelector(".nav-hamburger"),
        navMenu = document.querySelector(".nav-menu"),
        navMenuAs = document.querySelectorAll(".nav-menu-a");
        
   navHamburger.addEventListener("click", function() {
      if(navMenu.classList.contains("no-display")) {
         navMenu.classList.remove("no-display");
      } else {
         navMenu.classList.add("no-display");
      }
      
      
      // make background blurry/bright/light and immune to pointer events
      // select body and all but not nav and all its children
      const allDiv = document.querySelectorAll("body > *:not(.nav)");
      // you can use forEach on a Nodelist
      console.log("hi");
      allDiv.forEach(function(elem) {
          elem.classList.toggle("select-none");
      });
   });
   
   if(window.innerWidth < 768) {
      // navMenu.classList.add("nav-menu-mobile");
      // navMenuAs.forEach((entry) => entry.classList.remove("nav-menu-a-desktop"));
      // navMenuAs.forEach((entry) => entry.classList.add("nav-menu-a"));
      navMenu.classList.add("no-display");
   }
   
   window.addEventListener("resize", () => {
      if(window.innerWidth < 768) {
         // navMenu.classList.add("nav-menu-mobile");
         // navMenuAs.forEach((entry) => entry.classList.remove("nav-menu-a-desktop"));
         // navMenuAs.forEach((entry) => entry.classList.add("nav-menu-a-mobile"));
      } else if(window.innerWidth >= 768) {
         navMenu.classList.remove("no-display");
      }
   });

})();