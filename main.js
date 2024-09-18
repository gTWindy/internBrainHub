let parent = null;

function updateButtonVisibility(isNotVisible) {
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');

    if (isNotVisible) {
        leftButton.style.display = 'inline-block';
        rightButton.style.display = 'inline-block';
    } else {
        leftButton.style.display = 'none';
        rightButton.style.display = 'none';
    }
}
// Вызов функции для обновления видимости кнопок
updateButtonVisibility(false);

function findChilds(id)
{
    return global.inputArray.filter(person => person.parent === id);
}
function findStates()
{
    return global.inputArray.filter(state => !state.parent);
}

const rightButton = document.getElementById('right-button');
rightButton.addEventListener('click', goHome);

const leftButton = document.getElementById('left-button');
leftButton.addEventListener('click', ()=>{
    if (parent)
        transformState(parent);
    else
        goHome();
});


function addPersonCard(element, div)
{
    const newDiv = document.createElement('div');
    newDiv.className = 'block';
    
    const newImg = document.createElement('img');
    newImg.src = 'images/' + element.image;
    newImg.style.borderRadius = '50%'; /* Для округления картинки */
    newImg.className = "state-image";
    newImg.addEventListener('click', () => {
        transformState(element);
    });
    newDiv.appendChild(newImg);
    const newSpan = document.createElement('span');
    newSpan.className = 'text';
    newSpan.textContent = element.name;
    newDiv.appendChild(newSpan);

    div.appendChild(newDiv);
}

function goHome()
{
    updateButtonVisibility(false);
    let pic = document.getElementById('mainPic');
    if (pic) {
        console.log(pic.src); // Выведет URL первой найденной картинки
    }

    //Удаляем подпись снизу
    const mainText = document.getElementById('main-text');
    if (mainText)
        mainText.remove();

    //Удаляем жезл снизу
    const rod = document.getElementById('rod');
    if (rod)
        rod.remove();

    pic.src = 'main/main-1024.png';
    pic.style.maxWidth = '100%';
    pic.style.borderRadius = '0%';
    pic.style.border = '';
    const div = document.getElementById('row');
    // Удаление всех элементов из div с помощью innerHTML
    div.innerHTML = "";
    const states = findStates();
    states.forEach(element => {
        addPersonCard(element, div);
    });
}

function transformState(obj)
{
    updateButtonVisibility(true) //Добавляем кнопки сверху по краям
    
    if (!obj)
    {
        console.log('Не найден')
        return;
    }
    // Запоминаем родителя
    parent = obj.parent ? global.inputArray.find((element, index, array) => {
        return element.id === obj.parent;
    }) : null;

    let divMain = document.getElementById('main');
    const pic = document.getElementById('mainPic');
    console.log(pic);
    pic.src = 'images/' + obj.image;
    pic.style.borderRadius = '50%'; /* Для округления картинки */
    pic.style.maxWidth = '359px';
    pic.style.border = '2px solid transparent';
    pic.style.borderColor = '#DBAE64';

    let newSpan = document.getElementById('main-text');
    if (!newSpan)
    {
        newSpan = document.createElement('span');
        newSpan.className = 'text';
        newSpan.id = 'main-text';
        divMain.appendChild(newSpan);
    }
    newSpan.textContent = obj.name;
    
    if (!document.getElementById('rod'))
    {
        // Вставляем жезл после глоавного окна
        const newRod = document.createElement('img');
        newRod.id = 'rod';
        newRod.src = 'main/rod-1440.png'
        // Вставка нового элемента сразу после referenceElement
        divMain.insertAdjacentElement('afterend', newRod);
    }
     
    const divRow = document.getElementById('row');
    // Удаление всех элементов из div с помощью innerHTML
    divRow.innerHTML = "";
    const childs = findChilds(obj.id);
    childs.forEach(element => {
        addPersonCard(element, divRow);
    });
}

for (let i = 1; i <= 3; i++) {
    const pic = document.getElementById(i);
    const obj = global.inputArray.find((element, index, array) => {
        return element.id === i;
    });
    if (obj) {
        pic.addEventListener('click', () => {
            transformState(obj);
        });
    } else {
        console.error(`Element with id ${i} not found in global.inputArray`);
    }
}