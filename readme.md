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
    - Date(year, month, 0) will give number of dates in any given month
        - month is zero-based, days is 1-31. 0 means last day of last month.
        - new Date(2017,9,0) while 9 = august, is actually 2017/08/31.
    - use script to populate date selection using year and month
    - disable month option before picking year, and disable date option until after user chooses month
    - make changes in edit.ejs, schemas/models and routes to accommodate month, year, date
    - overlapping times!!! (and dates, years, months)!!!
    - make changes to new and edit, where default month is current month for new
        - build it so date will always dynamically populate given month
    

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

    
    
    