// get form submission and validate times
document.getElementById("submitForm").addEventListener("click", validateForm);

var frmHr = document.getElementsByTagName("select")["todo[frmHr]"]; 
var frmMin = document.getElementsByTagName("select")["todo[frmMin]"];
var toHr = document.getElementsByTagName("select")["todo[toHr]"];
var toMin = document.getElementsByTagName("select")["todo[toMin]"];

function validateForm() {
    if(toHr.value < frmHr.value) {
        event.preventDefault();
        toHr.style.color = "red";
    }
    
    if(toHr.value === frmHr.value && toMin.value < frmMin.value) {
        event.preventDefault();
        toMin.style.color = "red";
    }
    
}


[frmHr, frmMin, toHr, toMin].forEach(function(option) {
    // console.log(option);
    option.addEventListener("change", function() {
        if(this.style.color === "red") {
            this.style.color = "black";
        }
        // console.log(this);
    });
});




