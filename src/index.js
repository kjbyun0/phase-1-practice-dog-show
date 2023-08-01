
// -1 indicates there is no dog info need to be edited.
let editDogId = -1;

document.addEventListener('DOMContentLoaded', () => {
    // adding a hidden table column for id
    const thead = document.getElementsByClassName('blue');
    const tdHidden = document.createElement('td');
    tdHidden.textContent = 'id';
    tdHidden.hidden = true;
    thead[0].children[0].appendChild(tdHidden);

    renderDogTable();

    // adding a submit event listener to dog-form
    const frmDog = document.getElementById('dog-form');
    frmDog.addEventListener('submit', e => {
        e.preventDefault();

        //console.log(e);
        const dogName = e.target.children[0].value;
        const dogBreed = e.target.children[1].value;
        const dogSex = e.target.children[2].value;
        updateDogInfo(dogName, dogBreed, dogSex);

        e.target.reset();

    });
});

function renderDogTable() {
    const tblBody = document.getElementById('table-body');
    tblBody.innerHTML = '';

    fetch('http://localhost:3000/dogs')
    .then(resp => resp.json())
    .then(dogList => {
        //console.log(dogList);
        dogList.forEach(dog => {
            const tr = document.createElement('tr');
            tr.className = 'padding'
            const tdName = document.createElement('td');
            tdName.textContent = dog.name;
            tdName.className = 'padding center';
            const tdBreed = document.createElement('td');
            tdBreed.textContent = dog.breed;
            tdBreed.className = 'padding center';
            const tdSex = document.createElement('td');
            tdSex.textContent = dog.sex;
            tdSex.className = 'padding center';
            const tdBtn = document.createElement('td');
            const btnEdit = document.createElement('button');
            btnEdit.textContent = 'Edit';
            tdBtn.appendChild(btnEdit);
            tdBtn.className = 'padding center';
            const tdId = document.createElement('td');
            tdId.textContent = dog.id.toString();
            tdId.hidden = true;
            tr.append(tdName, tdBreed, tdSex, tdBtn, tdId);
            tblBody.appendChild(tr);

            btnEdit.addEventListener('click', e => {
                console.log(e);
                const frmDog = document.getElementById('dog-form');
                const tr = e.target.parentNode.parentNode;
                editDogId = tr.children[tr.children.length-1].textContent;
                for (let i = 0; i <= 2; i++) {
                    frmDog.children[i].value = tr.children[i].textContent;
                }
            });
        });
    })
    .catch(error => console.log(error));
}

function updateDogInfo(dogName, dogBreed, dogSex) {
    if (editDogId === -1) return;

    fetch(`http://localhost:3000/dogs/${editDogId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            'name': dogName,
            'breed': dogBreed,
            'sex': dogSex,
        }),
    })
    .then(resp => {
        //console.log(resp);
        editDogId = -1;
        renderDogTable();
    })
    .catch(error => console.log(error));
}