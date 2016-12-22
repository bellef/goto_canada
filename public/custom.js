// On document ready
document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById("country-select").onchange = function() {
    window.location.href = window.location.origin + this.value;
  };
  // Set value of select to currently selected item
  var elem = document.getElementById("country-select");
  elem.value = '/' + window.location.search.split("&")[0];
});