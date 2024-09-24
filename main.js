let parent = null;
let currentId = -1;

function updateButtonVisibility(isNotVisible) {
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');
    const leftButtonMain = document.getElementById('left-button-main');
    const rightButtonMain = document.getElementById('right-button-main');

    if (isNotVisible) {
        leftButton.style.display = 'block';
        rightButton.style.display = 'block';
        leftButtonMain.style.display = 'block';
        rightButtonMain.style.display = 'block';
    } else {
        leftButton.style.display = 'none';
        rightButton.style.display = 'none';
        leftButtonMain.style.display = 'none';
        rightButtonMain.style.display = 'none';
    }
}
// Вызов функции для обновления видимости кнопок
updateButtonVisibility(false);

//Добавляем прослушку
const rightButton = document.getElementById('right-button');
rightButton.addEventListener('click', goHome);

const leftButton = document.getElementById('left-button');
leftButton.addEventListener('click', ()=>{
    parent ? transformState(parent) : goHome();
});

// Функция параллельного поиска
function parallelTransition(isLeft)
{
    console.log('1');

    if (isLeft)
        add = -1;
    else
        add = 1;

    const startIndex = global.inputArray.findIndex(element => element.id === currentId);
    let currentIndex = (startIndex + add) % global.inputArray.length;

    let cicle = function()
    {
        for (let i = 1; i < global.inputArray.length; i++) 
        {
            // Вычисляем текущий индекс с учетом остатка
            currentIndex = (startIndex + i * add + global.inputArray.length) % global.inputArray.length;
            if (global.inputArray[currentIndex].parent === (parent ? parent.id : undefined))
            {
                transformState(global.inputArray[currentIndex]);
                break;
            }
        }
    }
    cicle();

}

//Добавляем прослушку
const leftButtonMain = document.getElementById('left-button-main');
leftButtonMain.addEventListener('click', ()=>{
    parallelTransition(true);
});
const rightButtonMain = document.getElementById('right-button-main');
rightButtonMain.addEventListener('click', ()=>{
    parallelTransition(false);
});

function findChilds(id)
{
    return global.inputArray.filter(person => person.parent === id);
}
function findStates()
{
    return global.inputArray.filter(state => !state.parent);
}

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
    addElementsForWhoHasChildren(0);
    let pic = document.getElementById('mainPic');
    
    //Удаляем имя снизу
    const mainText = document.getElementById('main-text');
    if (mainText)
        mainText.remove();

    //Удаляем подпись снизу
    const descriptionText = document.getElementById('description-text');
    if (descriptionText)
        descriptionText.remove();

    //Удаляем жезл снизу
    const rod = document.getElementById('rod');
    if (rod)
        rod.remove();

    pic.src = 'main/main-1024.png';
    pic.style.maxWidth = '100%';
    pic.style.borderRadius = '0%';
    pic.style.border = '';
    const div = document.getElementById('rowChilds');
    // Удаление всех элементов из div с помощью innerHTML
    div.innerHTML = "";
    const states = findStates();
    states.forEach(element => {
        addPersonCard(element, div);
    });
}

//Делаем другого персонажа основным
function transformState(obj)
{
    //Добавляем кнопки сверху по краям
    updateButtonVisibility(true);
    // Запоминаем текущий id
    currentId = obj.id;

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
    pic.style.borderRadius = '50%';
    
    pic.style.border = '2px solid transparent';
    pic.style.borderColor = '#DBAE64';

    let newSpanMain = document.getElementById('main-text');
    if (!newSpanMain)
    {
        newSpanMain = document.createElement('span');
        newSpanMain.className = 'text';
        newSpanMain.id = 'main-text';
        document.getElementById('main-card').appendChild(newSpanMain);
    }
    newSpanMain.textContent = obj.name;
    newSpanMain.style.fontSize = '61px';

    console.log(obj.post);
    let newSpanDescription = document.getElementById('description-text');
    if (!newSpanDescription)
    {
        newSpanDescription = document.createElement('span');
        newSpanDescription.className = 'text';
        newSpanDescription.id = 'description-text';
        document.getElementById('main-card').appendChild(newSpanDescription);
    }
    newSpanDescription.textContent = obj.post;
    newSpanDescription.style.fontSize = '17px';

    
     
    const divRow = document.getElementById('rowChilds');
    // Удаление всех элементов из div с помощью innerHTML
    divRow.innerHTML = "";
    const childs = findChilds(obj.id);
    addElementsForWhoHasChildren(childs.length, parent === null, divMain);
    childs.forEach(element => {
        addPersonCard(element, divRow);
    });
}

function addElementsForWhoHasChildren(countOfChildren, isState, divMain)
{
    if (!countOfChildren)
    {
        const rod = document.getElementById('rod');
        if (rod)
            rod.remove();
        const iconDiv = document.getElementById('icon');
        if (iconDiv)
            iconDiv.remove();
    }
    else
    {
        if (!document.getElementById('rod'))
        {
            // Вставляем жезл после главного окна
            const newRod = document.createElement('img');
            newRod.id = 'rod';
            newRod.src = 'main/rod-1440.png'
            // Вставка нового элемента сразу после referenceElement
            document.getElementById('forRod').insertAdjacentElement('afterend', newRod);
        }
        if (isState)
            return;
        if (!document.getElementById('icon'))
        {
            const newIconDiv = document.createElement('div');
            newIconDiv.id = 'icon';

            const newIconPic = document.createElement('img');
            newIconPic.id = 'icon-number'
            newIconPic.src = 'buttons/icon_number.png';
            newIconDiv.appendChild(newIconPic);

            const newTextIcon = document.createElement('span');
            newTextIcon.className = 'text';
            newTextIcon.id = 'text-icon-number';
            newTextIcon.textContent = countOfChildren;
            
            newIconDiv.appendChild(newTextIcon);
            document.getElementById('main-pic').appendChild(newIconDiv);
        }
        else
        {
            const countOfChildrenText = document.getElementById('text-icon-number');
            countOfChildrenText.textContent = countOfChildren;
        }

    }
}

for (let i = 1; i <= 3; i++) 
{
    const pic = document.getElementById(i);
    const obj = global.inputArray.find((element, index, array) => {
        return element.id === i;
    });
    if (obj) 
        {
        pic.addEventListener('click', () => {
            transformState(obj);
        });
    } 
    else 
        console.error(`Element with id ${i} not found in global.inputArray`);
}