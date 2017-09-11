// get elements

var date = document.getElementById("date");
var month = document.getElementById("month");
var year = document.getElementById("year");



// add event listeners for when user changes year or month to populateDate
month.addEventListener("change", populateDate);
year.addEventListener("change", populateDate);

// get dates for any given combination of year+month
function populateDate() {
    // if the dropdown is already populated, clear entries
    if(document.getElementsByClassName("dateOptions").length > 0) {
        for(var i=document.getElementsByClassName("dateOptions").length - 1; i >= 0; i--) {
            document.getElementsByClassName("dateOptions")[i].remove();
        }
    }
    
    // get year and date values each time
	var year = document.getElementById("year").value;
	var month = document.getElementById("month").value;
	
    // get number of dates
    // i.e. (2017, 5, 0) is last day of previous month
    // May 31st, 2017 (5 = June, month is zero-based)
	var dates = new Date(year, month,0).getDate();
	for (var i=1;i <= dates;i++) {
		var elem = document.createElement("option");
		if(i < 10) {
		    elem.textContent = "0" + i;
		} else {
		    elem.textContent = i;
		}
		elem.classList.add("dateOptions");
		date.appendChild(elem);
    }
}





