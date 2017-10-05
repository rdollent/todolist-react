(function() {
    "use strict";
    // todos variable is passed on from index.ejs
    var calendar = document.getElementById("calendar");
    var completeDate = {};
    var yearObj = {};
    yearObj.list = [];
    for(var i = new Date().getFullYear(); i <= 2099; i++) {
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
    var monthArr = ["January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "October", "November", "December"];
    monthObj.createList = function() {
        var main = document.createElement("div");
        for(var i = 0; i <= 11; i++) {
            this.list[i] = monthArr[i];
            var elem = document.createElement("div");
            elem.textContent = this.list[i];
            elem.addEventListener("click", function() {
                main.classList.add("noDisplay");
                completeDate.month = monthArr.indexOf(this.textContent);
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
            0: "Sun",
            1: "Mon",
            2: "Tue",
            3: "Wed",
            4: "Thu",
            5: "Fri",
            6: "Sat"
        };
        completeDate.firstDay = new Date(completeDate.year, completeDate.month, 1).getDay();
        
        var title = document.createElement("p");
        title.innerHTML = "<h2>" + monthArr[completeDate.month] + " " + completeDate.year + "</h2>";
        title.id = "title";
        
        
        var tbl = document.createElement("table");
        tbl.id = "tbl";
        tbl.classList.add("container-fluid");
        var colgrp = document.createElement("colgroup");
        colgrp.span = 7;
        tbl.appendChild(colgrp);
        
        // populate table with day headers
        var trDays = document.createElement("tr");
        trDays.classList.add("row");
        for(var i = 0; i <= 6; i++) {
            var th = document.createElement("th");
            th.classList.add("col");
            th.textContent = dateObj.days[i];
            trDays.appendChild(th);
        }
        tbl.appendChild(trDays);
        

        // populate table with dates
        var j = 1;
        while(j  <= completeDate.maxDates) {
            var trDates = document.createElement("tr");
            trDates.classList.add("row");
            // k represents days of the week
            var k = 0;
            while(k <= 6) {
                // console.log(j, dateObj.days[k] + ": " + k);
                var td = document.createElement("td");
                td.classList.add("col");
                var a = document.createElement("a");
                a.addEventListener("click", showTodos);
                if(j === 1 && k !== completeDate.firstDay) {
                    j--;
                }
                if(j > 0 && j <= completeDate.maxDates) {
                    a.textContent = j;
                }
                // populate dates with todo titles
                for(var i=0; i <= todos.length -1; i++) {
                    if(todos[i].year === completeDate.year && todos[i].month === completeDate.month && todos[i].date === j) {
                        var p = document.createElement("p");
                        p.textContent = todos[i].title;
                        a.appendChild(p);
                    }
                }
                j++;
                k++;
                td.appendChild(a);
                trDates.appendChild(td);
            }
            tbl.appendChild(trDates);
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
    
    function showTodos() {
        // console.log(this.textContent);
        completeDate.date = parseInt(this.childNodes[0].nodeValue);
        var tbl = document.getElementById("tbl");
        tbl.classList.add("noDisplay");
        var title = document.getElementById("title");
        title.innerHTML = "<h2>" + monthArr[completeDate.month] + " " + completeDate.date + ", " + completeDate.year + "</h2>";
        
        // var xhttp = new XMLHttpRequest();
        // var url = "https://to-do-list-rdollent.c9users.io/todo/" + completeDate.year + "-" + completeDate.month + "-" + completeDate.date;
        // xhttp.open("GET", url, true);
        
        // todos variable is passed on through index.ejs
        for(var i = 0; i <= todos.length - 1; i++) {
            if(todos[i].year === completeDate.year && todos[i].month === completeDate.month && todos[i].date === completeDate.date) {
                var div = document.createElement("div");
                var a = document.createElement("a");
                a.setAttribute("href", "/todo/" + todos[i]._id);
                a.textContent = todos[i].title + " - " + todos[i].description;
                div.appendChild(a);
                calendar.appendChild(div);
            }
        }
    }
    
    
    // generate how many days
    // month is 0-based
    // generate table for days
    
    
    
    
    
    
    
    
    
    
    
    

    
  
    
    
    
    
})();