var text = "RYR41BB:211575:211575:PILOT::51.4194:14.2231:38238:433:1/B738/M-SDE1FGHIJ1RWXYZ/LB1:N0452:LHBP:F380:EKCH:EU4:B:6:2000:0:50:0:I:1320:1320:1:34:3:44:EKBI:PBN/A1B1C1D1L1O1S1 NAV/RNVD1E2A1 DOF/181213 REG/EIDWE EET/LZBB0009 LKAA0020 EDUU0045 EDWW0115 EKDK0119 RVR/200 OPR/RYANAIR VIRTUAL AIRLINES PER/C:N0452F380 BADOV P41 MAVOR P41 BULEK L624 HDO DCT GEVNI T239 PEROM T298 MONAK:::::::20181213125500:IvAp:2.0.2:2:6::S:144:351:0:30:"
var xofCount = 1
var tagArray = text.split(":");
var airport = "EKCH"
var getData = "https://api.ivao.aero/getdata/whazzup/"
var tagID = '<div id="tag1"'

//The base html for a tag
var cleanTag = ' class="tag" draggable="true" ondragstart="drag(event)"><div class="leftCol b"><div id="cof1" onfocus="removeOnFocus(this.id)" onblur="placeholderOnBlur(this.id)" class="callsign topCol b" contenteditable="true">CS</div><div id="sof1" onfocus="removeOnFocus(this.id)" onblur="placeholderOnBlur(this.id)" class="sid topCol b"contenteditable="true">SID</div><div id="tof1" onfocus="removeOnFocus(this.id)"onblur="placeholderOnBlur(this.id)" class="type topCol b"contenteditable="true">TYPE</div><div id="rof1" onfocus="removeOnFocus(this.id)" onblur="placeholderOnBlur(this.id)" class="rule topCol b"contenteditable="true">RULE</div></div><select onchange="rwy()" class="rwy rightCol b"><option value="rwy">RWY</option><option value="04r">04R</option><option value="04l">04L</option><option value="22r">22R</option><option value="22l">22L</option><option value="12">12</option><option value="30">30</option></select><select onchange="stat(value)" class="ins rightCol b"><option value="stby">STBY</option><option value="clrd">CLRD</option><option value="deice">DE-ICE</option><option value="lu">L/U</option><option value="to">T/O</option><option value="lnd">LND</option></select></div>'
var id = "";
if (tagArray[13] || tagArray[11] == airport) {

}
//Generate New tag and add eventlister for context menu
function newTag() {
  var tagNumberString = tagID[(tagID.length) - 2]
  var pt1 = (tagID.split(tagNumberString)[0])
  var ntagID = ((pt1.concat(Number(tagID[(tagID.length) - 2]) + 1)).concat('"'))
  tagID = ntagID
  xofCount++
  var currentCof = "cof".concat(String(xofCount))
  var currentSof = "sof".concat(String(xofCount))
  var currentTof = "tof".concat(String(xofCount))
  var currentRof = "rof".concat(String(xofCount))
  tag = cleanTag.replace("cof1", currentCof).replace("sof1", currentSof).replace("tof1", currentTof).replace("rof1", currentRof)
  var nTag = ntagID.concat(tag);
  var div = document.getElementById("dep");
  div.insertAdjacentHTML("afterbegin", nTag);

  var tagN = ((("tag").concat(Number(tagID[(tagID.length) - 2]))))
  var tag = document.getElementById(tagN);
  var body = document.getElementsByTagName("BODY")[0];
  //add eventlister for context menu on every new generated tag
  tag.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    //get id from event target
    var target = event.target || event.srcElement;
    id = ("tag").concat((target.id).slice(3, 4));
    //run context menu
    var ctxMenu = document.getElementById("ctxMenu");
    ctxMenu.style.display = "block";
    ctxMenu.style.left = (event.pageX - 10) + "px";
    ctxMenu.style.top = (event.pageY - 10) + "px";
  }, false);
  body.addEventListener("click", function(event) {
    var ctxMenu = document.getElementById("ctxMenu");
    ctxMenu.style.display = "";
    ctxMenu.style.left = "";
    ctxMenu.style.top = "";
  }, false);

}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, el) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  el.appendChild(document.getElementById(data));
}

function dropped(ev, id) {
  var id = ev.dataTransfer.getData("text");
  var elem = document.getElementById(id);
  elem.parentElement.removeChild(elem);
}
//globar var for the field input
var input = ""
//Removes text when pressing on field
function removeOnFocus(id) {
  input = document.getElementById(id).innerHTML
  document.getElementById(id).innerHTML = ""
}
//If nothing in field return the old value
function placeholderOnBlur(id) {
  var x = document.getElementById(id).innerHTML;
  if (x == "") {
    document.getElementById(id).innerHTML = input
  }
}
//touch support move function
function move(destination) {
  var tag = document.getElementById(id)
  document.getElementById(destination).appendChild(tag);
}

//Modal popup window from w3
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

function loadModal() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
//Change airport
var runways = []
var runwayHTML = '<div class="hl" ondrop="dropped(event, this.id)" ondragover="allowDrop(event)"> LOADING </div> <div id="rwy" class="dz" ondrop="drop(event, this)" ondragover="allowDrop(event)"></div>'
var menuItem = '<menu onclick=\"move(\'rwy\')\" title="RUNWAY"></menu>'
var submit = document.getElementById("field");
submit.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    validate(e);
  }
})

//Close Modal and Validate airport input
function validate(e) {
  var airport = document.getElementById("field").value;
  var modal = document.getElementById("myModal")
  modal.style.display = "none";
  console.log(airport)
  getRunways(airport)

}

//Get airport data & add runways
var done = false
function getRunways(inputAirport) {
  var found = false
  var airport = inputAirport.toUpperCase()
  for (i = 0; i < data.length || done == false; i++) {
    if (airport == data[i][0]) {
      var found = true
      done = true
      var targetDiv = document.getElementById("runway");
      var targetDiv2 = document.getElementById("ctxMenu");
      runways = data[i][1]
      var runwayCount = 1
      targetDiv.innerHTML = ""
      for (z = 0; z < runways.length; z++) {
          var n = runwayHTML.search("rwy")
          var withID = spliceSlice(runwayHTML, (n + 3), 0, runwayCount)
          var nn = withID.search("LOADING")
          var rwyHTML = spliceSlice(withID, nn, 7, "RUNWAY " + runways[z])
          targetDiv.insertAdjacentHTML("afterbegin", rwyHTML);
          debugger
          var nnn = menuItem.search("rwy")
          var withID2 = spliceSlice(menuItem, (nnn + 3), 0, runwayCount)
          var nnnn = withID2.search("RUNWAY")
          var menuItemHTML = spliceSlice(withID2, nnnn, 6, runways[z])
          targetDiv2.insertAdjacentHTML("beforeend", menuItemHTML);
          runwayCount ++
      }
    }
    }
    //Reload page if the airport is not in database
    if (found == false) {
      location.reload();
  }
}

//Splice string function

function spliceSlice(str, index, count, add) {
  // We cannot pass negative indexes directly to the 2nd slicing operation.
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }
  return str.slice(0, index) + (add || "") + str.slice(index + count);
}
