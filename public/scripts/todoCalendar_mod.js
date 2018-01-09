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
        
    // use this as counter for holding prev/next buttons.
    let prevNextInterval = null,
        // todos for xmlhttprequest ajax call
        todos = undefined;

    function runOnPageLoad() {
        const calendar = getId("calendar");
        makeRequest("index");
        fullDate.year = new Date().getFullYear();
        fullDate.month = new Date().getMonth();
        fullDate.date = new Date().getDate();
        fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
        makePeriodSelectBtns(calendar);
        makeCalendar();
        makeDayAndDate(calendar);
        // added mouseup event listener on whole document when scrolling through dates
        // and months, hovering mouse outside prev and next buttons while holding mousedown
        // and doing mouseup will not stop scrolling through dates/months. need mouseup on whole document
        // to detect mouseup.
        document.addEventListener("mouseup", letGo);
        document.addEventListener("touchend", letGo);
    }
    
    function getId(input) {
        return document.getElementById(input);
    }
    
    function makeElem(input) {
        return document.createElement(input);
    }
    
    function makeRequest(route) {
        const myReq = new XMLHttpRequest();
        let url = "";
        // let url = "https://to-do-list-rdollent.c9users.io/todo/" + user;
        // user is passed on through ejs/todo.js route; check <script> in index.ejs and get route in todo.js
        if(route === "index") {
           url = "/todo/user/" + user; 
        }

        myReq.onreadystatechange = function() {
            if(myReq.readyState === 4 && myReq.status === 200) {
                todos = JSON.parse(myReq.responseText); 
            }
        };
        // false for synchronous behaviour. async will process succeeding functions as ajax call is underway.
        myReq.open("GET", url, false);
        myReq.send();
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
            yearTitle = getId("yearTitle");
        monthList.classList.add("noDisplay");
        yearTitle.classList.add("noDisplay");
        fullDate.month = parseInt(this.dataset.month);
        fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
        getId("periodSelect").textContent = "month";
        makeCalendar();
        makeDayAndDate(calendar);
    }
    
    function makeCalendar() {
        const calendar = getId("calendar"),
            container = makeElem("div"),
            titleHeader = makeTitleHeader();
        container.id = "container";
        calendar.appendChild(container);
        container.appendChild(titleHeader);
        makeBtns();
    }
    function makeTitleHeader() {
        const p = makeElem("p"),
            titleHeader = makeElem("div");
        p.id = "tblHeader";
        titleHeader.id = "title";
        p.textContent = monthList[fullDate.month] + " " + fullDate.year;
        titleHeader.appendChild(p);
        return titleHeader;
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
        colgrp.span = 7;
        tbl.appendChild(colgrp);
        tbl.appendChild(trDays);
        return tbl;
    }
    
    // get todos variable pass on from ejs
    function getTodosMonth(todosArr) {
        return todosArr.filter(function(todo) {
            return (todo.year === fullDate.year && todo.month === fullDate.month);
        });
    }

    function makeDayAndDate(calendar) {
        const tbl = makeTbl(),
            container = getId("container"),
            tblHeader = getId("tblHeader");

        if(getId("tbl")) {
            container.removeChild(getId("tbl"));
        }
        
        // if tblHeader exists, change month and year
        if(tblHeader) {
            tblHeader.firstChild.textContent = monthList[fullDate.month] + " " + fullDate.year;
        }

        fullDate.firstDay = new Date(fullDate.year, fullDate.month, 1).getDay();

        // populate table with dates
        let dates = 1;
        while(dates  <= fullDate.maxDates) {
            let tr = makeElem("tr");
            tr.classList.add("row");
            let days = 0; //represents days of the week
            while(days <= 6) {
                let td = makeElem("td"),
                a = makeElem("a");
                a.classList.add("calendarDates");
                td.classList.add("col");
                a.addEventListener("click", function() { 
                    showTodos(this);
                    removeColour();
                    putColour(this);
                });
                if(dates === 1 && days !== fullDate.firstDay) {
                    dates--; // cancels out dates++ at bottom
                }
                if(dates > 0 && dates <= fullDate.maxDates) {
                    a.textContent = dates;
                    a.dataset.date = dates;
                }
                dates++;
                days++;
                td.appendChild(a);
                tr.appendChild(td);
            }
            tbl.appendChild(tr);
        }
    container.appendChild(tbl);
    populateCalendarWithDots();
    
    }
    
    function populateCalendarWithDots() {
        const todosMonth = getTodosMonth(todos),
            calendarDates = document.getElementsByClassName("calendarDates"),
            todoIcon = "<i class='icon-tiny material-icons icon-white'>arrow_drop_down</i>";
        let todosDate = {},
            todosDateAll = [];
            
        // place indicator if date has a todo
        for(let i = 0; i < todosMonth.length; i++) {
            // store dates only from todosMonth
            todosDateAll.push(todosMonth[i].date);
        }
        // get only unique dates. es6 method.
        todosDate = new Set(todosDateAll);
        // go through dates, look at where there is a todo
        // do not use innerHTML as it will remove any event listeners
        // use insertAdjacentHTML https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
        for(let i = 0; i < calendarDates.length; i++) {
            // dates in calendar are string, dates in todosDate are numbers
            if(calendarDates[i].textContent) {
                calendarDates[i].insertAdjacentHTML("afterend", todoIcon);
            }
            if(todosDate.has(parseInt(calendarDates[i].textContent))) {
                calendarDates[i].nextElementSibling.classList.remove("icon-white");
            }
        }
    }

    function makeBtns() {
        const prevBtn = makeElem("a"),
            nextBtn = makeElem("a"),
            // btns = makeElem("div"),
            btnsArr = [prevBtn, nextBtn],
            prevImg = makeElem("i"),
            nextImg = makeElem("i"),
            title = getId("title");
        
        prevImg.classList.add("material-icons", "prevNext-icon");
        nextImg.classList.add("material-icons", "prevNext-icon");
        prevImg.textContent = "navigate_before";
        nextImg.textContent = "navigate_next";
        prevBtn.appendChild(prevImg);
        nextBtn.appendChild(nextImg);
        prevBtn.id = "prevBtn";
        nextBtn.id = "nextBtn";
        title.insertBefore(prevBtn, title.children.namedItem("tblHeader"));
        title.insertBefore(nextBtn, title.children.namedItem("tblHeader").nextSibling);
        
        
        // initial values
        prevBtn.addEventListener("mousedown", prevMonth);
        prevBtn.addEventListener("mousedown", clearEntries);
        nextBtn.addEventListener("mousedown", nextMonth);
        nextBtn.addEventListener("mousedown", clearEntries);

        // add event holdThis function for mouseup and mousedown, hold button to scroll through date/month
        btnsArr.forEach(function(btn) {
            btn.addEventListener("mousedown", holdThis);
            btn.addEventListener("touchstart", holdThis, {passive: true});
        });
        
    }
    
    // hold prev and next buttons to scroll through months/dates
    function holdThis() {
        let clickedElem = this;
        clearEntries();
        prevNextInterval = setInterval(function() {
            if(clickedElem.id === "nextBtn") {
                return nextMonth();
            }
            if(clickedElem.id === "prevBtn") {
                return prevMonth();
            }
        }, 300); 

    }
    
    function letGo() {
        clearInterval(prevNextInterval);
        prevNextInterval = null;
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

    // clear todo entries on date Level
    function clearEntries() {
        const modContent = getId("modContent");
        while(modContent.lastChild) {
            modContent.removeChild(modContent.lastChild);
        }
    }
    
    function showTodos(clickedElem) {
        const fragHours = document.createDocumentFragment(), //append generated elems here first
            fragTodos = document.createDocumentFragment(), //append generated elems here first
            todosMonth = getTodosMonth(todos),
            modContent = getId("modContent"),
            colHours = makeElem("div"),
            colTodos = makeElem("div");
        let todosTodayTemp = [],
            todosToday = [];
        
        // reset modContent height
        clearEntries();
        resetTodosHeight(modContent);
        console.log(clickedElem);
        // console.log(this.textContent);
        // clicking date on calendar, get date for fullDate.date,
        // otherwise, fullDate.date is taken using prevDate and nextDate functions.
        if(clickedElem) {
            fullDate.date = parseInt(clickedElem.dataset.date);
        }

        todosTodayTemp = todosMonth.filter(function(todo) {
            return todo.date === fullDate.date;
        });
        
        todosToday = todosTodayTemp.sort(compareTimes);

        colHours.id = "colHours";
        colTodos.id = "colTodos";
        colHours.classList.add("col-hours");
        colTodos.classList.add("col-todos");
        modContent.appendChild(colHours);
        modContent.appendChild(colTodos);
        
        //please see
        //https://stackoverflow.com/questions/48100598/parameter-not-being-passed-on-addeventlistener-on-ie11/48101139#48101139
        for(let i = 0; i < todosToday.length; i++) {
            const a = makeElem("a"),
                span = makeElem("span");
            //todosToday[i] won't be passed through a.addEventListener because of scope
            //attach todo in element "a" and access it as its property.
            a.todo = todosToday[i];
            a.classList.add("col-todos-a");
            span.classList.add("col-hours-span");
            
            // a.setAttribute("href", "/todo/" + todosToday[i]._id);
            a.addEventListener("click", function() {
                resetTodosHeight(modContent);
                showFoundTodo(a.todo);
                });
            span.textContent = todosToday[i].frmHr + ":" + todosToday[i].frmMin + "-" +
                            todosToday[i].toHr + ":" + todosToday[i].toMin;
            a.textContent = todosToday[i].title;
            fragHours.appendChild(span);
            fragTodos.appendChild(a);
        }
        colHours.appendChild(fragHours);
        colTodos.appendChild(fragTodos);
        modContent.appendChild(colHours);
        modContent.appendChild(colTodos);

        if(todosToday.length > 0) {
            setTodosHeight();
        }
        
    }
    
    function resetTodosHeight(modContent) {
        modContent.style.setProperty("height", "auto");
    }
    
    function setTodosHeight() {
        const container = document.getElementsByClassName("index-container")[0],
            nav = document.getElementsByClassName("nav")[0],
            containerHeight = window.getComputedStyle(container).height, //string
            navHeight = window.getComputedStyle(nav).height, //string
            todosDateHeight = window.innerHeight - (parseInt(containerHeight) + parseInt(navHeight)),
            modContent = getId("modContent"),
            colHours = getId("colHours"),
            colTodos = getId("colTodos");
            
        modContent.style.setProperty("height", todosDateHeight + "px");
        colHours.style.setProperty("height", modContent.scrollHeight + "px");
        colTodos.style.setProperty("height", modContent.scrollHeight + "px");
    }
    // use to sort todosToday array (of objects)
    function compareTimes(a,b) {
        if(parseInt(a.frmHr + a.frmMin) < parseInt(b.frmHr + b.frmMin)) {
            return - 1;
        }
        if(parseInt(a.frmHr + a.frmMin) > parseInt(b.frmHr + b.frmMin)) {
            return 1;
        }
        // if a.frmHr and b.frmHr are equal
        return 0;
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
            clearEntries();
            if(monthList && yearTitle) {
                monthList.classList.remove("noDisplay");
                yearTitle.classList.remove("noDisplay");
                yearTitle.firstChild.textContent = fullDate.year;
            } else {
                makeYearHeader();
                makeList("month");
            }
            this.textContent = "year";
        }

    }
    function removeColour() {
        let selectedDate = document.getElementsByClassName("selectedDate")[0];
        if(selectedDate) {
            selectedDate.classList.remove("selectedDate");
        }
        
    }   
    function putColour(elem) {
        elem.parentNode.classList.add("selectedDate");
    }

    
    function showFoundTodo(todo) {
        // console.log(todo);
        const modContent = getId("modContent"),
            form = makeElem("form"),
            btnDel = makeElem("button"),
            btnEdit = makeElem("button"),
            btnBack = makeElem("button"),
            a = makeElem("a"),
            showTodoDiv = makeElem("div"),
            showArr = ["title", "description", "year", "month", "date", "frm", "to"],
            frag = document.createDocumentFragment();
   
        clearEntries();

        for(let i = 0; i < showArr.length; i++) {
            let x = makeElem("div");
            if(showArr[i] === "frm") {
                x.textContent = todo.frmHr + ":" + todo.frmMin;
            } else if(showArr[i] === "to") {
                x.textContent = todo.toHr + ":" + todo.toMin;
            } else {
                x.textContent = todo[showArr[i]];
            }
            frag.appendChild(x);
        }
        // id
        showTodoDiv.id = "showTodoDiv";
        // text
        btnEdit.textContent = "Edit";
        btnDel.textContent = "Delete";
        btnBack.textContent = "Back";
        // attributes
        form.setAttribute("action", "/todo/" + todo._id + "?_method=DELETE");
        form.setAttribute("method", "POST");
        // events
        // a.setAttribute("href", "/todo/" + todo._id + "/edit");
        a.addEventListener("click", function() {
            resetTodosHeight(modContent);
            editFoundTodo(todo);
        });
        btnBack.addEventListener("click", function() {
            showTodos(); //if not using anonym function, clickedElem parametre in showTodos will be the event (mouseclick)
        });
        // append
        a.appendChild(btnEdit);
        form.appendChild(btnDel);
        frag.appendChild(a);
        frag.appendChild(form);
        frag.appendChild(btnBack);
        showTodoDiv.appendChild(frag);
        modContent.appendChild(showTodoDiv);

    }
    
    function editFoundTodo(todo) {
        const
            // get elements
            showTodoDiv = getId("showTodoDiv"),
            modContent = getId("modContent"),
            // make elements
            editTodoDiv = makeElem("div"),
            btnBack = makeElem("button"),
            form = makeElem("form"),
            timeDiv = makeElem("div"),
            submitForm = makeElem("button"),

            objInput = {
                makeInput: function(x) {
                    let input = makeElem("input");
                    input.type = ("text");
                    input.name = "todo[" + x + "]";
                    input.value = todo[x];
                    input.required = "required";
                    return input;
                }
            },
       
            title = objInput.makeInput("title"),
            desc = objInput.makeInput("description"),
        
            // create dialog boxes
            todoArr = [todo.year, todo.month, todo.date, todo.frmHr, todo.frmMin, todo.toHr, todo.toMin];
            
            console.log(todoArr);
            // variables for options
            let start = 0, end = 0, defaultVal = 0, selectName = "", selectId = "";
            
            for(let i = 0; i < todoArr.length; i++) {
                let p = makeElem("p"),
                    select = makeElem("select");

                switch(i) {
                    case 0:
                        start = 2000;
                        end = 2099;
                        selectName = "todo[year]";
                        selectId = "editYear";
                        break;
                    case 1:
                        start = 0;
                        end = 11;
                        selectName = "todo[month]";
                        selectId = "editMonth";
                        break;
                    case 2:
                        start = 1;
                        end = 31;
                        selectName = "todo[date]";
                        selectId = "editDate";
                        break;
                    case 3:
                        start = 0;
                        end = 23;
                        selectName = "todo[frmHr]";
                        selectId = "editFrmHr";
                        break;
                    case 4:
                        start = 0;
                        end = 23;
                        selectName = "todo[toHr]";
                        selectId = "editToHr";
                        break;
                    case 5:
                        start = 0;
                        end = 59;
                        selectName = "todo[frmMin]";
                        selectId = "editFrmMin";
                        break;
                    case 6:
                        start = 0;
                        end = 59;
                        selectName = "todo[toMin]";
                        selectId = "editToMin";
                        break;
                }
                
                // assign names and ids
                select.setAttribute("name", selectName);
                select.id = selectId;
                
                for(let j = start; j <= end; j++) {
                    let optns = makeElem("option");
                    // convert month number to name
                    if(selectId === "editMonth") {
                        optns.textContent = monthList[j];
                    } else if(selectId === "editYear" || selectId === "editDate") {
                        optns.textContent = j;
                    // hours and minutes, convert j from for loop to "00" format in option boxes
                    } else { 
                        if(j < 10) {
                            optns.textContent = "0" + j;
                        } else {
                            optns.textContent = String(j);
                        }
                    }
                    // set default value
                    // for month, check if month names match
                    if(selectId === "editMonth") {
                        if(optns.textContent === monthList[todoArr[1]]) {
                            optns.selected = true;
                        }
                    } else if(parseInt(optns.textContent) == todoArr[i]){
                        optns.selected = true;
                    }

                    select.appendChild(optns);
                }

                if(selectId === "editYear" || selectId === "editMonth" || selectId === "editDate") {
                    p.appendChild(select);
                    form.appendChild(p);

                } else {
                   form.appendChild(select);
                }
                
                // add events
                if(selectId === "editYear" || selectId === "editMonth") {
                    select.addEventListener("change", checkOptions);
                }
                if(selectId !== "editYear" || selectId !== "editMonth") {
                    select.addEventListener("change", removeWarning);
                }                
                
            }

        editTodoDiv.id = "editTodoDiv";
        submitForm.id = "submitForm";
        // submitForm.setAttribute("type", "submit");
        
        showTodoDiv.classList.add("noDisplay");
        
        btnBack.textContent = "Back";
        submitForm.textContent = "clickme";
        
        form.setAttribute("action", "/todo/" + todo._id + "/?_method=PUT");
        form.setAttribute("method", "POST");
        
        // events
        btnBack.addEventListener("click", function() {
            modContent.removeChild(getId("editTodoDiv"));
            showTodoDiv.classList.remove("noDisplay");
        });
        submitForm.addEventListener("click", validateForm);
        
        // append
        form.insertBefore(desc, form.firstChild);
        form.insertBefore(title, form.firstChild);
        form.appendChild(submitForm);
        form.appendChild(btnBack);
        editTodoDiv.appendChild(form);
        // editTodoDiv.appendChild(btnBack);
        modContent.appendChild(editTodoDiv);
    }
    
    // function to capture all values in edit mode and check against them
    function checkOptions() {
        // get elements
        const year = getId("editYear").value,
            monthName = getId("editMonth").value,
            date = getId("editDate").value, //for default value
            editDate = getId("editDate"),
            month = convertMonth(monthName),
            oldCount = editDate.childElementCount,
            newCount = new Date(year, month + 1, 0).getDate();


        // check if same number of dates
        if(oldCount < newCount) {
            for(let i = oldCount + 1; i <= newCount; i++) {
                let optns = makeElem("option");
                optns.textContent = i;
                editDate.appendChild(optns);
            }
        }
        if(oldCount > newCount) {
            while(editDate.childElementCount > newCount) {
                editDate.removeChild(editDate.lastElementChild);
            }
            // if the default selected date to be edited is higher than the max dates of new month
            if(date > newCount) {
                editDate.lastChild.selected = true;
            }
        }
        

    }
    
    function convertMonth(input) {
        if(typeof input === "string") {
            for(let i = 0; i < Object.keys(monthList).length; i++) {
                if(monthList[i] === input) {
                    return i;
                }
            }
        }
        if(typeof input === "number") {
            return monthList[input];
        }
    }
    
    function validateForm() {
        event.preventDefault();
        let frmHr = getId("editFrmHr"),
            frmMin = getId("editFrmMin"),
            toHr = getId("editToHr"),
            toMin = getId("editToMin"),
            hrGreat = parseInt(frmHr.value) > parseInt(toHr.value),
            hrEqual = parseInt(frmHr.value) === parseInt(toHr.value),
            minGreat = parseInt(frmMin.value) > parseInt(toMin.value);
        event.preventDefault();
        console.log(hrGreat, hrEqual, minGreat);
        if(hrGreat) {
            event.preventDefault();
            toHr.classList.add("warning");
        }
        if(hrEqual && minGreat) {
            event.preventDefault();
            toMin.classList.add("warning");
        }
        
    }
    
    function removeWarning() {
        const frmHr = getId("editFrmHr"),
            frmMin = getId("editFrmMin"),
            toHr = getId("editToHr"),
            toMin = getId("editToMin");
        [frmHr, frmMin, toHr, toMin].forEach(function(option) {
            if(option.classList.contains("warning")) {
                option.classList.remove("warning");
            }
            
        });
    }
    
    
runOnPageLoad();

})();


