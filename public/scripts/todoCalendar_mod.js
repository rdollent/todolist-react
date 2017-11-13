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
        
    let prevNextInterval = null;
        
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
    // need to start makeList when pressing button to allow functions to run!
    function makeList(input) {
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
    
    function makeYearHeader() {
        const yearTitle = makeElem("div"),
            calendar = getId("calendar"),
            h2 = makeElem("h2");
        yearTitle.id = "yearTitle";
        h2.textContent = fullDate.year;
        yearTitle.appendChild(h2);
        calendar.appendChild(yearTitle);
    }
    
    function yearClicked() {
        const yearList = getId("yearList"),
            monthList = getId("monthList"),
            periodSelect = getId("periodSelect"),
            yearTitle = getId("yearTitle");
        fullDate.year = parseInt(this.textContent);
        yearList.classList.add("noDisplay");
        if(monthList && yearTitle) {
            monthList.classList.remove("noDisplay");
            yearTitle.classList.remove("noDisplay");
            // change the displayed year in the Year Header
            yearTitle.firstChild.textContent = fullDate.year;
        }
        if(periodSelect) {
            periodSelect.classList.remove("noDisplay");
            periodSelect.textContent = "year";
        }
        
    }
    
    function monthClicked() {
        const monthList = getId("monthList"),
            calendar = getId("calendar"),
            btns = getId("btns"),
            yearTitle = getId("yearTitle");
        monthList.classList.add("noDisplay");
        yearTitle.classList.add("noDisplay");
        btns.classList.remove("noDisplay");
        fullDate.month = parseInt(this.dataset.month);
        fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
        getId("periodSelect").textContent = "month";
        makeDayAndDate(calendar);
    }
    
    function makeTitleHeader() {
        const p = makeElem("p"),
            h2 = makeElem("h2");
        h2.textContent = monthList[fullDate.month] + " " + fullDate.year;
        p.appendChild(h2);
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
            makeBtns(calendar);
        }
        const todosNow = getTodos(todos),
            title = makeTitleHeader(),
            tbl = makeTbl(),
            container = makeElem("div"),
            btns = getId("btns");

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
                a.addEventListener("click", function() { 
                    showTodos(this);
                    switchBtnEvent("toDate");
                    btns.dataset.status = "toDate";
                });
                if(dates === 1 && days !== fullDate.firstDay) {
                    dates--; // cancels out dates++ at bottom
                }
                if(dates > 0 && dates <= fullDate.maxDates) {
                    a.textContent = dates;
                    a.dataset.date = dates;
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

    function makeBtns(calendar) {
        const prevBtn = makeElem("button"),
            nextBtn = makeElem("button"),
            btns = makeElem("div"),
            btnsArr = [prevBtn, nextBtn],
            events = ["mouseup", "mousedown"];
        prevBtn.textContent = "<-";
        nextBtn.textContent = "->";
        prevBtn.id = "prevBtn";
        nextBtn.id = "nextBtn";
        btns.id = "btns";
        btns.appendChild(prevBtn);
        btns.appendChild(nextBtn);
        calendar.appendChild(btns);
        
        // initial values
        prevBtn.addEventListener("mousedown", prevMonth);
        nextBtn.addEventListener("mousedown", nextMonth);
        btns.dataset.status = "toMonth";
        
        // add event holdThis function for mouseup and mousedown, hold button to scroll through date/month
        btnsArr.forEach(function(b) {
            events.forEach(function(e) {
                b.addEventListener(e, holdThis);
            });
        });
    }
    
    // hold prev and next buttons to scroll through months/dates
    function holdThis(e) {
        const btns = getId("btns");

        if(e.type === "mousedown") {
            if(this.id ==="nextBtn") {
                holdNext();
            }
            if(this.id === "prevBtn") {
                holdPrev();
            }
        }
        if(e.type === "mouseup") {
            letGo();
        }
        
        function holdNext() {
          prevNextInterval = setInterval(function() {
            if(btns.dataset.status === "toMonth") {
                return nextMonth();
            }
            if(btns.dataset.status === "toDate") {
                return nextDate();
            }
            // return addTime(elem);
            }, 300);
        }
        
        function holdPrev() {
          prevNextInterval = setInterval(function() {
            if(btns.dataset.status === "toMonth") {
                return prevMonth();
            }
            if(btns.dataset.status === "toDate") {
                return prevDate();
            }
            // return subtractTime(elem);
            }, 300);
        }
        
        function letGo() {
          clearInterval(prevNextInterval);
          prevNextInterval = null;
        }
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
    
    function nextMonth() {
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
        clearEntries();
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
        showTodos();
    }
    
    function nextDate() {
        clearEntries();
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
        showTodos();
    }
    
    function switchBtnEvent(input) {
        const prevBtn = getId("prevBtn"),
            nextBtn = getId("nextBtn");
        if(input === "toDate") {
            prevBtn.removeEventListener("mousedown", prevMonth);
            nextBtn.removeEventListener("mousedown", nextMonth);
            prevBtn.addEventListener("mousedown", prevDate);
            nextBtn.addEventListener("mousedown", nextDate);
        }
        
        if(input === "toMonth") {
            prevBtn.removeEventListener("mousedown", prevDate);
            nextBtn.removeEventListener("mousedown", nextDate);
            prevBtn.addEventListener("mousedown", prevMonth);
            nextBtn.addEventListener("mousedown", nextMonth);
        }
    }
    // clear todo entries on date Level
    function clearEntries() {
        let entries = getId("container").getElementsByTagName("div");
        for(let i = entries.length - 1; i >= 0; i--) {
            entries[i].parentNode.removeChild(entries[i]);
        }
    }
    
    function showTodos(clickedElem) {
        const periodSelect = getId("periodSelect"),
            tbl = getId("tbl"),
            title = getId("title"),
            frag = document.createDocumentFragment(), //append generated elems here first
            container = getId("container"),
            calendar = getId("calendar"),
            todosNow = getTodos(todos);
        // console.log(this.textContent);
        // clicking date on calendar, get date for fullDate.date,
        // otherwise, fullDate.date is taken using prevDate and nextDate functions.
        if(clickedElem) {
            fullDate.date = parseInt(clickedElem.dataset.date);
        }
        // fullDate.date = parseInt(elemClicked.childNodes[0].nodeValue); // get date of clicked element
        // switchBtnEvent(input, clickedElem);

        periodSelect.textContent = "date";
        tbl.classList.add("noDisplay");
        title.firstChild.textContent = monthList[fullDate.month] + " " + fullDate.date + ", " + fullDate.year;
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
        btn.addEventListener("click", switchPeriod);
        calendar.appendChild(btn);
    }
    
    function switchPeriod() {
        const monthList = getId("monthList"),
            yearList = getId("yearList"),
            calendar = getId("calendar"),
            btns = getId("btns"),
            prevBtn = getId("prevBtn"),
            nextBtn = getId("nextBtn"),
            yearTitle = getId("yearTitle");

        if(this.textContent === "year") {
            monthList.classList.add("noDisplay");
            yearTitle.classList.add("noDisplay");
            if(yearList) {
                yearList.classList.remove("noDisplay");
            } else {
                makeList("year");
            }
            this.classList.add("noDisplay");
        }
        if(this.textContent === "month") {
            // note: if I try to put container in variable, it won't work.
            // see https://stackoverflow.com/questions/42956884/failed-to-execute-removechild-on-node
            calendar.removeChild(getId("container"));
            if(monthList && yearTitle) {
                monthList.classList.remove("noDisplay");
                yearTitle.classList.remove("noDisplay");
                yearTitle.firstChild.textContent = fullDate.year;
            } else {
                makeYearHeader();
                makeList("month");
            }
            btns.classList.add("noDisplay");
            this.textContent = "year";
        }
        if(this.textContent === "date") {
            this.textContent = "month";
            btns.dataset.status = "toMonth";
            switchBtnEvent("toMonth");
            makeDayAndDate(calendar);
        }
    }
    
    
    

runOnPageLoad();

})();


