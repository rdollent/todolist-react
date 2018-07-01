(function () {
   const navHamburger = document.querySelector(".nav-hamburger"),
        navMenu = document.querySelector(".nav-menu"),
        navMenuAs = document.querySelectorAll(".nav-menu-a"),
        main = document.querySelector(".main");
   
        
   navHamburger.addEventListener("click", function() {
      const menuClosed = navMenu.classList.contains("no-display") === true;
      
      if(menuClosed) {
         navMenu.classList.remove("no-display");
      } else {
         navMenu.classList.add("no-display");
      }
      
      // make background blurry/bright/light and immune to pointer events
      // select body and all but not nav and all its children
      const allDiv = Array.from(document.querySelectorAll(".main > *:not(.nav)")),
         selectNoneOff = allDiv.filter((elem) => elem.classList.contains("select-none")).length === 0;
      
      if(selectNoneOff) {
         allDiv.forEach((elem) => { elem.classList.add("select-none") });
      } else {
         allDiv.forEach((elem) => { elem.classList.remove("select-none") });
      }
      // you can use forEach on a Nodelist
      
   });
   
   if(window.innerWidth < 1280) {
      // navMenu.classList.add("nav-menu-mobile");
      // navMenuAs.forEach((entry) => entry.classList.remove("nav-menu-a-desktop"));
      // navMenuAs.forEach((entry) => entry.classList.add("nav-menu-a"));
      navMenu.classList.add("no-display");
   }
   
   window.addEventListener("resize", () => {
      if(window.innerWidth < 1280) {
         navMenu.classList.add("no-display");
         // navMenu.classList.add("nav-menu-mobile");
         // navMenuAs.forEach((entry) => entry.classList.remove("nav-menu-a-desktop"));
         // navMenuAs.forEach((entry) => entry.classList.add("nav-menu-a-mobile"));
      } else if(window.innerWidth >= 1280) {
         navMenu.classList.remove("no-display");
         const allDiv = document.querySelectorAll(".main > *:not(.nav)");
         // you can use forEach on a Nodelist
         allDiv.forEach(function(elem) {
             elem.classList.remove("select-none");
         });
      }
   });

})();