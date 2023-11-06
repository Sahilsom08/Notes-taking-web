const addBox = document.querySelector('.add-box'),
    popupbox = document.querySelector('.popup-box'),
    popupTitle = popupbox.querySelector('header p'),
    closeIcon = popupbox.querySelector('header i'),
    titleTag = popupbox.querySelector('input'),
    descTag = popupbox.querySelector('textArea'),
    addBtn = popupbox.querySelector('button');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

// descTag.addEventListener("keypress", function(event) {
//     if (event.key == "Enter") {
//       event.preventDefault();
//     }
//   });
  
//fix:- second data overrind the first one.
// getting localstorage notes if exits and parsing them to js
// object else passing an empty array to notes
const notes = JSON.parse(localStorage.getItem('notes') || '[]');
console.log(notes);
let isUpdate = false, updated;

addBox.addEventListener('click', () => {
    titleTag.focus();
    popupbox.classList.add('show');
});

closeIcon.addEventListener('click', () => {
    isUpdate = false;
    titleTag.value = '';
    descTag.value = '';
    popupTitle.innerHTML = 'Add a new Note';
    addBtn.innerHTML = 'Add Note';
    popupbox.classList.remove('show');
});

function showNotes() {
    document.querySelectorAll('.note').forEach(note=> note.remove() );

    notes.forEach((note,index) => {
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${note.description}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <span>${note.hour}:${note.minute} ${note.ampm}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="fa fa-ellipsis"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${index}, '${note.title}', '${note.description}' )"><i class="fa-solid fa-pen"></i>Edit</li>
                                    <li onclick="deletNode(${index})"><i class="fa-solid fa-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();

function showMenu(elem){
    elem.parentElement.classList.add('show');
    document.addEventListener('click', e=>{
        
        if(e.target.tagName != 'I' || e.target != elem){
            elem.parentElement.classList.remove('show');
        }
    });
}

function deletNode(noteId){
    notes.splice(noteId,1); //removing selected note from notes
    // (1st:index of note, 2nd: how many to be deleted)

    // saving the updated notes to localstorage
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId,title,desc){
    isUpdate = true;
    updated = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    popupTitle.innerHTML = 'Update a Note';
    addBtn.innerHTML = 'Update Note';
}

addBtn.addEventListener('click', e => {
    e.preventDefault();

    
    let noteTitle = titleTag.value,
        noteDesc = descTag.value;

    if (noteTitle || noteDesc) {
        let dateObj = new Date(),
            month = months[dateObj.getMonth()],
            day = dateObj.getDate(),
            year = dateObj.getFullYear(),
            hr = dateObj.getHours(),
            min = dateObj.getMinutes(),
            ampm = 'AM';

            if (hr >= 12) {
                hr = hr - 12;
                ampm = 'PM';
            }
            hr = hr == 0 ? hr = 12 : hr;
            hr = hr < 10 ? '0' + hr : hr;
            min = min < 10 ? '0' + min : min;

        let noteInfo = {
            title: noteTitle,
            description: noteDesc,
            date: `${month} ${day} ${year}`,
            hour:hr,
            minute: min,
            ampm: ampm,
        }

        if(!isUpdate){
            notes.push(noteInfo); // adding new note to notes
        }
        else{
            isUpdate = false;
            notes[updated] = noteInfo // updating the specific note
        }
        // store the object in local storage in string format
        localStorage.setItem("notes", JSON.stringify(notes));
        closeIcon.click();
        showNotes();
    }
});