- Current task
    - give time on todo - Y
    - user authentication! - Y
    - associate every todo with a user - Y
    - close gateways if user is already logged in. - Y
    - heroku and git
    - add currentUser to todo routes so header can access them (for navbar logged in as.., logout, show/hide register and login links) - Y
    - made changes to edit.ejs to propery update todo and display current todo to be edited - Y
    - edit.ejs default values using "selected disabled hidden" attributes in option - Y
    - make sure that To time is less than From time
    - change format from req.body.todo update route to number format in stored todo object - Y
    - Use Date Object - Y
    - Date(year, month, 0) will give number of dates in any given month - Y
        - month is zero-based, days is 1-31. 0 means last day of last month.
        - new Date(2017,9,0) while 9 = august, is actually 2017/08/31.
    - use script to populate date selection using year and month - Y
    - make changes in edit.ejs, schemas/models and routes to accommodate month, year, date - Y
    - overlapping times!!! (and dates, years, months)!!!
    - make changes to new and edit, where default month is current month for new - Y
        - build it so date will always dynamically populate given month
    - flash messages for when username already exists in signup - Y
        - npm install connect-flash
        - use res.locals.error and .success access flash in every template
        - req.flash("error") or "success" before you redirect to page
    - clean up look! (bootstrap 4 beta)
    - make changes in how data is displayed in "/todo"
        - list all years, then choose month, display month as calendar (do all in a single page!)
        - complicated! :(
        - transition to a calendar app??
        - "/" dynamically create calendar using JS?
        - REBUILD NEW AND EDIT EJS!!! Tie-in to index.ejs. That way, users only need to pick from and to hours. select year, month, date in index! total overhaul. :(
        - REBUILD INDEX.EJS!
        - click on date and it shows todo-list (show ejs) for that date. Must pass on completeDate to backend.
        - add a back button when showing specific todos in a single date to last known calendar screen!
        - passed todos ejs variable to todoCalendar.js for use with displaying titles and creating links to show todos in a given date
        - make dates in calendar a certain height. display only first 2-3 items
        - move Add New Todo link only when showing todos in a single date
        - default index page should be current month and year - set completeDate obj values in todoCalendar.js
        - move code out of document-ready function
        - combine functional, oop, and make code more readable (how???)
        - remove arrows for monthlist and year; show year in monthlist.
        - make prev and next button usable with dates, not just month
        - work on add new todo page! remove add new todo and make it appear only in date? month?
        - hold prev and next buttons to go through months. See your Pomodoro javascript on github! https://github.com/rdollent/FCC_Pomodoro/blob/master/index.js
        - tackle xmlhttprequest javascript!
        - make year selection dropdown.
        - change designs, bootstrap (or foundation???), overall look and feel for ALL pages.
        - remove entries in calendar. instead, put a marker on to which dates have a todo.
        - remove change when clicking on a date and removing calendar. instead. click on date and reveal a div wihch contains all entries?
        - change previous and next innerText into icons
        - put indicator as to which date is selected.
        - detect height of calendar, screen height, apply appropriate height to list of todos (showtodos), overflow: hidden
        - move previous and next buttons right by title header (how? write btns id workaround)
        - separate buttons and title header with the rest of calendar!
        - tblHeader is redundant
        - make calendar fit mobile better
        - sort showTodos by hour, remove styling on links, limit characters for description, limit characters for desc display to ellipses (...)
        - do not show hours that are before the From hours on a new todo
        - remove month and year buttons - click on month header for monthList, click on year header for yearList!
        - separate todos today list and times (how? make separate divs, make them inline-block, all contain in todosDateList)
        - calculate screen height. if colHours and colTodos height < screenheight, fill it.
        - make it an SPA. Make routes into xmlhttprequests. how?
            - remove show route since all the data i'll need is already loaded. rework links.
            - modify edit route to work on single page.
            - how to detect when month has 28, 29, 30 or 31 dates? figure it out.
            - hours are in string format. generate strings in dialogue boxes for minutes and hours!
            - submit button in edit, submit click event verifies values and e.preventDefault() if incorrect or logically wrong
            - dont make update route refresh page. instead, just do ajax call on specific date after Delete or Edit.
            - fix Delete button so it deletes entry and do a makeRequest!
        - change monthList and yearList to drop-downs
        - design changes, afterwards read up on Javascript and make code better!
        - fix date generation in edit/new todo form (always 31 days)
        - fix icon placements on mobile (adjusts when keyboard appears)
- Time
    - drop down?
    - interval? Must be to the minute
    - time and tasks are tied together!
    - how to detect overlapping times, and not record them or ask to overwrite them..
- Todo
    - similar to comments
    - associated with a given time
    - use RESTful routes for todo
    - fix the existing routes and pages to reflect association with time

- Future requirements
    - Day/Date/Year
    - login and signup
    - User auth
    - User association with todos
    - Deployment On Heroku


- 09.04.2017
    - npm install mongoose, express, etc.
    - install mongodb
    - check package.json
    - todo model
    - built RESTful routes for todo and created todo/ejs files
    - created seeds file
    - added user model
    - added login and register ejs
    - added authentication
    - added isLoggedIn middleware
    - check package.json
    - passport, passport-local, passport-local-mongoose
    - built in user to todo model
    - built headers and footers
    - added bootstrap
    - included header and footer into todo ejs

    
    
git resetting last commit notes:
https://gist.github.com/gunjanpatel/18f9e4d1eb609597c50c2118e416e6a6

==============================================================================
function constructor
function Person(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
}

Person.prototype.greet = function() {
    console.log(this.firstname + " " + this.lastname);
    
}

var john = new Person("John", "Doe");
john.greet();
=============================================================================



==== how to run mongod====

https://community.c9.io/t/how-do-i-run-mongod-in-my-workspace/5626/2

Running MongoDB on a Cloud9 workspace
MongoDB is preinstalled in your workspace. To run MongoDB, run the following below (passing the correct parameters to it). Mongodb data will be stored in the folder data.

$ mkdir data
$ echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
$ chmod a+x mongod
You can start mongodb by running the mongod script on your project root:

$ ./mongod


==================

https://stackoverflow.com/questions/41712122/want-to-install-mongodb-on-cloud9-local-server



====== reinstall nodemon

https://www.npmjs.com/package/nodemon


=== express to react

https://blog.cloudboost.io/react-express-the-nodejs-way-of-reacting-and-expressing-7a518e4da3