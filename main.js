let parent = null;
let currentId = -1;

function updateArrowVisibility(isNotVisible) {
    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');

    if (isNotVisible) {
        leftArrow.style.display = 'block';
        rightArrow.style.display = 'block';
    } else {
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
    }
}

function updateButtonVisibility(isNotVisible) {
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');

    if (isNotVisible) {
        leftButton.style.display = 'block';
        rightButton.style.display = 'block';
    } else {
        leftButton.style.display = 'none';
        rightButton.style.display = 'none';
    }

    updateArrowVisibility(isNotVisible);
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
const leftButtonMain = document.getElementById('left-arrow');
leftButtonMain.addEventListener('click', ()=>{
    parallelTransition(true);
});
const rightButtonMain = document.getElementById('right-arrow');
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

// Переходим на начальную страницу
function goHome()
{
    updateButtonVisibility(false);
    addElementsForWhoHasChildren(0);
    let pic = document.getElementById('main-pic');
    
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

    pic.src = 'main/main-1024.svg';
    pic.className = 'startMainPicture';
    const div = document.getElementById('row-childs');
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

    hideArrows();

    let divMain = document.getElementById('main');
    const pic = document.getElementById('main-pic');
    console.log(pic);
    pic.src = 'images/' + obj.image;
    pic.className = 'notStartMainPicture';

    //Имя карточки
    let newSpanMain = document.getElementById('main-text');
    if (!newSpanMain)
    {
        newSpanMain = document.createElement('span');
        newSpanMain.className = 'text';
        newSpanMain.id = 'main-text';
        document.getElementById('main-card').appendChild(newSpanMain);
    }
    newSpanMain.textContent = obj.name;

    //Описание карточки
    let newSpanDescription = document.getElementById('description-text');
    if (!newSpanDescription)
    {
        newSpanDescription = document.createElement('span');
        newSpanDescription.className = 'text';
        newSpanDescription.id = 'description-text';
        document.getElementById('main-card').appendChild(newSpanDescription);
    }
    newSpanDescription.textContent = obj.post;
     
    const divRow = document.getElementById('row-childs');
    // Удаление всех элементов из div с помощью innerHTML
    divRow.innerHTML = "";
    const childs = findChilds(obj.id);
    addElementsForWhoHasChildren(childs.length, parent === null, divMain);
    childs.forEach(element => {
        addPersonCard(element, divRow);
    });
}

//Добавляем или удаляем элементы в зависимости от кол-ва детей
function addElementsForWhoHasChildren(countOfChildren, isState, divMain)
{
    let removeIcon = ()=>
    {
        const iconDiv = document.getElementById('icon');
        if (iconDiv)
            iconDiv.remove();
    }
    //Если это государство, то удаляем иконку
    if (isState)
        removeIcon();
    if (!countOfChildren)
    {
        const rod = document.getElementById('rod');
        if (rod)
            rod.remove();
        removeIcon();
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

//Прячем стрелочки, если у карточки не братьев
function hideArrows()
{
    if (!parent)
        return updateArrowVisibility(false);

    const condition = (element) => element.parent === parent.id;
    const count = global.inputArray.reduce((acc, element) => {
        return condition(element) ? acc + 1 : acc;
    }, 0);

    if (count > 1)
        updateArrowVisibility(true);
    else
        updateArrowVisibility(false);

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