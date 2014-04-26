chrome.runtime.sendMessage({
    method: "GET",
    action: "xhttp",
    url: "http://newice.herokuapp.com/",
    data: ""
}, function(responseText) {
    //alert(responseText);
    document.getElementById("loading_agenda").innerHTML = responseText;
    /*Callback function to deal with the response*/
});