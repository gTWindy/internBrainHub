
// Контейнер активной карточки
const mainCardPic = document.getElementsByClassName('main-card')[0];
// Картинка активной карточки
const mainPic = document.getElementById('main-pic');
// Имя активной карточки
const mainTextName = document.getElementsByClassName('main-text')[0];
// Описание активной карточки
const mainTextDescription = document.getElementsByClassName('description-text')[0];
// Контейнер основной карточки вместе со стрелочками
const mainRow = document.getElementsByClassName('main-row')[0];
// Контейнер для икноки активной карточки
const mainIconDiv = document.getElementsByClassName('main-icon-div')[0];
// Контейнер для государств (начальная страница)
const divRowStart = document.getElementsByClassName('childs-row__start')[0];
// Контейнер для дочерних элементов активной карточки
const divRowNotStart = document.createElement('div');
divRowNotStart.className = 'row childs-row childs-row__not-start';
// Жезл между активной карточкой и его детьми
const rod = document.getElementsByClassName('rod')[0];
// Кнопка "Вернуться на стартовую страницу"
const goHomeButton = document.getElementsByClassName('image-button__right-button')[0];
// Кнопка "Вернуться назад"
const goBackButton = document.getElementsByClassName('back-button__left-button')[0];
// Кнопка "Перейти к персонажу слева"
const leftButtonMain = document.getElementsByClassName('image-button__left-arrow')[0];
// Кнопка "Перейти к персонажу справа"
const rightButtonMain = document.getElementsByClassName('image-button__right-arrow')[0];