var cl = console.log;


studentsArr = [];

const BASE_URL = `https://gaurav2-1b96d-default-rtdb.firebaseio.com/`
const STUDENT_URL = `${BASE_URL}/Student2fetch.json`

const form = document.getElementById("form");
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const contactNumber = document.getElementById("contactNumber");
const course = document.getElementById("course");
const fees = document.getElementById("fees");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const cancelBtn = document.getElementById("cancelBtn");
const tbody = document.getElementById("tbody");
const spinner = document.getElementById("spinner");

//============================== Create =========================================
function createNewStudent(eve) {
    eve.preventDefault()

    let newStudent = {
        fname: fname.value,
        lname: lname.value,
        contactNumber: contactNumber.value,
        course: course.value,
        fees: fees.value,
    }
    showSpinner("text-success")
    fetch(STUDENT_URL, {
        method: "POST",
        body: JSON.stringify(newStudent),
        headers: {
            "Content-type": "appliction/json",
            "Autherization": "TOKEN JWT FROM LS"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }

            return res.json()
        })
        .then(data => {

            let tr = document.createElement("tr")
            tr.id = data.name
            tr.innerHTML = `
                            <td>1</td>
                            <td>${newStudent.fname} ${newStudent.lname}</td>
                            <td>${newStudent.contactNumber}</td>
                            <td>${newStudent.course}</td>
                            <td>${newStudent.fees}</td>
                            <td><button onClick="editStudent(this)" class="btn btn-warning shadow">Edit</button></td>
                            <td><button onClick="deleteStudent(this)" class="btn btn-danger shadow">Delete</button></td>`

            tbody.prepend(tr)
            let td = document.querySelectorAll("#tbody tr")
            td.forEach((ele, i) => ele.querySelector("td").innerText = i + 1)

            form.reset()
            hideSpinner("text-success")
             snackBar("Added!", "Student Data Added Successfully!!!")
        })
        .catch(err => {
            hideSpinner("text-success")
            cl("Something went wrong")
        })
}
//============================== Read =========================================
function fetchStudents(arr) {
    showSpinner("text-primary")
    fetch(STUDENT_URL, {
        method: "GET",
        body: null,
    }).then(res => {
        if (!res.ok) {
            throw new Error(`HTTP Error : ${res.status} `)
        }
        return res.json()
    }).then(data => {

        for (const key in data) {
            data[key].id = key;
            studentsArr.unshift(data[key])
        }
        let result = "";
        arr.forEach((ele, i) => {
            result += `<tr id=${ele.id}>
                            <td>${i + 1}</td>
                            <td>${ele.fname} ${ele.lname}</td>
                            <td>${ele.contactNumber}</td>
                            <td>${ele.course}</td>
                            <td>${ele.fees}</td>
                            <td><button onClick="editStudent(this)" class="btn btn-warning shadow">Edit</button></td>
                            <td><button onClick="deleteStudent(this)" class="btn btn-danger shadow">Delete</button></td>
                        </tr>`

            tbody.innerHTML = result
            let td = document.querySelectorAll("#tbody tr")
            td.forEach((ele, i) => ele.querySelector("td").innerText = i + 1)

            hideSpinner("text-primary")
        });
    }).catch(err => {
        hideSpinner("text-primary")
        cl("Something went wrong")
    })
}
fetchStudents(studentsArr)
//============================== Edit =========================================
function editStudent(ele) {
    let EDIT_ID = ele.closest("tr").id

    let EDIT_URL = `${BASE_URL}/fetchStudents/${EDIT_ID}.json`
    showSpinner("text-success")
    fetch(EDIT_URL, {
        method: "GET",
        body: null,
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {

            localStorage.setItem("EDIT_ID", EDIT_ID)
            fname.value = data.fname
            lname.value = data.lname
            course.value = data.course
            contactNumber.value = data.contactNumber
            fees.value = data.fees

            addBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
            hideSpinner("text-success")
        })
        .catch(err => {
            hideSpinner("text-success")
            cl("Something went Wrong")
        })
}
//============================== Update =========================================
function updateStudent(ele) {
    let UPDATE_ID = localStorage.getItem("EDIT_ID")
    localStorage.removeItem("EDIT_ID")
    let UPDATE_URL = `${BASE_URL}/fetchStudents/${UPDATE_ID}.json`
    let updatedStudent = {
        fname: fname.value,
        lname: lname.value,
        contactNumber: contactNumber.value,
        course: course.value,
        fees: fees.value,
        id: UPDATE_ID
    }
    showSpinner("text-success")
    fetch(UPDATE_URL, {
        method: "PATCH",
        body: JSON.stringify(updatedStudent)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            let getIndex = studentsArr.findIndex(ele => ele.id === UPDATE_ID)
            studentsArr[getIndex] = updatedStudent
            document.getElementById(UPDATE_ID).innerHTML = `
                            <td>${getIndex + 1}</td>
                            <td>${data.fname} ${data.lname}</td>
                            <td>${data.contactNumber}</td>
                            <td>${data.course}</td>
                            <td>${data.fees}</td>
                            <td><button onClick="editStudent(this)" class="btn btn-warning shadow">Edit</button></td>
                            <td><button onClick="deleteStudent(this)" class="btn btn-danger shadow">Delete</button></td>
                       `
            let td = document.querySelectorAll("#tbody tr")
            td.forEach((ele, i) => ele.querySelector("td").innerText = i + 1)

            addBtn.classList.remove("d-none")
            updateBtn.classList.add("d-none")

            form.reset()
            hideSpinner("text-success")
             snackBar("Updated!", "Student Data Deleted Successfully!!!")
        })
        .catch(err => {
            cl("Something went wrong")
        })
}
//============================== Delete =========================================
function deleteStudent(ele) {
    let DELETE_ID = ele.closest("tr").id
    let DELETE_URL = `${BASE_URL}/fetchStudents/${DELETE_ID}.json`

    Swal.fire({
        title: "Are you sure?",
        text: "It delete permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            showSpinner("text-danger")

            fetch(DELETE_URL, {
                method: "DELETE",
                body: null
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP Error : ${res.status}`)
                    }

                    res.json()
                })
                .then(data => {
                    ele.closest("tr").remove()
                    let td = document.querySelectorAll("#tbody tr")
                    td.forEach((ele, i) => ele.querySelector("td").innerText = i + 1)

                    let getIndex = studentsArr.findIndex(ele => ele.id === DELETE_ID)
                    studentsArr.splice(getIndex, 1)
                    hideSpinner("text-danger")
                    snackBar("Deleted!", "Student Data Deleted Successfully!!!")
                })
                .catch(err => {
                    hideSpinner("text-danger")
                    cl("Something went wrong")
                })
        }
    });

}
function showSpinner(color) {
    spinner.classList.remove("d-none")
    spinner.classList.add(color)
}
function hideSpinner(color) {
    spinner.classList.add("d-none")
    spinner.classList.remove(color)
}
function snackBar(title, msg) {
    Swal.fire({
        title: title,
        text: msg,
        icon: "success"
    });
}
function clearForm(ele){
    form.reset()
}

form.addEventListener("submit", createNewStudent)
updateBtn.addEventListener("click", updateStudent)
cancelBtn.addEventListener("click", clearForm)










