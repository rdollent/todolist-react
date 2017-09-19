(function() {
    
    var calendar = document.getElementsByClassName("calendar")[0];
    var completeDate = {};

    var yearObj = {};
    yearObj.list = [];
    for(var i = new Date().getFullYear(); i <= new Date().getFullYear() + 5; i++) {
        yearObj.list.push(i);
    }
    yearObj.createYears = function() {
        var main = document.createElement("div");
        this.list.forEach(function(year) {
            var elem = document.createElement("div");
            elem.textContent = year;
            elem.addEventListener("click", function() {
                main.classList.add("noDisplay");
                monthObj.createList();
                completeDate.year = parseInt(this.textContent);
            });
            main.appendChild(elem);
        });
        calendar.appendChild(main);
    };
    yearObj.createYears();
    
    var monthObj = {};
    monthObj.list = {};
    var months = ["January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "October", "November", "December"];
    monthObj.createList = function() {
        var main = document.createElement("div");
        for(var i = 0; i <= 11; i++) {
            this.list[i] = months[i];
            var elem = document.createElement("div");
            elem.textContent = this.list[i];
            elem.addEventListener("click", function() {
                main.classList.add("noDisplay");
                completeDate.month = months.indexOf(this.textContent);
                console.log(completeDate);
                // dateObj.createList();
                // var maxDates = new Date(completeDate.year, completeDate.month + 1, 0).getDate();
        
                completeDate.maxDates = new Date(completeDate.year, completeDate.month + 1, 0).getDate();
                console.log(completeDate);
                createDayAndDate();
                
            });
            main.appendChild(elem);  
        }
        calendar.appendChild(main);
    };
    
    function createDayAndDate() {
        if(document.getElementById("container")) {
            calendar.removeChild(document.getElementById("container"));
        }
        
        var dateObj = {};
        dateObj.days = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
        };
        completeDate.firstDay = new Date(completeDate.year, completeDate.month, 1).getDay();
        
        var title = document.createElement("p");
        title.innerHTML = "<h2>" + months[completeDate.month] + " " + completeDate.year + "</h2>";
        
        
        var tbl = document.createElement("table");
        var colgrp = document.createElement("colgroup");
        colgrp.span = 7;
        tbl.appendChild(colgrp);
        
        // populate table with day headers
        var tr = document.createElement("tr");
        for(var i = 0; i <= 6; i++) {
            var th = document.createElement("th");
            th.textContent = dateObj.days[i];
            tr.appendChild(th);
        }
        tbl.appendChild(tr);
        

        // populate table with dates
        var j = 1;
        while(j  <= completeDate.maxDates) {
            var tr = document.createElement("tr");
            var k = 0;
            while(k <= 6) {
                // console.log(j, dateObj.days[k] + ": " + k);
                var td = document.createElement("td");
                if(j === 1) {
                    if(k !== completeDate.firstDay) {
                        td.textContent = "empty";
                    } else {
                        td.textContent = j;
                        j++;
                    }
                } else if(j > completeDate.maxDates) {
                    td.textContent = "empty";
                    j++;
                } else {
                    td.textContent = j;
                    j++;
                }
                k++;
                tr.appendChild(td);
            }
            tbl.appendChild(tr);
        }
        
        var container = document.createElement("div");
        container.id = "container";
        container.appendChild(title);
        container.appendChild(tbl);
        calendar.appendChild(container);
        
        if(!document.getElementsByClassName("btns")[0]) {
            createBtns();
        }
        
        

    }
    
    function createBtns() {
        var prev = document.createElement("button");
        prev.textContent = "<-";
        prev.addEventListener("click", function() {
            if(completeDate.month === 0) {
                completeDate.year = completeDate.year - 1;
                completeDate.month = 11;
                completeDate.maxDates = new Date(completeDate.year, 0, 0).getDate();
            } else {
                completeDate.month = completeDate.month - 1;
                completeDate.maxDates = new Date(completeDate.year, completeDate.month + 1, 0).getDate();
            }
            createDayAndDate();
            
            
        });
        var nxt = document.createElement("button");
        nxt.textContent = "->";
        nxt.addEventListener("click", function() {
            if(completeDate.month === 11) {
                completeDate.year = completeDate.year + 1;
                completeDate.month = 0;
                completeDate.maxDates = new Date(completeDate.year, 1, 0).getDate();
            } else {
                completeDate.month = completeDate.month + 1;
                completeDate.maxDates = new Date(completeDate.year, completeDate.month + 1, 0).getDate();
            }
            createDayAndDate();
            
        });
        
        var btns = document.createElement("div");
        btns.classList.add("btns");
        btns.appendChild(prev);
        btns.appendChild(nxt);
        calendar.prepend(btns);
    }
    
    function deleteCalendar() {
        
    }
    
    
    // generate how many days
    // month is 0-based
    // generate table for days
    
    
    
    
    
    
    
    
    
    
    
    

    
  
    
    
    
    
})();