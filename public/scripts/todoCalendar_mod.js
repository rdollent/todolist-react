"use strict";

(function() {
    const fullDate = {},
        monthList = { 
            0: "January", 1: "February", 2: "March", 3: "April",  4: "May", 5: "June",
            6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December"
        },
        dayList = {0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat"};
        
    // use this as counter for holding prev/next buttons.
    let prevNextInterval = null;
    // todos for xmlhttprequest ajax call
    let todos = undefined;
    
    function runOnPageLoad() {
        makeRequest({index: "reqTodo"});
        // added mouseup event listener on whole document when scrolling through dates
        // and months, hovering mouse outside prev and next buttons while holding mousedown
        // and doing mouseup will not stop scrolling through dates/months. need mouseup on whole document
        // to detect mouseup.
        document.addEventListener("mouseup", letGo);
        document.addEventListener("touchend", letGo);
        getId("addNewTodo").addEventListener("click", function() {
            createOrEditTodo({index: "newTodo"});
        })
    }
    
        
    function getId(input) {
        return document.getElementById(input);
    }
    
    function makeElem(input) {
        return document.createElement(input);
    }
    
    function makeRequest(obj) {
        const myReq = new XMLHttpRequest();
        let url, fd, todoObj = {}, jsonTodo, sendItem;
        
        //GET list of todos
        if(obj.index === "reqTodo") { 
            url = "/todo/user/" + user;
            myReq.open("GET", url);
        }

        // let url = "https://to-do-list-rdollent.c9users.io/todo/" + user;
        // user is passed on through ejs/todo.js route; check <script> in index.ejs and get route in todo.js
        //update edited todo or create new one
        if(obj.index === "updTodo" || obj.index === "newTodo") { 
            if(obj.index === "updTodo") {
                url = "/todo/" + obj.todo._id;
                todoObj["_id"] = obj.todo._id;
            }
            if(obj.index === "newTodo") {
                url = "/todo/";
            }
            
            fd = new FormData(obj.form);
            // https://stackoverflow.com/questions/25040479/formdata-created-from-an-existing-form-seems-empty-when-i-log-it
            for(let [key,val] of fd.entries()) {
                todoObj[key] = val;
            }
            // false for synchronous behaviour. async will process succeeding functions as ajax call is underway.
            //https://stackoverflow.com/questions/19286301/webkitformboundary-when-parsing-post-using-nodejs
            //https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries
            jsonTodo = JSON.stringify(todoObj);
            myReq.open("POST", url);
            sendItem = jsonTodo;
            myReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        }
        
        // delete a todo
        if(obj.index === "delTodo") {
            url = "/todo/delete/" + obj.todo._id;
            myReq.open("POST", url);
        }
        myReq.onreadystatechange = function() {
            if(myReq.readyState === 4 && myReq.status === 200) {
                if(obj.index === "reqTodo") {
                    todos = JSON.parse(myReq.responseText);
                    getCurrentCalendar();
                }
                if(obj.index === "updTodo" || obj.index === "newTodo" || obj.index === "delTodo") {
                    makeRequest({index: "reqTodo"});
                    clearEntries();
                }     


            }
        };

        myReq.send(sendItem);
        
    }

    function getCurrentCalendar() {
        if(fullDate.year === undefined) {
            fullDate.year = new Date().getFullYear();
        }
        
        if(fullDate.month === undefined) {
            fullDate.month = new Date().getMonth();
        }
        
        if(fullDate.date === undefined) {
            fullDate.date = new Date().getDate();
        }
        fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
        makeCalendar();
        makeDayAndDate();
        makePeriodSelectBtns();
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
            let div = makeElem("div");
            div.textContent = value();
            if(input === "month") {
            div.classList.add("monthList");
                if(div.textContent === monthList[fullDate.month]) {
                    div.selected = true;
                }
            }
            if(input === "year") {
            div.classList.add("yearList");
                if(div.textContent === String(fullDate.year)) {
                    div.selected = true;
                }
            }
            div.setAttribute("data-" + input, i);
            div.addEventListener("click", clicked);

            frag.appendChild(div);
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
            // selectedYear = event.target.options[event.target.options.selectedIndex].textContent;

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
            yearTitle = getId("yearTitle"),
            addNewTodo = getId("addNewTodo");
            // selectedMonth = event.target.options[event.target.options.selectedIndex].dataset.month;
        monthList.classList.add("noDisplay");
        yearTitle.classList.add("noDisplay");
        addNewTodo.classList.remove("noDisplay");
        fullDate.month = parseInt(this.dataset.month);
        fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
        getId("periodSelect").textContent = "month";
        makeCalendar();
        makeDayAndDate();
        makePeriodSelectBtns();
    }
    
    function makeCalendar() {
        const calendar = getId("calendar"),
            container = makeElem("div"),
            titleHeader = makeTitleHeader();
        container.id = "container";
        while(calendar.lastChild) {
            calendar.removeChild(calendar.lastChild);
        }
        calendar.appendChild(container);
        container.appendChild(titleHeader);
        makeBtns();
    }
    function makeTitleHeader() {
        const span = makeElem("span"),
            titleHeader = makeElem("div");
        span.id = "tblHeader";
        titleHeader.id = "title";
        span.textContent = monthList[fullDate.month] + " " + fullDate.year;
        titleHeader.appendChild(span);
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

    function makeDayAndDate() {
        const tbl = makeTbl(),
            container = getId("container"),
            tblHeader = getId("tblHeader"),
            calendar = getId("calendar");

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
        const //prevBtn = makeElem("a"),
            //nextBtn = makeElem("a"),
            // btns = makeElem("div"),
            
            prevImg = makeElem("i"),
            nextImg = makeElem("i"),
            btnsArr = [prevImg, nextImg],
            eventsArr = ["mousedown", "touchstart"],
            modContent = getId("modContent"),
            container = getId("container");
        
        prevImg.classList.add("material-icons", "prevNext-icon");
        nextImg.classList.add("material-icons", "prevNext-icon");
        prevImg.textContent = "navigate_before";
        nextImg.textContent = "navigate_next";
        prevImg.id = "prevBtn";
        nextImg.id = "nextBtn";
        container.insertBefore(prevImg, container.children.namedItem("title"));
        container.insertBefore(nextImg, container.children.namedItem("title").nextSibling);
        
        
        // initial values
        prevImg.addEventListener("mousedown", prevMonth);
        nextImg.addEventListener("mousedown", nextMonth);

        eventsArr.forEach(function(btnEvent) {
            btnsArr.forEach(function(btn) {
                btn.addEventListener(btnEvent, clearEntries);
                btn.addEventListener(btnEvent, function() {resetTodosHeight(modContent)});
            });
        });


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
        if(fullDate.month === 0) {
            fullDate.year = fullDate.year - 1;
            fullDate.month = 11;
            fullDate.maxDates = new Date(fullDate.year, 0, 0).getDate();
        } else {
            fullDate.month = fullDate.month - 1;
            fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
        }
        makeDayAndDate();
    }
    
    function nextMonth() {
        if(fullDate.month === 11) {
            fullDate.year = fullDate.year + 1;
            fullDate.month = 0;
            fullDate.maxDates = new Date(fullDate.year, 1, 0).getDate();
        } else {
            fullDate.month = fullDate.month + 1;
            fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
        }
        makeDayAndDate();
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
            colTodos = makeElem("div"),
            showTodoDiv = makeElem("div");
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
        
        showTodoDiv.id = "showTodoDiv";
        colHours.id = "colHours";
        colTodos.id = "colTodos";
        colHours.classList.add("col-hours");
        colTodos.classList.add("col-todos");

        
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
            span.textContent = todosToday[i].frmHr + ":" + todosToday[i].frmMin + " - " +
                            todosToday[i].toHr + ":" + todosToday[i].toMin;
            a.textContent = todosToday[i].title;
            fragHours.appendChild(span);
            fragTodos.appendChild(a);
        }
        colHours.appendChild(fragHours);
        colTodos.appendChild(fragTodos);
        showTodoDiv.appendChild(colHours);
        showTodoDiv.appendChild(colTodos);
        modContent.appendChild(showTodoDiv);

        if(todosToday.length > 0) {
            setTodosHeight();
        }
        
    }
    
    function resetTodosHeight(modContent) {
        modContent.style.setProperty("height", "auto");
    }
    
    function setTodosHeight(x) {
        const container = document.getElementsByClassName("index-container")[0],
            nav = document.getElementsByClassName("nav")[0],
            containerHeight = window.getComputedStyle(container).height, //string
            navHeight = window.getComputedStyle(nav).height, //string
            todosDateHeight = window.innerHeight - (parseInt(containerHeight) + parseInt(navHeight)),
            modContent = getId("modContent"),
            elem = getId(x);
            
        modContent.style.setProperty("height", todosDateHeight + "px");
        elem.style.setProperty("height", modContent.scrollHeight + "px");
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
    
    function makePeriodSelectBtns() {
        const btn = makeElem("button"),
            calendar = getId("calendar");
        btn.id = "periodSelect";
        btn.textContent = "month";
        btn.addEventListener("click", switchPeriod);
        calendar.insertBefore(btn, calendar.firstChild);
    }
    
    function switchPeriod() {
        const monthList = getId("monthList"),
            yearList = getId("yearList"),
            calendar = getId("calendar"),
            yearTitle = getId("yearTitle"),
            addNewTodo = getId("addNewTodo");

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
            addNewTodo.classList.add("noDisplay");
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
            showFoundTodoDiv = makeElem("div"),
            showArr = ["title", "description", "frm", "to"],
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
        showFoundTodoDiv.id = "showFoundTodoDiv";
        // text
        btnEdit.textContent = "Edit";
        btnDel.textContent = "Delete";
        btnBack.textContent = "Back";
        // attributes
        // form.setAttribute("action", "/todo/" + todo._id + "?_method=DELETE");
        // form.setAttribute("method", "POST");
        // events
        // a.setAttribute("href", "/todo/" + todo._id + "/edit");
        a.addEventListener("click", function() {
            resetTodosHeight(modContent);
            createOrEditTodo({index: "updTodo", todo: todo});
        });
        btnBack.addEventListener("click", function() {
            showTodos(); //if not using anonym function, clickedElem parametre in showTodos will be the event (mouseclick)
        });
        btnDel.addEventListener("click", function() {
            event.preventDefault();
            makeRequest({index: "delTodo", todo: todo}); //xmlhttprequest
        });

        // append
        a.appendChild(btnEdit);
        form.appendChild(btnDel);
        frag.appendChild(a);
        frag.appendChild(form);
        frag.appendChild(btnBack);
        showFoundTodoDiv.appendChild(frag);
        modContent.appendChild(showFoundTodoDiv);

    }
    
    function createOrEditTodo(obj) {
        if(getId("showTodoDiv")) {
            let showTodoDiv = getId("showTodoDiv");
            showTodoDiv.classList.add("noDisplay");
        }
        if(getId("formTodoDiv")) {
            let formTodoDiv = getId("formTodoDiv");
            formTodoDiv.parentNode.removeChild(formTodoDiv);
        }
        
        // declare all variables. cant declare inside if since let and const are block-scoped

        const
        // for edit and create
            modContent = getId("modContent"),
             // make elements
            formTodoDiv = makeElem("div"),
            btnBack = makeElem("button"),
            form = makeElem("form"),
            submitTodo = makeElem("input"),
            objInput = {
                makeInput: function(x) {
                    let input = makeElem("input");
                    input.required = "required";
                    input.type = ("text");
                    input.name = x;
                    if(obj.index === "updTodo") {
                        input.value = obj.todo[x];
                    } else if(obj.index === "newTodo") {
                        input.placeholder = x;
                    }
                    if(x === "title") {
                        input.setAttribute("maxlength", 15);
                    } else if(x === "description") {
                        input.setAttribute("maxlength", 140);
                    }
                    return input;
                }
            },
       
            title = objInput.makeInput("title"),
            desc = objInput.makeInput("description");
        // variables for options
        let todoArr, start = 0, end = 0, selectName = "", selectId = "", showFoundTodoDiv;
        
        if(obj.index === "updTodo") {
            todoArr = [obj.todo.year, obj.todo.month, obj.todo.date, obj.todo.frmHr, obj.todo.frmMin, obj.todo.toHr, obj.todo.toMin];
        }
        if(obj.index === "newTodo") {
            todoArr = [0,1,2,3,4,5,6];
        }

        for(let i = 0; i < todoArr.length; i++) {
            let p = makeElem("p"),
                select = makeElem("select");

            switch(i) {
                case 0: // todo.year
                    start = 2000;
                    end = 2099;
                    selectName = "year";
                    selectId = "formYear";
                    break;
                case 1: // todo.month
                    start = 0;
                    end = 11;
                    selectName = "month";
                    selectId = "formMonth";
                    break;
                case 2: // todo.date
                    start = 1;
                    end = 31;
                    selectName = "date";
                    selectId = "formDate";
                    break;
                case 3: // todo.frmHr
                    start = 0;
                    end = 23;
                    selectName = "frmHr";
                    selectId = "formFrmHr";
                    break;
                case 4: // todo.frmMin
                    start = 0;
                    end = 59;
                    selectName = "frmMin";
                    selectId = "formFrmMin";
                    break;
                case 5: // todo.toHr
                    start = 0;
                    end = 23;
                    selectName = "toHr";
                    selectId = "formToHr";
                    break;
                case 6: // todo.toMin
                    start = 0;
                    end = 59;
                    selectName = "toMin";
                    selectId = "formToMin";
                    break;
            }
            
            // assign names and ids
            select.setAttribute("name", selectName);
            select.id = selectId;
            
            for(let j = start; j <= end; j++) {
                let optns = makeElem("option");
                // convert month number to name
                if(selectId === "formMonth") {
                    optns.textContent = monthList[j];
                } else if(selectId === "formYear" || selectId === "formDate") {
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
                if(selectId === "formMonth") {
                    if(obj.index === "updTodo" && optns.textContent === monthList[todoArr[1]]) {
                        optns.selected = true;
                    } else if(obj.index === "newTodo" && optns.textContent === monthList[fullDate.month]) {
                        optns.selected = true;
                    }
                } else if(obj.index === "updTodo" && parseInt(optns.textContent) == todoArr[i]){
                    optns.selected = true;
                } else if(obj.index === "newTodo") {
                    if(selectId === "formYear" && optns.textContent === String(fullDate.year)) {
                        optns.selected = true;
                    }
                    if(selectId === "formDate" && optns.textContent === String(fullDate.date)) {
                        optns.selected = true;
                    }
                    if(selectId === "formFrmHr" || selectId === "formFrmMin" || selectId === "formToHr" || selectId === "formToMin") {
                        if(optns.textContent === "00") {
                            optns.selected = true;
                        }
                    }
                }

                select.appendChild(optns);
            }

            if(selectId === "formYear" || selectId === "formMonth" || selectId === "formDate") {
                p.appendChild(select);
                form.appendChild(p);

            } else {
               form.appendChild(select);
            }
            
            // add events
            if(selectId === "formYear" || selectId === "formMonth") {
                select.addEventListener("change", checkOptions);
            }
            if(selectId !== "formYear" || selectId !== "formMonth") {
                select.addEventListener("change", removeWarning);
            }                
            
        }
        
        // ids, classes, attributes, textContent
        formTodoDiv.id = "formTodoDiv";
        submitTodo.id = "submitTodo";
        form.id = "formTodo";
        submitTodo.setAttribute("type", "submit");
        
        if(getId("showFoundTodoDiv")) {
             showFoundTodoDiv = getId("showFoundTodoDiv");
             showFoundTodoDiv.classList.add("noDisplay");
        }
        
        btnBack.textContent = "Back";
        submitTodo.textContent = "Submit";

        // events
        btnBack.addEventListener("click", function() {
            modContent.removeChild(getId("formTodoDiv"));
            if(getId("showFoundTodoDiv")) {
                showFoundTodoDiv.classList.remove("noDisplay");
            }
            if(obj.index === "newTodo" && getId("showTodoDiv")) {
                let showTodoDiv = getId("showTodoDiv");
                showTodoDiv.classList.remove("noDisplay");
            }
        });
        //update todo xmlhttprequest
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            validateForm({index: obj.index, form: this, todo: obj.todo});
        });
        
        // append
        form.insertBefore(desc, form.firstChild);
        form.insertBefore(title, form.firstChild);
        form.appendChild(submitTodo);
        form.appendChild(btnBack);
        formTodoDiv.appendChild(form);
        // formTodoDiv.appendChild(btnBack);
        modContent.appendChild(formTodoDiv);
        
        resetTodosHeight(modContent);
        setTodosHeight("formTodoDiv");
    }
    
    // function to capture all values in edit mode and check against them
    function checkOptions() {
        // get elements
        const year = getId("formYear").value,
            monthName = getId("formMonth").value,
            date = getId("formDate").value, //for default value
            formDate = getId("formDate"),
            month = convertMonth(monthName),
            oldCount = formDate.childElementCount,
            newCount = new Date(year, month + 1, 0).getDate();


        // check if same number of dates
        if(oldCount < newCount) {
            for(let i = oldCount + 1; i <= newCount; i++) {
                let optns = makeElem("option");
                optns.textContent = i;
                formDate.appendChild(optns);
            }
        }
        if(oldCount > newCount) {
            while(formDate.childElementCount > newCount) {
                formDate.removeChild(formDate.lastElementChild);
            }
            // if the default selected date to be edited is higher than the max dates of new month
            if(date > newCount) {
                formDate.lastChild.selected = true;
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
    
    function validateForm(obj) {
        const frmHr = getId("formFrmHr"),
            frmMin = getId("formFrmMin"),
            toHr = getId("formToHr"),
            toMin = getId("formToMin"),
            hrGreat = parseInt(frmHr.value) > parseInt(toHr.value),
            hrEqual = parseInt(frmHr.value) === parseInt(toHr.value),
            minGreat = parseInt(frmMin.value) > parseInt(toMin.value);
        let pass = true;
        if(hrGreat) {
            event.preventDefault();
            toHr.classList.add("warning");
            pass = false;
        }
        if(hrEqual && minGreat) {
            event.preventDefault();
            toMin.classList.add("warning");
            pass = false;
        }
        if(pass === true) {
            makeRequest({index: obj.index, form: obj.form, todo: obj.todo});
        }
    }
    
    function removeWarning() {
        const frmHr = getId("formFrmHr"),
            frmMin = getId("formFrmMin"),
            toHr = getId("formToHr"),
            toMin = getId("formToMin");
        [frmHr, frmMin, toHr, toMin].forEach(function(option) {
            if(option.classList.contains("warning")) {
                option.classList.remove("warning");
            }
            
        });
    }

    // window.addEventListener("resize", function() {
    //     if(document.body.clientWidth >= 768) {
    //         document.getElementsByClassName("nav-menu")[0].classList.remove("noDisplay");
    //         document.getElementsByClassName("nav-hamburger")[0].classList.add("noDisplay");
    //     }
    //     if(document.body.clientWidth <= 768) {
    //         document.getElementsByClassName("nav-menu")[0].classList.add("noDisplay");
    //         document.getElementsByClassName("nav-hamburger")[0].classList.remove("noDisplay");
    //     }
    // });
    
    // window.addEventListener("load", function() {
    //     if(document.body.clientWidth >= 768) {
    //         document.getElementsByClassName("nav-hamburger")[0].classList.add("noDisplay");
    //     }
    //     if(document.body.clientWidth <= 768) {
    //         document.getElementsByClassName("nav-hamburger")[0].classList.remove("noDisplay");
    //     }
            

    // });
    

    
runOnPageLoad();

})();




