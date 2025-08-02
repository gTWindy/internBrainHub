// Размещает контент на странице
function initStartPageShow() {
    currentId = localStorage.getItem('currentId') || 0;
    if(currentId === '0' || currentId === 'undefined') {
        goHome();
    } else {
        transformState(global.inputArray.find((state) => state.id == currentId));
    }
}

// Добавляем прослушку кнопкам
goHomeButton.addEventListener('click', goHome);

goBackButton.addEventListener('click', () => {
    parent ? transformState(parent) : goHome();
});

leftButtonMain.addEventListener('click', () => {
    parallelTransition(true);
});

rightButtonMain.addEventListener('click', () => {
    parallelTransition(false);
});

// Проверка закончилась ли загрузка документа
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStartPageShow);
} else {
    initStartPageShow();
}