let isVisible = true;  // Измените на false, если кнопки не должны отображаться

function updateButtonVisibility() {
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');

    if (!isVisible) {
        leftButton.style.display = 'none';
        rightButton.style.display = 'none';
    } else {
        leftButton.style.display = 'inline-block';
        rightButton.style.display = 'inline-block';
    }
}

// Вызов функции для обновления видимости кнопок
updateButtonVisibility();


function transformState(imgName)
{
    const pic = document.querySelector('.main-image');
    if (pic) {
        console.log(pic.src); // Выведет URL первой найденной картинки
    }
    pic.src = 'images/'+imgName;
    pic.style.borderRadius = '50%'; /* Для округления картинки */
    pic.style.maxWidth = '50%';
}


// Получаем элемент по ID
const pic1 = document.getElementById(1);
const pic2 = document.getElementById(2);
const pic3 = document.getElementById(3);
// Добавляем обработчик события клика
pic1.addEventListener('click', ()=>{transformState('nilfgaard.jpg')});
// Добавляем обработчик события клика
pic2.addEventListener('click', ()=>{transformState('redania.jpg')});
// Добавляем обработчик события клика
pic3.addEventListener('click', ()=>{transformState('skellige.jpg')});