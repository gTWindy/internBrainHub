
// Родитель-объект текущей карточки
let parent = null;
// Id текущей карточки
let currentId = -1;
// Состояние нахождение на главной странице
let ifNowNotHome = false;
// Состояние того, что мы загрузили карточки государства
let loadedStateCards = false;

// Убрать или добавить видимость для кнопок "Назад" и "Вернуться на стартовую страницу"
function setButtonVisibility(isNotVisible) {
    if (isNotVisible) {
        goBackButton.style.display = 'block';
        goHomeButton.style.display = 'block';
    } else {
        goBackButton.style.display = 'none';
        goHomeButton.style.display = 'none';
    }

    setArrowVisibility(isNotVisible);
}

// Убрать или добавить видимость для кнопок перехода к персонажам слева или справа
function setArrowVisibility(isNotVisible) {
    if (isNotVisible) {
        leftButtonMain.style.display = 'block';
        rightButtonMain.style.display = 'block';
        mainRow.style.justifyContent = 'space-between';
    } else {
        leftButtonMain.style.display = 'none';
        rightButtonMain.style.display = 'none';
        mainRow.style.justifyContent = 'center'
    }
}

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

function findChilds(id) {
    return global.inputArray.filter(person => person.parent === id);
}

// Добавляет дочерние карточки
function addPersonCards(element, div) {
    const newDivCard = document.createElement('div');
    newDivCard.className = element.parent ? 'mini-card mini-card__not-start' : 'mini-card';
    newDivCard.addEventListener('click', () => {
        transformState(element);
    });
    div.appendChild(newDivCard);

    const childCardPicDiv = document.createElement('div');
    childCardPicDiv.style.position = 'relative';
    newDivCard.appendChild(childCardPicDiv);
    
    const newImg = document.createElement('img');
    newImg.src = 'images/' + element.image;
    newImg.className = element.parent ? "mini-card__image" : "mini-card__image mini-card__image_state";
    newImg.addEventListener('click', () => {
        transformState(element);
    });
    childCardPicDiv.appendChild(newImg);

    const newSpan = document.createElement('span');
    newSpan.className = 'mini-card__name';
    newSpan.textContent = element.name;
    newDivCard.appendChild(newSpan);

    if (element.post) {
        const descriptionSpan = document.createElement('span');
        descriptionSpan.className = 'mini-card-description';
        descriptionSpan.textContent = element.post;
        newDivCard.appendChild(descriptionSpan);
    }
    
    if(element.parent && findChilds(element.id).length) {
        // Добавляем иконку с кол-вом детей дочерней карточке 
        const newIconDiv = document.createElement('div');
        newIconDiv.className = 'icon';
    
        const newIconPic = document.createElement('img');
        newIconPic.className = 'icon-number'
        newIconPic.src = 'buttons/icon_number.png';
        newIconDiv.appendChild(newIconPic);

        const newTextIcon = document.createElement('span');
        newTextIcon.classList.add('text-icon-number');
        newTextIcon.classList.add('text');
    
        newTextIcon.textContent = findChilds(element.id).length;

        newIconDiv.appendChild(newTextIcon);
        childCardPicDiv.appendChild(newIconDiv);
    }
}

// Переходим на начальную страницу
function goHome() {
    // Убираем видимость кнопок "Назад" и "Вернуться на стартовую страницу" на главной странице
    setButtonVisibility(false);
    addOrDeleteElements(0);
    localStorage.setItem('currentId', 0);

    //Удаляем имя снизу
    mainTextName.style.display = 'none';

    //Удаляем подпись снизу
    mainTextDescription.style.display = 'none';

    // Удаляем жезл снизу 
    rod.style.display = 'none';

    mainPic.src = 'main/main-1024.svg';
    mainPic.className = 'main-card__pic_start';

    if (ifNowNotHome)
        document.body.removeChild(divRowNotStart);
    ifNowNotHome = false;
    document.body.appendChild(divRowStart);

    if(!loadedStateCards) {
       // Ищем карточки-государства и добавляем их
        for (const state of global.inputArray.filter(state => !state.parent)) {
            addPersonCards(state, divRowStart);
        }
        loadedStateCards = true
    }
    mainRow.className = 'main-row main-row__start';  
}

// Делает другого персонажа основным
function transformState(obj) {
    if (!obj) {
        console.log('Не найден')
        return;
    }

    // Добавляем кнопки сверху по краям
    setButtonVisibility(true);

    // Запоминаем текущий id
    currentId = obj.id;
    localStorage.setItem('currentId', currentId);
    
    // Запоминаем родителя
    parent = obj.parent ? global.inputArray.find((element) => {
        return element.id === obj.parent;
    }) : null;

    // Прячем стрелочки, если у карточки нет братьев
    if (!parent)
        setArrowVisibility(true);
    else {
        // Смотрим сколько братьев
        const siblingCount = global.inputArray.reduce((acc, element) => {
            return element.parent === parent.id ? acc + 1 : acc;
        }, 0);

        setArrowVisibility(siblingCount > 1 ? true : false);
    }

    mainPic.src = 'images/' + obj.image;
    mainPic.className = 'main-card__pic_not-start';

    // Имя карточки
    mainTextName.textContent = obj.name;
    mainTextName.style.display = 'block';
    
    // Описание карточки
    mainTextDescription.textContent = obj.post;
    mainTextDescription.style.display = 'block';

    // Удаление всех элементов из div с помощью innerHTML
    divRowNotStart.innerHTML = "";
    const childs = findChilds(obj.id);
    addOrDeleteElements(childs.length, !parent);
    childs.forEach(element => {
        addPersonCards(element, divRowNotStart);
    });

    if(!ifNowNotHome) {
        document.body.removeChild(divRowStart);
        document.body.appendChild(divRowNotStart);

        mainRow.className = 'main-row main-row__not-start';
        ifNowNotHome = true;
    }
}

// Добавляем или удаляем элементы в зависимости от активной карточки
function addOrDeleteElements(countOfChildren, isState) {
    // Если это государство, то удаляем иконку
    if (isState) {
        mainIconDiv.style.display = 'none';
        if (!countOfChildren)
            rod.style.display = 'none';
        return;
    }
    
    if (!countOfChildren) {
        rod.style.display = 'none';
        mainIconDiv.style.display = 'none';
    } else {
        // Отображаем жезл после главного окна
        rod.style.display = 'block';
        if (isState)
            return;
        mainIconDiv.style.display = 'block';
        const countOfChildrenText = mainIconDiv.getElementsByTagName('span')[0];
        countOfChildrenText.textContent = countOfChildren;
    }
}