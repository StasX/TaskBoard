(function () {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function validateNote(text) {
        return text.length > 0 && text.length <= 300;
    }

    function validateDateTime(date, time) {
        if (!((/^\d{4}-\d{2}-\d{2}$/.test(date) || /^\d{2}\/\d{2}\/\d{4}$/.test(date)) && /^\d{2}:\d{2}$/.test(time))) {
            return false;
        }
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
            date = date.split("/").reverse().join("-");
        }
        var splitedDate = date.split("-");
        var splitedTime = time.split(":");
        var passedDate = new Date(date);
        passedDate.setHours(splitedTime[0]);
        passedDate.setMinutes(splitedTime[1]);
        return passedDate > (new Date());
    }

    function prependTask(note, date, time) {
        var noteElement = document.createElement("DIV");
        ["col-lg-3", "col-md-6", "fade-in"].forEach(function (cls) {
            noteElement.classList.add(cls)
        });
        noteElement.innerHTML = '<div class="note"><div class="note-content"><div class="text">' + note +
            '</div><div class="col-9"><div class="row"><b>Date: </b>' + date +
            '</div><div class="row"><b>Time: </b>' + time +
            '</div></div><div class="col-3"><i class="bi bi-trash-fill trash"></i></div></div></div>';
        document.querySelector("#notes-container").prepend(noteElement);
        document.querySelector(".note:first-child .trash").addEventListener("click", removeTask);
    }

    function getParent(el) {
        return el.parentElement;
    }

    function removeTask() {
        var noteContainer = document.querySelector("#notes-container");
        var childNodes = Array.prototype.slice.call(noteContainer.children);
        var index = childNodes.indexOf(getParent(getParent(getParent(getParent(this)))));
        if (index > -1) {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            document.querySelectorAll("#notes-container>div")[index].remove();
        }
    }

    function clear() {
        document.getElementById('note').value = "";
        document.getElementById('date').value = "";
        document.getElementById('time').value = "";
    }

    function showError(msg) {
        document.querySelector("#error").style.display = "block";
        document.querySelector("#error-msg").innerText = msg;
    }

    function hideError() {
        document.querySelector("#error").style.display = "none";
        document.querySelector("#error-msg").innerText = "";
    }

    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        var note = document.querySelector("#note").value;
        var date = document.querySelector("#date").value;
        var time = document.querySelector("#time").value;
        if (validateNote(note) && validateDateTime(date, time)) {
            date = date.split("-").reverse().join("/");
            prependTask(note, date, time);
            tasks.push({
                note: note,
                date: date,
                time: time
            });
            localStorage.setItem("tasks", JSON.stringify(tasks));
            hideError();
            clear();
        } else {
            showError("One or more fields are filed incorectly<br/>Please try again.");
        }
    });

    tasks.forEach(function (task) {
        prependTask(task.note, task.date, task.time);
    });
})();