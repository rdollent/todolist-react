"use strict";

(function() {
    const fullDate = {},
        monthList = { 
            0: "January", 1: "February", 2: "March", 3: "April",  4: "May", 5: "June",
            6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December"
        },
        dayList = {0: "S", 1: "M", 2: "T", 3: "W", 4: "T", 5: "F", 6: "S"};
        
    // use this as counter for holding prev/next buttons.
    let prevNextInterval = null;
    // todos for xmlhttprequest ajax call
    let todos = undefined;
    
    
    
    let hamburger = document.getElementsByClassName("nav-hamburger")[0];
    
    hamburger.addEventListener("click", function() {
        let navMenu = document.getElementsByClassName("nav-menu")[0];
        // select body and all but not nav and all its children
        let allDiv = document.querySelectorAll("body > *:not(.nav)");
        for(let i = 0; i <= allDiv.length - 1; i++) {
            allDiv[i].classList.toggle("select-none");
        }
    });
    
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
            getId("addNewTodo").classList.toggle("no-display");
        })
    }
    
        
    function getId(input) {
        return document.getElementById(input);
    }
    
    function makeElem(input) {
        return document.createElement(input);
    }
    
    function makeRequest(obj) {
        const myReq = new XMLHttpRequest(),
            formTodo = getId("formTodo");
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
            else if(obj.index === "newTodo") {
                url = "/todo/";
            }
            // FormData does not work on IE!!!!
            // fd = new FormData(obj.form);
            // console.log(fd.entries());
            // // https://stackoverflow.com/questions/25040479/formdata-created-from-an-existing-form-seems-empty-when-i-log-it
            // for(let [key,val] of fd.entries()) {
            //     todoObj[key] = val;
            // }
            
            // take all form data and put it into an object
            fd = formTodo.querySelectorAll("input, textarea, select");
            // console.log(fd);
            for(let i = 0; i < fd.length; i++) {
                todoObj[fd[i].name] = fd[i].value;
                // console.log(todoObj);
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
        else if(obj.index === "delTodo") {
            url = "/todo/delete/" + obj.todo._id;
            myReq.open("POST", url);
        }
        myReq.onreadystatechange = function() {
            if(myReq.readyState === 4 && myReq.status === 200) {
                if(obj.index === "reqTodo") {
                    console.warn(typeof myReq.responseText);
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
        } else if(input === "month") {
            start = 0, end = 11, value = function() { return monthList[i] }, clicked = monthClicked;
        }
        for(i = start; i <= end; i++) {
            let div = makeElem("div");
            div.textContent = value();
            if(input === "month") {
                div.classList.toggle("month-list");
                if(div.textContent === monthList[fullDate.month]) {
                    div.selected = true;
                }
            } else if(input === "year") {
                div.classList.toggle("year-list");
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
        yearList.classList.toggle("no-display");
        if(monthList && yearTitle) {
            monthList.classList.toggle("no-display");
            yearTitle.classList.toggle("no-display");
            // change the displayed year in the Year Header
            yearTitle.firstChild.textContent = fullDate.year;
        }
        if(periodSelect) {
            // periodSelect.classList.toggle("no-display");
            periodSelect.dataset.period = "year";
            // periodSelect.textContent = "view_module";
            periodSelect.textContent = "arrow_back";
        }
        
    }
    
    function monthClicked() {
        const monthList = getId("monthList"),
            yearTitle = getId("yearTitle"),
            addNewTodo = getId("addNewTodo");
            // selectedMonth = event.target.options[event.target.options.selectedIndex].dataset.month;
        monthList.classList.toggle("no-display");
        yearTitle.classList.toggle("no-display");
        addNewTodo.classList.toggle("no-display");
        fullDate.month = parseInt(this.dataset.month);
        fullDate.maxDates = new Date(fullDate.year, fullDate.month + 1, 0).getDate();
        getId("periodSelect").dataset.period = "month";
        getId("periodSelect").textContent = "arrow_back";
        makeCalendar();
        makeDayAndDate();
        makePeriodSelectBtns();
    }
    
    function makeCalendar() {
        const calendar = getId("calendar"),
            container = makeElem("div"),
            titleHeader = makeTitleHeader();
        // if(getId("periodSelect")) {
        //     let periodSelect = getId("periodSelect");
        //     periodSelect.parentNode.removeChild(periodSelect);
        // }
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
        trDays.classList.toggle("row");
        // populate table with day headers
        for(let i = 0; i <= 6; i++) {
            const th = makeElem("th");
            th.classList.toggle("col");
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
            tr.classList.toggle("row");
            let days = 0; //represents days of the week
            while(days <= 6) {
                let td = makeElem("td"),
                a = makeElem("a");
                a.classList.toggle("calendar-dates");
                td.classList.toggle("col");
                a.addEventListener("click", function() { 
                    let addNewTodo = getId("addNewTodo");
                    if(addNewTodo.classList.contains("no-display")) {
                        addNewTodo.classList.toggle("no-display");   
                    }
                    showTodos(this);
                    removeColour();
                    putColour(this);
                });
                if(dates === 1 && days !== fullDate.firstDay) {
                    dates--; // cancels out dates++ at bottom
                } else if(dates > 0 && dates <= fullDate.maxDates) {
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
            calendarDates = document.getElementsByClassName("calendar-dates"),
            todoIcon = "<i class='icon-tiny material-icons icon-white'>arrow_drop_down</i>";
        let todosDate = {},
            todosDateAll = [];
            
        // place indicator if date has a todo
        for(let i = 0, s = todosMonth.length; i < s; i++) {
            // store dates only from todosMonth
            todosDateAll.push(todosMonth[i].date);
        }
        // get only unique dates. es6 method.
        todosDate = new Set(todosDateAll);
        // go through dates, look at where there is a todo
        // do not use innerHTML as it will remove any event listeners
        // use insertAdjacentHTML https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
        for(let i = 0, s = calendarDates.length; i < s; i++) {
            // dates in calendar are string, dates in todosDate are numbers
            if(calendarDates[i].textContent) {
                calendarDates[i].insertAdjacentHTML("afterend", todoIcon);
            }
            if(todosDate.has(parseInt(calendarDates[i].textContent))) {
                calendarDates[i].nextElementSibling.classList.toggle("icon-white");
            }
        }
    }

    function makeBtns() {
        const prevImg = makeElem("i"),
            nextImg = makeElem("i"),
            btnsArr = [prevImg, nextImg],
            eventsArr = ["mousedown", "touchstart"],
            modContent = getId("modContent"),
            container = getId("container");

        btnsArr.forEach(function(btn) {
            btn.classList.toggle("material-icons");
            btn.classList.toggle("prev-next-icon");
            if(btn === prevImg) {
                btn.textContent = "navigate_before";
                btn.id = "prevBtn";
                btn.addEventListener("mousedown", prevMonth);
            } else if(btn === nextImg) {
                btn.textContent = "navigate_next";
                btn.id = "nextBtn";
                btn.addEventListener("mousedown", nextMonth);
            }
        });

        eventsArr.forEach(function(btnEvent) {
            btnsArr.forEach(function(btn) {
                btn.addEventListener(btnEvent, clearEntries);
                // add event holdThis function for mouseup and mousedown, hold button to scroll through date/month
                btn.addEventListener(btnEvent, holdThis);
                btn.addEventListener(btnEvent, function() {resetTodosHeight(modContent)});
            });
        });
        
        container.insertBefore(prevImg, container.children.namedItem("title"));
        container.insertBefore(nextImg, container.children.namedItem("title").nextSibling);

    }
    
    // hold prev and next buttons to scroll through months/dates
    function holdThis() {
        let clickedElem = this;
        clearEntries();
        prevNextInterval = setInterval(function() {
            if(clickedElem.id === "nextBtn") {
                return nextMonth();
            } else if(clickedElem.id === "prevBtn") {
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
            entries = makeElem("div"),
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
        entries.id = "entries";

        //please see
        //https://stackoverflow.com/questions/48100598/parameter-not-being-passed-on-addeventlistener-on-ie11/48101139#48101139
        for(let i = 0, s = todosToday.length; i < s; i++) {
            const a = makeElem("a"),
                spanHour = makeElem("span"),
                spanTodo = makeElem("span");
            //todosToday[i] won't be passed through a.addEventListener because of scope
            //attach todo in element "a" and access it as its property.
            a.todo = todosToday[i];
            a.classList.toggle("single-entry")
            spanTodo.classList.toggle("col-todos");
            spanHour.classList.toggle("col-hours");
            
            // a.setAttribute("href", "/todo/" + todosToday[i]._id);
            a.addEventListener("click", function() {
                resetTodosHeight(modContent);
                showFoundTodo(a.todo);
                });
            spanHour.textContent = todosToday[i].frmHr + ":" + todosToday[i].frmMin + " - " +
                            todosToday[i].toHr + ":" + todosToday[i].toMin;
            spanTodo.textContent = todosToday[i].title;
            a.appendChild(spanHour);
            a.appendChild(spanTodo);
            fragTodos.appendChild(a);
        }

        entries.appendChild(fragTodos);
        showTodoDiv.appendChild(entries);
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
            todosDateHeight = window.innerHeight - (parseInt(containerHeight) + parseInt(navHeight)) - 10, //10px is margin-top of index-container
            modContent = getId("modContent"),
            elem = getId(x);
            
        modContent.style.setProperty("height", todosDateHeight + "px");
        if(x) {
            elem.style.setProperty("height", modContent.scrollHeight + "px");
        }
        
    }
    // use to sort todosToday array (of objects)
    function compareTimes(a,b) {
        if(parseInt(a.frmHr + a.frmMin) < parseInt(b.frmHr + b.frmMin)) {
            return - 1;
        } else if(parseInt(a.frmHr + a.frmMin) > parseInt(b.frmHr + b.frmMin)) {
            return 1;
        }
        // if a.frmHr and b.frmHr are equal
        return 0;
    }
    
    function makePeriodSelectBtns() {
        const periodSelect = getId("periodSelect");
        //  initial values
        // <i class="large material-icons">insert_chart</i>
        // periodSelect.classList.toggle("period-icon");
        periodSelect.textContent = "arrow_back";
        periodSelect.dataset.period = "month";
        periodSelect.addEventListener("click", switchPeriod);
    }
    
    function switchPeriod() {
        const monthList = getId("monthList"),
            yearList = getId("yearList"),
            calendar = getId("calendar"),
            yearTitle = getId("yearTitle"),
            addNewTodo = getId("addNewTodo");

        if(this.dataset.period === "year") {
            monthList.classList.toggle("no-display");
            yearTitle.classList.toggle("no-display");
            if(yearList) {
                yearList.classList.toggle("no-display");
            } else {
                makeList("year");
            }
            // this.classList.toggle("no-display");
            this.textContent = "date_range";
        }
        else if(this.dataset.period === "month") {
            // note: if I try to put container in variable, it won't work.
            // see https://stackoverflow.com/questions/42956884/failed-to-execute-removechild-on-node
            calendar.removeChild(getId("container"));
            clearEntries();
            if(monthList && yearTitle) {
                monthList.classList.toggle("no-display");
                yearTitle.classList.toggle("no-display");
                yearTitle.firstChild.textContent = fullDate.year;
            } else {
                makeYearHeader();
                makeList("month");
            }
            this.dataset.period = "year";
            // this.textContent = "view_module";
            addNewTodo.classList.toggle("no-display");
        }
    }
    
    function removeColour() {
        let selectedDate = document.getElementsByClassName("selected-date")[0];
        if(selectedDate) {
            selectedDate.classList.toggle("selected-date");
        }
        
    }  
    
    function putColour(elem) {
        elem.parentNode.classList.toggle("selected-date");
    }

    function showFoundTodo(todo) {
        // console.log(todo);
        const modContent = getId("modContent"),
            form = makeElem("form"),
            btnDel = makeElem("i"),
            btnEdit = makeElem("i"),
            btnBack = makeElem("i"),
            showFoundTodoDiv = makeElem("div"),
            showArr = ["time", "title", "description"],
            btnArr = [btnEdit, btnDel, btnBack],
            frag = document.createDocumentFragment(),
            addNewTodo = getId("addNewTodo"),
            span = makeElem("span");
   
        clearEntries();
        
        if(!addNewTodo.classList.contains("no-display")) {
            addNewTodo.classList.toggle("no-display");
        }
        

        
        showArr.forEach(function(t) {
            let x = makeElem("div");
            if(t === "time") {
                let icon = makeElem("i");
                span.textContent = todo.frmHr + ":" + todo.frmMin + " - " + todo.toHr + ":" + todo.toMin;
                icon.classList.toggle("material-icons");
                icon.textContent = "access_time";
                x.appendChild(icon);
                x.appendChild(span);
                x.classList.toggle("todo-show-time");

            } else {
                x.textContent = todo[t];
                x.classList.toggle("todo-show-content");
                (t==="title" ? x.classList.toggle("content-title") : x.classList.toggle("content-desc"));
            }
            frag.appendChild(x);
        })
        // id
        showFoundTodoDiv.id = "showFoundTodoDiv";
        // class
        btnArr.forEach(function(btn) {
            let iconCont = createIcon(btn);
            
            if(btn === btnEdit) {
                iconCont.classList.toggle("icon-edit-pos");
                btn.classList.toggle("icon-edit");
                btn.dataset.mode = btn.textContent = "edit";
                btn.addEventListener("click", function() {
                    resetTodosHeight(modContent);
                    createOrEditTodo({index: "updTodo", todo: todo});
                });
                frag.appendChild(iconCont);
            } else if(btn === btnDel) {
                iconCont.classList.toggle("icon-del-submit-pos");
                btn.classList.toggle("icon-delete");
                btn.dataset.mode = "delete";
                btn.textContent = "delete_forever";
                btn.addEventListener("click", function() {
                    event.preventDefault();
                    makeRequest({index: "delTodo", todo: todo}); //xmlhttprequest
                });
                form.appendChild(iconCont);
                frag.appendChild(form);
            } else if(btn === btnBack) {
                iconCont.classList.toggle("icon-back-pos");
                btn.classList.toggle("icon-back");
                btn.dataset.mode = "back";
                btn.textContent = "arrow_back";
                btn.addEventListener("click", function() {
                    addNewTodo.classList.toggle("no-display");
                    showTodos(); //if not using anonym function, clickedElem parametre in showTodos will be the event (mouseclick)
                });
                frag.appendChild(iconCont);
            }
            
            
        });
        showFoundTodoDiv.appendChild(frag);
        modContent.appendChild(showFoundTodoDiv);
    }
    
    function createOrEditTodo(obj) {
        if(getId("showTodoDiv")) {
            let showTodoDiv = getId("showTodoDiv");
            showTodoDiv.classList.toggle("no-display");
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
            form = makeElem("form"),
            btnBack = makeElem("i"),
            submitTodo = makeElem("i"),
            // submitForm = makeElem("input"),
            iconContBack = createIcon(btnBack),
            iconContSub = createIcon(submitTodo),
            objInput = {
                makeInput: function(x) {
                    let input;
                    if(x === "title") {
                        input = makeElem("input");
                        input.type = ("text");
                        input.setAttribute("maxlength", 15);
                    } else if(x === "description") {
                        input = makeElem("textarea");
                        input.setAttribute("maxlength", 140);
                    }
                    input.required = "required";
                    
                    input.name = x;
                    if(obj.index === "updTodo") {
                        input.value = obj.todo[x];
                    } else if(obj.index === "newTodo") {
                        input.placeholder = x;
                    }
                    return input;
                }
            },
       
            title = objInput.makeInput("title"),
            desc = objInput.makeInput("description"),
			dateDiv = makeElem("div"),
			timeDiv = makeElem("div");
        // variables for options
        let todoArr = [0,1,2,3,4,5,6], start = 0, end = 0, selectName = "", selectId = "", showFoundTodoDiv;
        
        if(obj.index === "updTodo") {
            todoArr = [obj.todo.date, obj.todo.month, obj.todo.year, obj.todo.frmHr, obj.todo.frmMin, obj.todo.toHr, obj.todo.toMin];
        }

        for(let i = 0, s = todoArr.length; i < s; i++) {
            let select = makeElem("select");
            switch(i) {
				case 0: // todo.date
                    start = 1;
                    end = fullDate.maxDates;
                    selectName = "date";
                    selectId = "formDate";
                    break;
                case 1: // todo.month
                    start = 0;
                    end = 11;
                    selectName = "month";
                    selectId = "formMonth";
                    break;
                case 2: // todo.year
                    start = 2000;
                    end = 2099;
                    selectName = "year";
                    selectId = "formYear";
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
                    } else if(selectId === "formDate" && optns.textContent === String(fullDate.date)) {
                        optns.selected = true;
                    } else if(selectId === "formFrmHr" || selectId === "formFrmMin" || selectId === "formToHr" || selectId === "formToMin") {
                        if(optns.textContent === "00") {
                            optns.selected = true;
                        }
                    }
                }

                select.appendChild(optns);
            }

            if(selectId === "formYear" || selectId === "formMonth" || selectId === "formDate") {
                dateDiv.appendChild(select);
                form.appendChild(dateDiv);

            } else if(selectId === "formFrmHr" || selectId === "formFrmMin" || selectId === "formToHr" || selectId === "formToMin"){
				timeDiv.appendChild(select);
                form.appendChild(timeDiv);
            }
            
            // add events
            if(selectId === "formYear" || selectId === "formMonth") {
                select.addEventListener("change", checkOptions);
            } else if(selectId !== "formYear" || selectId !== "formMonth") {
                select.addEventListener("change", removeWarning);
            }                
            
        }
        
        // ids, classes, attributes, textContent
        formTodoDiv.id = "formTodoDiv";
        submitTodo.id = "submitTodo";
        form.id = "formTodo";
        // submitForm.setAttribute("type", "submit");
        
        if(getId("showFoundTodoDiv")) {
             showFoundTodoDiv = getId("showFoundTodoDiv");
             showFoundTodoDiv.classList.toggle("no-display");
        }
        
        btnBack.textContent = "arrow_back";
        submitTodo.textContent = "check";

        // events
        btnBack.addEventListener("click", function() {
            modContent.removeChild(getId("formTodoDiv"));
            if(getId("showFoundTodoDiv")) {
                showFoundTodoDiv.classList.toggle("no-display");
            }
            if(obj.index === "newTodo") {
                let addNewTodo = getId("addNewTodo");
                addNewTodo.classList.toggle("no-display");
                if(getId("showTodoDiv")) {
                    let showTodoDiv = getId("showTodoDiv");
                    showTodoDiv.classList.toggle("no-display");
                }
            }
        });
        //update todo xmlhttprequest
        // form.addEventListener("submit", function(event) {
        //     event.preventDefault();
        //     validateForm({index: obj.index, form: this, todo: obj.todo});
        // });
        submitTodo.addEventListener("click", function(event) {
            event.preventDefault();
            validateForm({index: obj.index, form: getId("formTodo"), todo: obj.todo});
        });
        
        // classes
        title.classList.toggle("form-title");
		desc.classList.toggle("form-desc");
		dateDiv.classList.toggle("form-date");
		timeDiv.classList.toggle("form-time");
		// btnBack.classList.toggle("icon-back-pos");
        // append
        // let iconContBack = createIcon(btnBack);
        // let iconContSub = createIcon(submitTodo);
        iconContBack.classList.toggle("icon-back-pos");
        iconContSub.classList.toggle("icon-del-submit-pos");
        // submitForm.appendChild(iconContSub);
        form.insertBefore(desc, form.firstChild);
        form.insertBefore(title, form.firstChild);
        form.appendChild(iconContSub);
        form.appendChild(iconContBack);
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
            for(let i = 0, s = Object.keys(monthList).length; i < s; i++) {
                if(monthList[i] === input) {
                    return i;
                }
            }
        } else if(typeof input === "number") {
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
            toHr.classList.toggle("warning");
            pass = false;
        } else if(hrEqual && minGreat) {
            event.preventDefault();
            toMin.classList.toggle("warning");
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
                option.classList.toggle("warning");
            }
            
        });
    }
    
    function createIcon(btn) {
        const iconHeight = makeElem("div"),
            iconInner = makeElem("div"),
            iconCont = makeElem("div");
            
        iconHeight.classList.toggle("icon-full-height");
        iconInner.classList.toggle("icon-inner");
        iconCont.classList.toggle("icon-container");
            
        iconCont.appendChild(iconInner);
        iconInner.appendChild(iconHeight);
        iconHeight.appendChild(btn);
        
        btn.classList.toggle("material-icons");
        btn.classList.toggle("icon-mode");
        
        return iconCont;
    }

    // window.addEventListener("resize", function() {
    //     if(document.body.clientWidth >= 768) {
    //         document.getElementsByClassName("nav-menu")[0].classList.toggle("no-display");
    //         document.getElementsByClassName("nav-hamburger")[0].classList.toggle("no-display");
    //     }
    //     if(document.body.clientWidth <= 768) {
    //         document.getElementsByClassName("nav-menu")[0].classList.toggle("no-display");
    //         document.getElementsByClassName("nav-hamburger")[0].classList.toggle("no-display");
    //     }
    // });
    
    // window.addEventListener("load", function() {
    //     if(document.body.clientWidth >= 768) {
    //         document.getElementsByClassName("nav-hamburger")[0].classList.toggle("no-display");
    //     }
    //     if(document.body.clientWidth <= 768) {
    //         document.getElementsByClassName("nav-hamburger")[0].classList.toggle("no-display");
    //     }
            

    // });
    

    
runOnPageLoad();

})();




