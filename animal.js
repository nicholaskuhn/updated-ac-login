/**
 * Run command to build JsDoc:
 * jsdoc animal.js -d=./docs/
 */
/** Date array to store events  */
var myDateArray = "";
/** Holds the ID that the user clicked to sign in */
var selectedId = "";
/** Holds the ID of the person currently signed in (or "" if no one is signed in) */
var loggedIn = "";
/** For passing to the EventDates.php file to add events */
var adding = "";
/** For displaying the status of logging in/out */
var loginStatus;
/** Used to check if anyone is still logged in on startup */
var startupLoginCheck;
/** For telling if the application has been reloaded or not */
var firstLoad = true;
/** For telling if someone is still logged in */
var stillLogged = true;
/** Array for holding items */
var itemArray;
/** Array for holding event info */
var myEventArray;
/** Tells if event div is open */
var openEvent = false;
/** User1 id paragraph */
var user1Id = document.getElementById('User1');
/** User2 id paragraph */
var user2Id = document.getElementById('User2');
/** Item name box input */
var itemNameBox = document.getElementById('itemNameBox');
/** Item type radio */
var itemTypeSelected = document.getElementsByName('itemType');
/** Add item button */
var addItemBtn = document.getElementById('addItemBtn');
/** Table for museum items */
var tableHeader = document.getElementById("tableHeader");
/** Calendar date input */
var calendarDate = document.getElementById("calendarDate");
/** Event info */
var eventItems = document.getElementById('eventItems');
/** Add Event button to open div */
var openEventBtn = document.getElementById('openEventBtn');
/** Event name input box */
var eventNameBox;
/** Event description input box */
var eventDescriptionBox;
/** Add event button */
var addEventBtn;
/** Calendar events div for showing events */
var calendarEvents = document.getElementById("calendarEvents");
/** Submit button for uploading */
var submitBtn = document.getElementById("submitBtn");
/** Div to hide upload */
var displayUpload = document.getElementById("displayUpload");

/** Loads database stuff when first started up */
pageLoad();

/**
 * Formats date into workable format
 * Source: https://stackoverflow.com/questions/10632346/how-to-format-a-date-in-mm-dd-yyyy-hhmmss-format-in-javascript
 */
var d = new Date(),
    dateFormatted = [d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()].join('-');

Number.prototype.padLeft = function (base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
};

/**
 * Opens and destroys event inputs
 */
if(openEventBtn){
  openEventBtn.addEventListener('click', function () {
      if (!openEvent) {

          var eventNameLabelVar = document.createElement("label");
          eventNameLabelVar.id = "eventNameLabel";
          eventNameLabelVar.appendChild(document.createTextNode("Event Name: "));
          eventNameLabelVar.style.paddingRight = "48px";

          var eventDescriptionLabelVar = document.createElement("label");
          eventDescriptionLabelVar.id = "eventDescriptionLabel";
          eventDescriptionLabelVar.appendChild(document.createTextNode("Event Description: "));
          eventDescriptionLabelVar.style.paddingRight = "5px";

          var eventNameInputBox = document.createElement("input");
          var eventDescriptionInputBox = document.createElement("input");
          eventNameInputBox.type = "text";
          eventNameInputBox.id = "eventNameBox";

          eventDescriptionInputBox.type = "text";
          eventDescriptionInputBox.id = "eventDescriptionBox";

          var addEventBtnVar = document.createElement("button");
          addEventBtnVar.id = "addEventBtn";
          addEventBtnVar.appendChild(document.createTextNode("Add"));

          eventItems.appendChild(document.createElement("br"));
          eventItems.appendChild(eventNameLabelVar);
          eventItems.appendChild(eventNameInputBox);
          eventItems.appendChild(document.createElement("br"));
          eventItems.appendChild(eventDescriptionLabelVar);
          eventItems.appendChild(eventDescriptionInputBox);
          eventItems.appendChild(document.createElement("br"));
          eventItems.appendChild(addEventBtnVar);

          addEventBtn = document.getElementById("addEventBtn");
          eventNameBox = document.getElementById("eventNameBox");
          eventDescriptionBox = document.getElementById("eventDescriptionBox");

          addEventBtn.addEventListener('click', function () {
              addEventItem();
          });

          eventDescriptionBox.addEventListener('keyup', function (e) {
              if (13 === e.keyCode) {
                  addEventItem();
              }
          });
          openEvent = true;
      } else {
          while (eventItems.hasChildNodes()) {
              eventItems.removeChild(eventItems.lastChild);
          }
          openEvent = false;
      }
  });
}
/**
 * Sets the selected id for the first user
 */
if(user1Id){
  user1Id.addEventListener('click', function () {
      selectedId = "nick";
      handleLogin();
  });
}
/**
 * Sets the selected id for the second user
 */
if(user2Id){
  user2Id.addEventListener('click', function () {
      selectedId = "aubryn";
      handleLogin();
  });
}
/**
 * Adds an event listener to add items to the database
 */
if(addItemBtn){
  addItemBtn.addEventListener('click', function () {
      runAddItem();
  });
}
/**
 * Gets stuff from database with each input. Enter calls Add, backspace and blank
 * input box will clear the area
 */
if(itemNameBox){
  itemNameBox.addEventListener('keyup', function (e) {
      if (8 === e.keyCode || 46 === e.keyCode) {
          if (itemNameBox.value.trim() === "") {
              while (tableHeader.hasChildNodes()) {
                  tableHeader.removeChild(tableHeader.lastChild);
              }
          }
      }
      if (13 === e.keyCode) {
          runAddItem();
      } else {
          var itemName = itemNameBox.value;
          getFromDatabase(itemName.toLowerCase());
      }
  });
}
/**
 * Adds an event listener to check for an event on the calendarDate in the input
 */
if(calendarDate){
  calendarDate.addEventListener('keyup', function () {
      checkForEvent();
  });
}
/**
 * Adds an event listener to inform the user that they have submitted a file for upload
 */
if(submitBtn){
  submitBtn.addEventListener('click', function () {
      document.getElementById("submittedText").appendChild(document.createTextNode("Submitted!"));
      setTimeout(function () {
          document.getElementById("submittedText").removeChild(document.getElementById("submittedText").firstChild);
      }, 2000);
  });
}
/**
 * Used to get events based on date
 * @param {String} EventDateParam is the date to get events from
 * @param {boolean} getParam is just so the PHP knows what to call
 */
function getFromEvent(EventDateParam, getParam) {
    $.ajax({
        type: 'get',
        url: 'EventDates.php',
        data: {
            eventDate: EventDateParam,
            get: getParam
        },
        success: function (data) {
            myEventArray = JSON.parse(data);
            displayEventArrayData();
        }
    });
}

/**
 * Gets events for the calendar widget when the page
 * loads and the calendar has to be updated
 * @param {String} EventDateParam will be null
 * @param {int} getParam is only used to run specific content in the PHP
 */
function getFromEventLoad(EventDateParam, getParam) {
    $.ajax({
        type: 'get',
        url: 'EventDates.php',
        data: {
            eventDate: EventDateParam,
            get: getParam
        },
        success: function (data) {
            myDateArray = JSON.parse(data);
        }
    });
}

/**
 * Adds the event to the database
 * @param {String} eventNameParam is the event name
 * @param {String} eventDescriptionParam is the event description
 * @param {String} EventDateParam is the date
 */
function postToEvent(eventNameParam, eventDescriptionParam, EventDateParam) {
    $.ajax({
        type: 'post',
        url: 'EventDates.php',
        data: {
            eventName: eventNameParam,
            eventDescription: eventDescriptionParam,
            eventDate: EventDateParam
        },
        success: function (data) {
            document.getElementById("eventResult").appendChild(document.createTextNode(data));
            setTimeout(function () {
                document.getElementById("eventResult").removeChild(document.getElementById("eventResult").firstChild);
            }, 3000);
        }
    });
}

/**
 * Adds item to the database
 * @param {String} itemNameParam is the item name
 * @param {String} donatorNameParam is the user currently signed in
 * @param {Date} dateDonatedParam is the current date
 * @param {String} itemTypeParam is the radio button item type selected
 * @param {boolean} addingParam is just to tell the PHP which SQL to run
 */
function postItemToDatabase(itemNameParam, donatorNameParam, dateDonatedParam, itemTypeParam, addingParam) {
    $.ajax({
        type: 'post',
        url: 'MuseumDB.php',
        data: {
            itemName: itemNameParam,
            donatorName: donatorNameParam,
            dateDonated: dateDonatedParam,
            itemType: itemTypeParam,
            adding: addingParam
        },
        success: function (data) {
            document.getElementById("result").appendChild(document.createTextNode(data));
            setTimeout(function () {
                document.getElementById("result").removeChild(document.getElementById("result").firstChild);
            }, 2000);
        }
    });
}

/**
 * Gets the items from the database based on the item name
 * @param {String} itemNameParam is the user's current input into the item name box
 */
function getFromDatabase(itemNameParam) {
    $.ajax({
        type: 'post',
        url: 'MuseumDB.php',
        data: {
            itemName: itemNameParam
        },
        success: function (data) {
            if (data !== "") {
                itemArray = JSON.parse(data);
                displayArrayData();
            }
        }
    });
}

/**
 * Called on page load to populate calendar and check login
 */
function pageLoad() {
    registerUserLogin(null, '3', null);
    getFromEventLoad(null, 2);
}

/**
 * Checks for events based on the date in the input box
 */
function checkForEvent() {
    var properDate = calendarDate.value.split("/").reverse();
    var temp = properDate[2];
    properDate[2] = properDate[1];
    properDate[1] = temp;
    properDate = properDate.join("-");

    if (isValidDate(properDate)) {
        getFromEvent(properDate, true);
    }
}

/**
 * Adds the event based on the date
 */
function addEventItem() {
    var properDate = calendarDate.value.split("/").reverse();
    var temp = properDate[2];
    properDate[2] = properDate[1];
    properDate[1] = temp;
    properDate = properDate.join("-");

    if (eventNameBox.value.trim() === "") {
        document.getElementById("eventResult").appendChild(document.createTextNode("Please enter in an event name"));
        setTimeout(function () {
            document.getElementById("eventResult").removeChild(document.getElementById("eventResult").firstChild);
        }, 3000);
    } else if (eventDescriptionBox.value.trim() === "") {
        document.getElementById("eventResult").appendChild(document.createTextNode("Please enter in an event description"));
        setTimeout(function () {
            document.getElementById("eventResult").removeChild(document.getElementById("eventResult").firstChild);
        }, 3000);
    } else if (isValidDate(properDate)) {
        var eventName = eventNameBox.value;
        var eventDate = properDate;
        var eventDescription = eventDescriptionBox.value;
        postToEvent(eventName, eventDescription, eventDate);
        eventNameBox.value = "";
        eventDescriptionBox.value = "";

        reloadCalendar();
        checkForEvent();
    } else {
        document.getElementById("eventResult").appendChild(document.createTextNode("Please enter the date in the proper format mm/dd/yyyy"));
        setTimeout(function () {
            document.getElementById("eventResult").removeChild(document.getElementById("eventResult").firstChild);
        }, 3000);
    }
}

/**
 * Reloads the calendar to be accurate to the current user
 */
function reloadCalendar() {
    getFromEventLoad(null, 2);
    $("#calendarDate").datepicker("destroy");

    var found = false;

    $("#calendarDate").datepicker({
        beforeShowDay: function (date) {
            date = $.datepicker.formatDate('yy-mm-dd', date);
            console.log(date);
            for (var i = 0; i < myDateArray.length; i++) {
                if (date === myDateArray[i].eventDate) {
                    found = true;
                }
            }
            if (found) {
                found = false;
                return [true, 'eventDate', 'eventExists'];
            } else {
                return [true, '', ''];
            }
        },
        onSelect: function () {
            $(this).change();
        }
    });
    $('#calendarDate').on('change', function () {
        checkForEvent();
    });
}

/**
 * Displays the events in the myEventArray
 */
function displayEventArrayData() {
    while (calendarEvents.hasChildNodes()) {
        calendarEvents.removeChild(calendarEvents.lastChild);
    }

    for (var i = 0; i < myEventArray.length; i++) {

        var div = document.createElement("div");
        var h3 = document.createElement("h3");
        var p = document.createElement("p");
        var text = myEventArray[i].eventDescription;
        var imgArray;

        h3.appendChild(document.createTextNode(toTitleCase(myEventArray[i].eventName)));
        div.appendChild(h3);
        p.appendChild(document.createTextNode(text));
        imgArray = checkForImage(text);

        if (imgArray[0] !== '') {
            for (var k = 0; k < imgArray.length; k++) {
                if (imgArray[k]) {
                    var img = document.createElement("img");
                    img.src = imgArray[k];
                    div.appendChild(img);
                }
            }
        }
        div.appendChild(p);
        calendarEvents.appendChild(div);
    }
}

/**
 * Checks the event description text for special NPC character names and adds their picture to the event
 * @param {String} text
 */
function checkForImage(text) {

    var imgArray = new Array(31);
    var index = 0;

    text = text.toLowerCase();

    if (text.search(/\bjingle\b/) >= 0)
        imgArray[index] = "images/jingle.png";
    if (text.search(/\bblanca\b/) >= 0)
        imgArray[++index] = "images/blanca.png";
    if (text.search(/\bblathers\b/) >= 0)
        imgArray[++index] = "images/blathers.png";
    if (text.search(/\bbooker\b/) >= 0)
        imgArray[++index] = "images/booker.png";
    if (text.search(/\bchip\b/) >= 0)
        imgArray[++index] = "images/chip.png";
    if (text.search(/\bcopper\b/) >= 0)
        imgArray[++index] = "images/copper.png";
    if (text.search(/\bredd\b/) >= 0)
        imgArray[++index] = "images/redd.png";
    if (text.search(/\bgracie\b/) >= 0)
        imgArray[++index] = "images/gracie.png";
    if (text.search(/\bgulliver\b/) >= 0)
        imgArray[++index] = "images/gulliver.png";
    if (text.search(/\bjack\b/) >= 0)
        imgArray[++index] = "images/jack.png";
    if (text.search(/\bjoan\b/) >= 0)
        imgArray[++index] = "images/joan.png";
    if (text.search(/\bkapp\b/) >= 0 ||
        text.search(/\bkappn\b/) >= 0 ||
        text.search(/\bkapp'n\b/) >= 0)
        imgArray[++index] = "images/kappn.png";
    if (text.search(/\bkatrina\b/) >= 0)
        imgArray[++index] = "images/katrina.png";
    if (text.search(/\bmabel\b/) >= 0)
        imgArray[++index] = "images/mabel.png";
    if (text.search(/\bdon\b/) >= 0 ||
        text.search(/\bdon resetti\b/) >= 0)
        imgArray[++index] = "images/don.png";
    if (text.search(/\bresetti\b/) >= 0)
        imgArray[++index] = "images/resetti.png";
    if (text.search(/\bpelly\b/) >= 0)
        imgArray[++index] = "images/pelly.png";
    if (text.search(/\bpete\b/) >= 0)
        imgArray[++index] = "images/pete.png";
    if (text.search(/\bphyllis\b/) >= 0)
        imgArray[++index] = "images/phyllis.png";
    if (text.search(/\bporter\b/) >= 0)
        imgArray[++index] = "images/porter.png";
    if (text.search(/\brover\b/) >= 0)
        imgArray[++index] = "images/rover.png";
    if (text.search(/\bsable\b/) >= 0)
        imgArray[++index] = "images/sable.png";
    if (text.search(/\bsaharah\b/) >= 0)
        imgArray[++index] = "images/saharah.png";
    if (text.search(/\bsnowman\b/) >= 0 ||
        text.search(/\bsnow man\b/) >= 0)
        imgArray[++index] = "images/snowman.png";
    if (text.search(/\btimmy\b/) >= 0)
        imgArray[++index] = "images/tommy.png";
    if (text.search(/\btom nook\b/) >= 0 ||
        text.search(/\btom\b/) >= 0)
        imgArray[++index] = "images/tom.png";
    if (text.search(/\btommy\b/) >= 0)
        imgArray[++index] = "images/tommy.png";
    if (text.search(/\btortimer\b/) >= 0)
        imgArray[++index] = "images/tortimer.png";
    if (text.search(/\btotakeke\b/) >= 0 ||
        text.search(/\bkk\b/) >= 0 ||
        text.indexOf("k.k.") >= 0 ||
        text.search(/\bslider\b/) >= 0)
        imgArray[++index] = "images/totakeke.png";
    if (text.search(/\bwendell\b/) >= 0)
        imgArray[++index] = "images/wendell.png";
    if (text.search(/\bwisp\b/) >= 0)
        imgArray[index] = "images/wisp.png";


    return imgArray;
}

/**
 * Displays the items in the array based on user input into item name box
 */
function displayArrayData() {
    while (tableHeader.hasChildNodes()) {
        tableHeader.removeChild(tableHeader.lastChild);
    }
    var th1 = document.createElement("th");
    var th2 = document.createElement("th");
    var th3 = document.createElement("th");
    var th4 = document.createElement("th");
    var tr = document.createElement("tr");

    th1.appendChild(document.createTextNode("Item Name"));
    tr.appendChild(th1);
    th2.appendChild(document.createTextNode("Item Type"));
    tr.appendChild(th2);
    th3.appendChild(document.createTextNode("Donor"));
    tr.appendChild(th3);
    th4.appendChild(document.createTextNode("Date Donated"));
    tr.appendChild(th4);
    tableHeader.appendChild(tr);

    for (var i = 0; i < itemArray.length; i++) {
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");
        var tr2 = document.createElement("tr");

        td1.appendChild(document.createTextNode(toTitleCase(itemArray[i].itemName)));
        tr2.appendChild(td1);
        td2.appendChild(document.createTextNode(toTitleCase(itemArray[i].itemType)));
        tr2.appendChild(td2);
        td3.appendChild(document.createTextNode(toTitleCase(itemArray[i].donatorName)));
        tr2.appendChild(td3);
        td4.appendChild(document.createTextNode(itemArray[i].dateDonated));
        tr2.appendChild(td4);
        tableHeader.appendChild(tr2);
    }
}

/**
 * Adds the item in item name box to the museum database
 */
function runAddItem() {
    if (selectedId != "") {
        var itemName = itemNameBox.value.trim();
        var date = dateFormatted;
        var itemType = getRadioButtonSelection();
        adding = true;
        postItemToDatabase(itemName.toLowerCase(), loggedIn, date, itemType, adding);
        adding = "";
    }
    else {
        document.getElementById("result").appendChild(document.createTextNode("You must be logged in to do that"));
        setTimeout(function () {
            document.getElementById("result").removeChild(document.getElementById("result").firstChild);
        }, 2000);
    }
}

/**
 * Gets the item's type
 */
function getRadioButtonSelection() {
    for (var i = 0, length = itemTypeSelected.length; i < length; i++) {
        if (itemTypeSelected[i].checked) {
            return itemTypeSelected[i].value;
        }
    }
}

/**
 * Register's the user's login
 * @param {String} usernameParam is the username clicked on
 * @param {String} loggedOutParam is for if the user is logging in or out
 * @param {Date} loginTimeParam is for the date the user logged in/out
 */
function registerUserLogin(usernameParam, loggedOutParam, loginTimeParam) {
    $.ajax({
        type: 'post',
        url: 'UserLogin.php',
        data: {
            username: usernameParam,
            loggedOut: loggedOutParam,
            loginTime: loginTimeParam
        },
        success: function (data) {
            //debugger;
            if (data !== "") {
                if (data === "nick" || data === "aubryn") {
                    startupLoginCheck = data;
                } else {
                    loginStatus = data;
                }
                if (startupLoginCheck === "nick" && firstLoad) {
                    loggedIn = "nick";
                    user1Id.style.backgroundColor = "#59dc51";
                } else if (startupLoginCheck === "aubryn" && firstLoad) {
                    loggedIn = "aubryn";
                    user2Id.style.backgroundColor = "#59dc51";
                } else if (loginStatus === "loggedUserIn") {
                    stillLogged = true;
                } else if (loginStatus === "loggedUserOut") {
                    stillLogged = false;
                }
                firstLoad = false;
            } else {
                stillLogged = false;
                firstLoad = false;
            }
        }
    });
}

/**
 * Handles user logins to make sure only one person is logged in at a
 * time and handles color schemes
 */
function handleLogin() {
    var d = new Date(),
        dateFormatted = [d.getFullYear(),
        d.getMonth() + 1,
        d.getDate()].join('-');

    pageLoad();

    if (!stillLogged || loggedIn === selectedId) {
        if (selectedId === "nick") {
            if (loggedIn === "nick") {
                user1Id.style.backgroundColor = "white";
                registerUserLogin(selectedId, "1", dateFormatted);
                successfullyLoggedOut();
            } else {
                registerUserLogin(selectedId, "0", dateFormatted);
                user1Id.style.backgroundColor = "#59dc51";
                successfullyLoggedIn();
                loggedIn = "nick";
            }
        } else if (selectedId === "aubryn") {
            if (loggedIn === "aubryn") {
                user2Id.style.backgroundColor = "white";
                registerUserLogin(selectedId, "1", dateFormatted);
                successfullyLoggedOut();
            } else {
                registerUserLogin(selectedId, "0", dateFormatted);
                user2Id.style.backgroundColor = "#59dc51";
                successfullyLoggedIn();
                loggedIn = "aubryn";
            }
        }
    } else {
        document.getElementById("loginText").appendChild(document.createTextNode("Sorry, " + toTitleCase(loggedIn) + " is still logged in"));
        setTimeout(function () {
            document.getElementById("loginText").removeChild(document.getElementById("loginText").firstChild);
        }, 2000);
    }
}

/**
 * Displays text notifying the user of a successful login
 */
function successfullyLoggedIn() {
  if(displayUpload){
    displayUpload.style.visibility = "hidden";
    document.getElementById("loginText").appendChild(document.createTextNode("Successfully logged in!"));
    setTimeout(function () {
        document.getElementById("loginText").removeChild(document.getElementById("loginText").firstChild);
    }, 2000);
  }
}

/**
 * Displays text notifying the user of a successful logout
 */
function successfullyLoggedOut() {
  if(displayUpload){
    displayUpload.style.visibility = "visible";
    selectedId = "";
    loggedIn = "";
    stillLogged = false;
    document.getElementById("loginText").appendChild(document.createTextNode("Successfully logged out!"));
    setTimeout(function () {
        document.getElementById("loginText").removeChild(document.getElementById("loginText").firstChild);
    }, 2000);
  }
}

/**
 * Simply makes the first letter of every word capitalized
 * Source: https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
 * @param {String} str
 */
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

/**
 * Checks to make sure date formatting is correct
 * Source: https://stackoverflow.com/questions/35856104/convert-mm-dd-yyyy-to-yyyy-mm-dd
 * @param {String} dateString
 */
function isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    if (!d.getTime() && d.getTime() !== 0) return false; // Invalid date
    return d.toISOString().slice(0, 10) === dateString;
}