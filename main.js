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
    let pic = document.querySelector('.main-image');
    if (pic) {
        console.log(pic.src); // Выведет URL первой найденной картинки
    }
    pic.src = 'main/main-1024.png';

    const div = document.getElementById('row');
    // Удаление всех элементов из div с помощью innerHTML
    div.innerHTML = "";
    const states = findStates();;
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

    let pic = document.querySelector('.main-image');
    if (pic) {
        console.log(pic.src); // Выведет URL первой найденной картинки
    }
    pic.src = 'images/' + obj.image;
    pic.style.borderRadius = '50%'; /* Для округления картинки */
    pic.style.maxWidth = '50%';

    const div = document.getElementById('row');
    // Удаление всех элементов из div с помощью innerHTML
    div.innerHTML = "";
    const childs = findChilds(obj.id);
    childs.forEach(element => {
        addPersonCard(element, div);
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