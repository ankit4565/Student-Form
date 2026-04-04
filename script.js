// API Configuration
const API_BASE_URL = "http://localhost:3100/api";

$(document).ready(function () {
    // Check if API is accessible
    checkAPIHealth();
    $("#stdrollno").focus();
});

// Check API health
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (!response.ok) {
            console.warn("API server not running. Start backend with: npm run dev");
        }
    } catch (error) {
        console.warn("Backend API not accessible. Make sure Node server is running on port 3100");
    }
}

// Helper function to enable/disable buttons
function toggleButtons(isSaving) {
    $("#save, #change").prop("disabled", isSaving);
}

function saveRecNo2LS(recno) {
    localStorage.setItem("recno", recno);
}

function getRecNoFromLS() {
    return localStorage.getItem("recno");
}

function fillData(studentData) {
    // Store MongoDB document ID for updates
    if (studentData._id || studentData.rec_no) {
        saveRecNo2LS(studentData._id || studentData.rec_no);
    }
    
    // Fill form with student data
    $("#stdrollno").val(studentData.rollno || "");
    $("#stdname").val(studentData.name || "");
    $("#stdclass").val(studentData.class || "");
    
    // Handle date formatting
    if (studentData.dob) {
        const dobDate = new Date(studentData.dob);
        $("#stddob").val(dobDate.toISOString().split('T')[0]);
    }
    
    if (studentData.enrolldate) {
        const enrollDate = new Date(studentData.enrolldate);
        $("#stdenroll").val(enrollDate.toISOString().split('T')[0]);
    }
    
    $("#stdaddress").val(studentData.address || "");
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

    return {
        rollno: stdrollno,
        name: stdname,
        class: stdclass,
        dob: stddob,
        enrolldate: stdenroll,
        address: stdaddress
    };
}

function showAlert(message) {
    alert(message);
    return "";
}

async function getRoll() {
    var stdrollno = $("#stdrollno").val();
    
    if (!stdrollno) {
        showAlert("Please enter a roll number");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/student/${stdrollno}`);
        const resJsonObj = await response.json();

        if (response.status === 404 || resJsonObj.status === 404) {
            // Student not found, allow new entry
            $("#save, #reset").prop("disabled", false);
            $("#stdname").focus();
        } else if (response.ok && resJsonObj.status === 200) {
            // Student found, load data
            $("#stdrollno").prop("disabled", true);
            fillData(resJsonObj.data);
            $("#change, #reset").prop("disabled", false);
            $("#stdname").focus();
        } else {
            showAlert("Error fetching data. Please try again.");
        }
    } catch (error) {
        showAlert("Network error. Make sure MongoDB backend is running on port 3100");
        console.error("Error:", error);
    }
}

async function saveData() {
    var jsonStrObj = validateData();
    if (!jsonStrObj) return;

    toggleButtons(true);

    try {
        const response = await fetch(`${API_BASE_URL}/student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonStrObj)
        });

        const resJsonObj = await response.json();

        if (response.ok && resJsonObj.status === 200) {
            showAlert("Data saved successfully!");
            saveRecNo2LS(resJsonObj.rec_no);
        } else {
            showAlert(resJsonObj.message || "Error saving data. Please try again.");
        }
    } catch (error) {
        showAlert("Network error. Please check your connection.");
        console.error("Error:", error);
    }

    resetForm();
    toggleButtons(false);
}

async function changeData() {
    var jsonChg = validateData();
    if (!jsonChg) return;

    var recno = getRecNoFromLS();
    if (!recno) {
        showAlert("No record to update. Please search for a student first.");
        return;
    }

    toggleButtons(true);

    try {
        const response = await fetch(`${API_BASE_URL}/student/${recno}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonChg)
        });

        const resJsonObj = await response.json();

        if (response.ok && resJsonObj.status === 200) {
            showAlert("Data updated successfully!");
        } else {
            showAlert(resJsonObj.message || "Error updating data. Please try again.");
        }
    } catch (error) {
        showAlert("Network error. Please check your connection.");
        console.error("Error:", error);
    }

    resetForm();
    toggleButtons(false);
}
