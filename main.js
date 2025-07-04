let parent = null;
let currentId = -1;
const divRowStart = document.getElementsByClassName('childs-row--start')[0];
const divRowNotStart = document.createElement('div');
divRowNotStart.className = 'row childs-row childs-row--not-start';
const mainCardPic = document.getElementsByClassName('main-card__pic')[0];
const mainRow = document.getElementsByClassName('main-row')[0];

function updateArrowVisibility(isNotVisible) {
    const leftArrow = document.getElementsByClassName('image-button_left-arrow')[0];
    const rightArrow = document.getElementsByClassName('image-button_right-arrow')[0];

    if (isNotVisible) {
        leftArrow.style.display = 'block';
        rightArrow.style.display = 'block';
        mainRow.style.justifyContent = 'space-between';
    } else {
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
        mainRow.style.justifyContent = 'center'
    }
}

function updateButtonVisibility(isNotVisible) {
    const leftButton = document.getElementsByClassName('back-button__left-button')[0];
    const rightButton = document.getElementsByClassName('image-button__right-button')[0];

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

// Добавляем прослушку
const rightButton = document.getElementsByClassName('image-button__right-button')[0];
rightButton.addEventListener('click', goHome);

const leftButton = document.getElementsByClassName('back-button__left-button')[0];
leftButton.addEventListener('click', () => {
    parent ? transformState(parent) : goHome();
});

// Функция параллельного поиска
function parallelTransition(isLeft) {
    const add = isLeft ? - 1 : 1;

    const startIndex = global.inputArray.findIndex(element => element.id === currentId);
    let currentIndex = (startIndex + add) % global.inputArray.length;

    for (let i = 1; i < global.inputArray.length; i++) {
        // Вычисляем текущий индекс с учетом остатка
        currentIndex = (startIndex + i * add + global.inputArray.length) % global.inputArray.length;
        if (global.inputArray[currentIndex].parent === (parent ? parent.id : undefined)) {
            transformState(global.inputArray[currentIndex]);
            break;
        }
    }
}

// Добавляем прослушку
const leftButtonMain = document.getElementsByClassName('image-button_left-arrow')[0];
leftButtonMain.addEventListener('click', () => {
    parallelTransition(true);
});
const rightButtonMain = document.getElementsByClassName('image-button_right-arrow')[0];
rightButtonMain.addEventListener('click', () => {
    parallelTransition(false);
});

function findChilds(id) {
    return global.inputArray.filter(person => person.parent === id);
}

// Возвращаем массив государств
function findStates() {
    return global.inputArray.filter(state => !state.parent);
}

function addPersonCard(element, div, isState) {
    const newDivCard = document.createElement('div');
    newDivCard.className = 'mini-card mini-card--not-start';

    const newDivPic = document.createElement('div');
    newDivPic.className = 'pic-div';

    const newImg = document.createElement('img');
    newImg.src = 'images/' + element.image;
    newImg.className = "mini-card-image";
    if (isState)
        newImg.classList.add("mini-card-image--state");

    newImg.addEventListener('click', () => {
        transformState(element);
    });
    let childCardPicDiv = document.createElement('div');
    childCardPicDiv.style.position = 'relative';
    newDivCard.appendChild(childCardPicDiv);
    childCardPicDiv.appendChild(newImg);

    let newSpan = document.createElement('span');
    newSpan.className = 'mini-card-name';
    newSpan.textContent = element.name;
    newDivCard.appendChild(newSpan);

    if (element.post) {
        newSpan = document.createElement('span');
        newSpan.className = 'mini-card-description';
        newSpan.textContent = element.post;
        newDivCard.appendChild(newSpan);
    }

    if (!isState) {
        const countOfChildren = findChilds(element.id).length;
        if (countOfChildren)
            addIcon(countOfChildren, childCardPicDiv);
    }

    div.appendChild(newDivCard);
}

// Переходим на начальную страницу
function goHome() {
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

    // Удаляем жезл снизу
    const rod = document.getElementsByClassName('rod')[0];
    if (rod)
        rod.style.display = 'none';

    pic.src = 'main/main-1024.svg';
    pic.className = 'startMainPicture';

    
    document.body.removeChild(divRowNotStart);
    document.body.appendChild(divRowStart);

    mainRow.className = 'main-row main-row--start';
}

// Делаем другого персонажа основным
function transformState(obj) {
    // Добавляем кнопки сверху по краям
    updateButtonVisibility(true);

    // Запоминаем текущий id
    currentId = obj.id;

    if (!obj) {
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

    // Имя карточки
    let newSpanMain = document.getElementById('main-text');
    if (!newSpanMain) {
        newSpanMain = document.createElement('span');
        newSpanMain.className = 'text';
        newSpanMain.id = 'main-text';
        document.getElementsByClassName('main-card')[0].appendChild(newSpanMain);
    }
    newSpanMain.textContent = obj.name;

    // Описание карточки
    let newSpanDescription = document.getElementById('description-text');
    if (!newSpanDescription) {
        newSpanDescription = document.createElement('span');
        newSpanDescription.className = 'text';
        newSpanDescription.id = 'description-text';
        document.getElementsByClassName('main-card')[0].appendChild(newSpanDescription);
    }
    newSpanDescription.textContent = obj.post;

    // Удаление всех элементов из div с помощью innerHTML
    divRowNotStart.innerHTML = "";
    const childs = findChilds(obj.id);
    addElementsForWhoHasChildren(childs.length, parent === null, divMain);
    childs.forEach(element => {
        addPersonCard(element, divRowNotStart);
    });

    document.body.removeChild(divRowStart);
    document.body.appendChild(divRowNotStart);

    mainRow.className = 'main-row main-row--not-start';
}

//Добавляем иконку
function addIcon(countOfChildren, div, iconDivId) {
    const newIconDiv = document.createElement('div');
    newIconDiv.className = 'icon';

    if (iconDivId)
        newIconDiv.id = iconDivId;

    const newIconPic = document.createElement('img');
    newIconPic.className = 'icon-number'
    newIconPic.src = 'buttons/icon_number.png';
    newIconDiv.appendChild(newIconPic);

    const newTextIcon = document.createElement('span');
    newTextIcon.classList.add('text-icon-number');
    newTextIcon.classList.add('text');
    newTextIcon.textContent = countOfChildren;

    newIconDiv.appendChild(newTextIcon);
    div.appendChild(newIconDiv);
}

// Добавляем или удаляем элементы в зависимости от кол-ва детей
function addElementsForWhoHasChildren(countOfChildren, isState) {
    let removeIcon = () => {
        const iconDiv = document.getElementById('icon-div');
        if (iconDiv)
            iconDiv.remove();
    }
    // Если это государство, то удаляем иконку
    if (isState)
        removeIcon();
    const rod = document.getElementsByClassName('rod')[0];
    if (!countOfChildren) {
        if (rod)
            rod.style.display = 'none';
        removeIcon();
    }
    else {
        if (rod) {
            // Отображаем жезл после главного окна
            rod.style.display = 'block';
        }
        if (isState)
            return;
        let iconDiv = document.getElementById('icon-div');
        if (!iconDiv) {
            iconDiv = document.createElement('div');
            iconDiv.id = 'icon-div';
            mainCardPic.appendChild(iconDiv);
            addIcon(countOfChildren, iconDiv, 'main-icon-div');
        }
        else {
            const countOfChildrenText = iconDiv.getElementsByTagName('span')[0];
            countOfChildrenText.textContent = countOfChildren;
        }

    }
}

// Прячем стрелочки, если у карточки не братьев
function hideArrows() {
    if (!parent)
        return updateArrowVisibility(true);

    const condition = (element) => element.parent === parent.id;
    const count = global.inputArray.reduce((acc, element) => {
        return condition(element) ? acc + 1 : acc;
    }, 0);

    if (count > 1)
        updateArrowVisibility(true);
    else
        updateArrowVisibility(false);

}

// Добавляем прослушку после загрузки DOM
function initStartStates() {
    for (const state of findStates()) {
        const miniCard_image = document.getElementById(state.id);
        miniCard_image.addEventListener('click', () => {
            transformState(state);
        });
    }
}

if (document.readyState === "loading") {
    // Загрузка ещё не закончилась
    document.addEventListener("DOMContentLoaded", initStartStates);
} else {
    // `DOMContentLoaded` Уже сработал
    initStartStates();
}