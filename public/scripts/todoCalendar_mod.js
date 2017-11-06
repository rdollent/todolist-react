"use strict";

(function() {
    const fullDate = {},
        monthList = { 
            0: "January",
            1: "February",
            2: "March",
            3: "April", 
            4: "May",
            5: "June",
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December"
        },
        dayList = {0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat"};
        
    function runOnPageLoad() {
        const calendar = getId("calendar");
        fullDate.year = new Date().getFullYear();
        fullDate.month = new Date().getMonth();
        fullDate.date = new Date().getDate();
        fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
        makePeriodSelectBtns(calendar);
        makeDayAndDate(calendar);
    }
    
    function getId(input) {
        return document.getElementById(input);
    }
    
    function makeElem(input) {
        return document.createElement(input);
    }
    // populate Year OR Month list
    // need to start createList when pressing button to allow functions to run!
    function createList(input) {
        const main = makeElem("div"),
            calendar = getId("calendar"), //async
            frag = document.createDocumentFragment(); //append generated elems here then to main
        main.id = input + "List";
        let i, start, end, value, clicked;
        if(input === "year") {
            start = 2000, end = 2099, value = function() { return i }, clicked = yearClicked;
        }
        if(input === "month") {
            start = 0, end = 11, value = function() { return monthList[i] }, clicked = monthClicked;
        }
        for(i = start; i <= end; i++) {
            let elem = makeElem("div");
            elem.textContent = value();
            elem.setAttribute("data-" + input, i);
            elem.addEventListener("click", clicked);
            frag.appendChild(elem);  
        }
        main.appendChild(frag);
        calendar.appendChild(main);
    }
    
    function yearClicked() {
        const yearList = getId("yearList"),
            monthList = getId("monthList"),
            periodSelect = getId("periodSelect");
        yearList.classList.add("noDisplay");
        if(monthList) {
            monthList.classList.remove("noDisplay");
        }
        if(periodSelect) {
            periodSelect.classList.remove("noDisplay");
            periodSelect.textContent = "year";
        }
        fullDate.year = parseInt(this.textContent);
    }
    
    function monthClicked() {
        const monthList = getId("monthList"),
            calendar = getId("calendar"),
            btns = getId("btns");
        monthList.classList.add("noDisplay");
        btns.classList.remove("noDisplay");
        fullDate.month = parseInt(this.getAttribute("data-month"));
        fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
        getId("periodSelect").textContent = "month";
        makeDayAndDate(calendar);
    }
    
    function makeTitleHeader() {
        const p = makeElem("p");
        p.innerHTML = "<h2>" + monthList[fullDate.month] + " " + fullDate.year + "</h2>";
        p.id = "title";
        return p;
    }
    
    function makeDayHeader() {
        const trDays = makeElem("tr");
        trDays.classList.add("row");
        // populate table with day headers
        for(let i = 0; i <= 6; i++) {
            const th = makeElem("th");
            th.classList.add("col");
            // dayList is global variable
            th.textContent = dayList[i];
            trDays.appendChild(th);
        }
        return trDays;
    }
    
    function makeTbl() {
        const tbl = makeElem("table"),
            colgrp = makeElem("colgroup"),
            trDays = makeDayHeader();
        tbl.id = "tbl";
        tbl.classList.add("container-fluid");
        colgrp.span = 7;
        tbl.appendChild(colgrp);
        tbl.appendChild(trDays);
        return tbl;
    }
    
    // get todos variable pass on from ejs
    function getTodos(todosArr) {
        return todosArr.filter(function(todo) {
            return (todo.year === fullDate.year && todo.month === fullDate.month);
        });
    }

    function makeDayAndDate(calendar) {
        if(getId("container")) {
            calendar.removeChild(getId("container"));
        }
        if(!getId("btns")) {
            createBtns(calendar);
        }
        const todosNow = getTodos(todos),
            title = makeTitleHeader(),
            tbl = makeTbl(),
            container = makeElem("div");

        container.id = "container";
        fullDate.firstDay = new Date(fullDate.year, fullDate.month, 1).getDay();

        // populate table with dates
        let dates = 1;
        while(dates  <= fullDate.maxDates) {
            let tr = makeElem("tr");
            tr.classList.add("row");
            let days = 0; //represents days of the week
            while(days <= 6) {
                // console.log(dates, dayList[days] + ": " + days);
                let td = makeElem("td"),
                a = makeElem("a");
                td.classList.add("col");
                a.addEventListener("click", function() { showTodos("fromMonth", this) });
                if(dates === 1 && days !== fullDate.firstDay) {
                    dates--; // cancels out dates++ at bottom
                }
                if(dates > 0 && dates <= fullDate.maxDates) {
                    a.textContent = dates;
                    a.setAttribute("data-date", dates);
                }
                // populate dates with todo titles
                let todosToday = todosNow.filter(function(todo) {
                    return todo.date === dates;
                });
                for(let i=0; i <= todosToday.length - 1; i++) {
                    const p = makeElem("p");
                    p.textContent = todosToday[i].title;
                    a.appendChild(p);
                }
                dates++;
                days++;
                td.appendChild(a);
                tr.appendChild(td);
            }
            tbl.appendChild(tr);
        }
        container.appendChild(title);
        container.appendChild(tbl);
        calendar.appendChild(container);
    }

    function createBtns(calendar) {
        const prev = makeElem("button"),
            nxt = makeElem("button"),
            btns = makeElem("div");
        prev.textContent = "<-";
        nxt.textContent = "->";
        prev.id = "prevBtn";
        nxt.id = "nxtBtn";
        btns.id = "btns";
        btns.appendChild(prev);
        btns.appendChild(nxt);
        calendar.appendChild(btns);
        prev.addEventListener("click", prevMonth);
        nxt.addEventListener("click", nxtMonth);
    }
    
    function prevMonth() {
        const calendar = getId("calendar");
        if(fullDate.month === 0) {
            fullDate.year = fullDate.year - 1;
            fullDate.month = 11;
            fullDate.maxDates = new Date(fullDate.year, 0, 0).getDate();
        } else {
            fullDate.month = fullDate.month - 1;
            fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
        }
        makeDayAndDate(calendar);
    }
    
    function nxtMonth() {
        const calendar = getId("calendar");
        if(fullDate.month === 11) {
            fullDate.year = fullDate.year + 1;
            fullDate.month = 0;
            fullDate.maxDates = new Date(fullDate.year, 1, 0).getDate();
        } else {
            fullDate.month = fullDate.month + 1;
            fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
        }
        makeDayAndDate(calendar);
    }
    
    function prevDate() {
        showTodos("prevDate");
    }
    function nxtDate() {
        showTodos("nxtDate");
    }
    
    function switchBtnEvent(input, elemClicked) {
        const prevBtn = getId("prevBtn"),
            nxtBtn = getId("nxtBtn");
        if(input === "fromMonth") {
            // console.log(elemClicked);
            fullDate.date = parseInt(elemClicked.getAttribute("data-date"));
            // fullDate.date = parseInt(elemClicked.childNodes[0].nodeValue); // get date of clicked element
            prevBtn.removeEventListener("click", prevMonth);
            nxtBtn.removeEventListener("click", nxtMonth);
            prevBtn.addEventListener("click", prevDate);
            nxtBtn.addEventListener("click", nxtDate);
        }
        if(input === "prevDate" || "nxtDate") {
            let entries = getId("container").getElementsByTagName("div");
            for(let i = entries.length - 1; i >= 0; i--) {
                entries[i].parentNode.removeChild(entries[i]);
            }
        }
        if(input === "prevDate") {
            if(fullDate.date === 1) {
                if(fullDate.month === 0) {
                    fullDate.year = fullDate.year - 1;
                    fullDate.month = 11;
                    fullDate.maxDates = new Date(fullDate.year, 0, 0).getDate();
                } else {
                    fullDate.month = fullDate.month - 1;
                    fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
                }
                fullDate.date = fullDate.maxDates;
            } else {
                fullDate.date = fullDate.date - 1;
            }
            
        }
        if(input === "nxtDate") {
            if(fullDate.date === fullDate.maxDates) {
                if(fullDate.month === 11) {
                    fullDate.year = fullDate.year + 1;
                    fullDate.month = 0;
                    fullDate.maxDates = new Date(fullDate.year, 1, 0).getDate();
                } else {
                    fullDate.month = fullDate.month + 1;
                    fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
                }
                fullDate.date = 1;
            } else {
                fullDate.date = fullDate.date + 1;
            }

        }
    }
    
    
    function showTodos(input, clickedElem) {
        const periodSelect = getId("periodSelect"),
            tbl = getId("tbl"),
            title = getId("title"),
            frag = document.createDocumentFragment(), //append generated elems here first
            container = getId("container"),
            calendar = getId("calendar"),
            todosNow = getTodos(todos);
        // console.log(this.textContent);
        switchBtnEvent(input, clickedElem);

        periodSelect.textContent = "date";
        tbl.classList.add("noDisplay");
        title.innerHTML = "<h2>" + monthList[fullDate.month] + " " + fullDate.date + ", " + fullDate.year + "</h2>";
        // todosNow is from todos variable is passed on through index.ejs
        let todosToday = todosNow.filter(function(todo) {
            return todo.date === fullDate.date;
        });
        for(let i = 0; i <= todosToday.length - 1; i++) {
            const div = makeElem("div"),
                a = makeElem("a");
            a.setAttribute("href", "/todo/" + todosToday[i]._id);
            a.textContent = todosToday[i].title + " - " + todosToday[i].description;
            div.appendChild(a);
            frag.appendChild(div);
        }
        container.appendChild(frag);
        calendar.appendChild(container);
        
    }
    
    function makePeriodSelectBtns(calendar) {
        const btn = makeElem("button");
        btn.id = "periodSelect";
        btn.textContent = "month";
        btn.addEventListener("click", changePeriod);
        calendar.appendChild(btn);
    }
    
    function changePeriod() {
        const monthList = getId("monthList"),
            yearList = getId("yearList"),
            calendar = getId("calendar"),
            btns = getId("btns"),
            prevBtn = getId("prevBtn"),
            nxtBtn = getId("nxtBtn");

        if(this.textContent === "year") {
            monthList.classList.add("noDisplay");
            if(yearList) {
                yearList.classList.remove("noDisplay");
            } else {
                createList("year");
            }
            this.classList.add("noDisplay");
        }
        if(this.textContent === "month") {
            // note: if I try to put container in variable, it won't work.
            // see https://stackoverflow.com/questions/42956884/failed-to-execute-removechild-on-node
            calendar.removeChild(getId("container"));
            if(monthList) {
                monthList.classList.remove("noDisplay");
            } else {
                createList("month");
            }
            btns.classList.add("noDisplay");
            this.textContent = "year";
        }
        if(this.textContent === "date") {
            this.textContent = "month";
            prevBtn.removeEventListener("click", prevDate);
            prevBtn.addEventListener("click", prevMonth);
            nxtBtn.removeEventListener("click", nxtDate);
            nxtBtn.addEventListener("click", nxtMonth);
            makeDayAndDate(calendar);
        }
    }

runOnPageLoad();

})();


