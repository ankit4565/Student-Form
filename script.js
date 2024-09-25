var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stdDBName = "Std-DB";
var stdRelationName = "StdData";
var connToken = "90931996|-31949225059414522|90962584";

$(document).ready(function () {
    $("#stdrollno").focus();
});

// Helper function to enable/disable buttons
function toggleButtons(isSaving) {
    $("#save, #change").prop("disabled", isSaving);
}

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getstdrollnoAsJsonsObj() {
    var stdrollno = $("#stdrollno").val();
    return JSON.stringify({ id: stdrollno });
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#stdrollno").val(record.rollno);
    $("#stdname").val(record.name);
    $("#stdclass").val(record.class);
    $("#stddob").val(record.dob);
    $("#stdenroll").val(record.enrolldate);
    $("#stdaddress").val(record.address);
}

function resetForm() {
    $("#stdrollno, #stdname, #stdclass, #stddob, #stdenroll, #stdaddress").val("");
    $("#stdrollno").prop("disabled", false);
    $("#save, #change, #reset").prop("disabled", true);
    $("#stdrollno").focus();
}

function validateData() {
    var stdrollno = $("#stdrollno").val();
    var stdname = $("#stdname").val();
    var stdclass = $("#stdclass").val();
    var stddob = $("#stddob").val();
    var stdenroll = $("#stdenroll").val();
    var stdaddress = $("#stdaddress").val();

    if (!stdrollno) return showAlert("Student roll number is missing");
    if (!stdname) return showAlert("Student name is missing");
    if (!stdclass) return showAlert("Student class is missing");
    if (!stddob) return showAlert("Student date of birth is missing");
    if (!stdenroll) return showAlert("Student enrollment date is missing");
    if (!stdaddress) return showAlert("Student address is missing");

    return JSON.stringify({
        rollno: stdrollno,
        name: stdname,
        class: stdclass,
        dob: stddob,
        enroll: stdenroll,
        address: stdaddress
    });
}

function showAlert(message) {
    alert(message);
    return "";
}

async function getRoll() {
    var stdrollnoJsonObj = getstdrollnoAsJsonsObj();
    var getRequest = createGET_BY_KEYREQUEST(connToken, stdDBName, stdRelationName, stdrollnoJsonObj);

    try {
        let resJsonObj = await executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
        if (resJsonObj.status === 400) {
            $("#save, #reset").prop("disabled", false);
            $("#stdname").focus();
        } else if (resJsonObj.status === 200) {
            $("#stdrollno").prop("disabled", true);
            fillData(resJsonObj);
            $("#change, #reset").prop("disabled", false);
            $("#stdname").focus();
        } else {
            showAlert("Error fetching data. Please try again.");
        }
    } catch (error) {
        showAlert("Network error. Please check your connection.");
    }
}

async function saveData() {
    var jsonStrObj = validateData();
    if (!jsonStrObj) return;

    toggleButtons(true);  // Disable buttons during save
    var putRequest = createPUTRequest(connToken, jsonStrObj, stdDBName, stdRelationName);

    try {
        let resJsonObj = await executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
        if (resJsonObj.status === 200) {
            showAlert("Data saved successfully!");
        } else {
            showAlert("Error saving data. Please try again.");
        }
    } catch (error) {
        showAlert("Network error. Please check your connection.");
    }

    resetForm();
    toggleButtons(false);  // Re-enable buttons after save
}

async function changeData() {
    var jsonChg = validateData();
    if (!jsonChg) return;

    toggleButtons(true);  // Disable buttons during update
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stdDBName, stdRelationName, localStorage.getItem("recno"));

    try {
        let resJsonObj = await executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
        if (resJsonObj.status === 200) {
            showAlert("Data updated successfully!");
        } else {
            showAlert("Error updating data. Please try again.");
        }
    } catch (error) {
        showAlert("Network error. Please check your connection.");
    }

    resetForm();
    toggleButtons(false);  // Re-enable buttons after update
}
