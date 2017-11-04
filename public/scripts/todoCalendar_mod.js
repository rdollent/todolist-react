"use strict";

(function() {
    const mainDate = {},
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
        mainDate.year = new Date().getFullYear();
        mainDate.month = new Date().getMonth();
        mainDate.date = new Date().getDate();
        mainDate.maxDates = new Date(mainDate.year, mainDate.month + 1, 0).getDate();
        createPeriodSelectBtns(calendar);
        createDayAndDate(calendar);
    }
    
    function getId(input) {
        return document.getElementById(input);
    }
    
    function makeElem(input) {
        return document.createElement(input);
    }
    // year functions
    // need to start populateTimes when pressing button to allow functions to run!
    function populateTimes(input) {
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
        mainDate.year = parseInt(this.textContent);
    }
    
    function monthClicked() {
        const main = getId("monthList"),
            calendar = getId("calendar");
        main.classList.add("noDisplay");
        mainDate.month = parseInt(this.getAttribute("data-month"));
        mainDate.maxDates = new Date(mainDate.year, mainDate.month + 1, 0).getDate();
        getId("periodSelect").textContent = "month";
        createDayAndDate(calendar);
    }
    
    function createTitleHeader() {
        const p = makeElem("p");
        p.innerHTML = "<h2>" + monthList[mainDate.month] + " " + mainDate.year + "</h2>";
        p.id = "title";
        return p;
    }
    
    function createDayHeader() {
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
    
    function createTbl() {
        const tbl = makeElem("table"),
            colgrp = makeElem("colgroup"),
            trDays = createDayHeader();

        tbl.id = "tbl";
        tbl.classList.add("container-fluid");
        colgrp.span = 7;
        tbl.appendChild(colgrp);
        tbl.appendChild(trDays);

        return tbl;
    }
    
    function getTodos(todosArr) {
        // const arr = [];
        // for(let i=0; i <= todosArr.length - 1; i++) {
        //     if(todosArr[i].year === mainDate.year && todosArr[i].month === mainDate.month) {
        //         arr.push(todos[i]);
        //     }
        // }
        // return arr;
        return todosArr.filter(function(todo) {
            return (todo.year === mainDate.year && todo.month === mainDate.month);
        });
    }

    function createDayAndDate(calendar) {
        if(getId("container")) {
            calendar.removeChild(getId("container"));
        }
        if(!document.getElementsByClassName("btns")[0]) {
            createBtns(calendar);
        }
        const todosNow = getTodos(todos),
            title = createTitleHeader(),
            tbl = createTbl(),
            container = makeElem("div");

        container.id = "container";
        mainDate.firstDay = new Date(mainDate.year, mainDate.month, 1).getDay();

        // populate table with dates
        let dates = 1;
        while(dates  <= mainDate.maxDates) {
            let tr = makeElem("tr");
            tr.classList.add("row");
            let days = 0; //represents days of the week
            while(days <= 6) {
                // console.log(dates, dayList[days] + ": " + days);
                let td = makeElem("td"),
                a = makeElem("a");
                td.classList.add("col");
                a.addEventListener("click", showTodos);
                if(dates === 1 && days !== mainDate.firstDay) {
                    dates--; // cancels out dates++ at bottom
                }
                if(dates > 0 && dates <= mainDate.maxDates) {
                    a.textContent = dates;
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
        btns.classList.add("btns");
        btns.appendChild(prev);
        btns.appendChild(nxt);
        calendar.append(btns);
        prev.addEventListener("click", prevBtn);
        nxt.addEventListener("click", nextBtn);
    }
    
    function prevBtn() {
        const calendar = getId("calendar");
        if(mainDate.month === 0) {
            mainDate.year = mainDate.year - 1;
            mainDate.month = 11;
            mainDate.maxDates = new Date(mainDate.year, 0, 0).getDate();
        } else {
            mainDate.month = mainDate.month - 1;
            mainDate.maxDates = new Date(mainDate.year, mainDate.month + 1, 0).getDate();
        }
        createDayAndDate(calendar);
    }
    
    function nextBtn() {
        const calendar = getId("calendar");
        if(mainDate.month === 11) {
            mainDate.year = mainDate.year + 1;
            mainDate.month = 0;
            mainDate.maxDates = new Date(mainDate.year, 1, 0).getDate();
        } else {
            mainDate.month = mainDate.month + 1;
            mainDate.maxDates = new Date(mainDate.year, mainDate.month + 1, 0).getDate();
        }
        createDayAndDate(calendar);
    }
    
    function showTodos() {
        const periodSelect = getId("periodSelect"),
            tbl = getId("tbl"),
            title = getId("title"),
            frag = document.createDocumentFragment(), //append generated elems here first
            container = getId("container"),
            calendar = getId("calendar"),
            todosNow = getTodos(todos);
        // console.log(this.textContent);
        mainDate.date = parseInt(this.childNodes[0].nodeValue); // get date of clicked element
        periodSelect.textContent = "date";
        tbl.classList.add("noDisplay");
        title.innerHTML = "<h2>" + monthList[mainDate.month] + " " + mainDate.date + ", " + mainDate.year + "</h2>";
        // todosNow is from todos variable is passed on through index.ejs
        let todosToday = todosNow.filter(function(todo) {
            return todo.date === mainDate.date;
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
    
    function createPeriodSelectBtns(calendar) {
        const btn = makeElem("button");
        btn.id = "periodSelect";
        btn.textContent = "month";
        btn.addEventListener("click", changePeriod);
        calendar.appendChild(btn);
    }
    
    function changePeriod() {
        const monthList = getId("monthList"),
            yearList = getId("yearList"),
            calendar = getId("calendar");

        if(this.textContent === "year") {
            monthList.classList.add("noDisplay");
            if(yearList) {
                yearList.classList.remove("noDisplay");
            } else {
                populateTimes("year");
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
                populateTimes("month");
            }
            this.textContent = "year";
        }
        if(this.textContent === "date") {
            this.textContent = "month";
            createDayAndDate(calendar);
        }
    }

runOnPageLoad();

})();


