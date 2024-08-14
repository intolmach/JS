const searchBlock = document.querySelector('.search-block');
const inputBox = document.querySelector('input');
const searchList = document.querySelector('.search-list');
const searchResult = document.querySelector('.search-result');
function debounce(fn, debounceTime) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, debounceTime);
    }
};

function createElementWithText(tagName, text) {
    const result = document.createElement(tagName);
    result.textContent = text;
    return result;
}

function clearResults () {
    searchList.replaceChildren();
}

function createResultItem(item) {
    const resultItem = document.createElement('li');
    resultItem.classList.add('result-list__item');
    
    const nameItem = createElementWithText("p",`Name: ${item.name}`);

    const ownerItem = createElementWithText("p",`Owner: ${item.owner.login}`)

    const starsItem = createElementWithText("p",`Stars: ${item.stargazers_count}`)

    const deleteButton = document.createElement('p');
    deleteButton.classList.add('result-list__item--delete')

    deleteButton.addEventListener('click', () => resultItem.remove());

    resultItem.append(nameItem,ownerItem,starsItem,deleteButton)
    searchResult.appendChild(resultItem);
}

inputBox.addEventListener('input', debounce(function(e) {
    const inputText = e.target.value
    if (inputText) {
        fetch(`https://api.github.com/search/repositories?sort=stars&order=desc&per_page=5&q=${inputText}`)
            .then(response => response.json())
            .then(data => {
                const searchItems = data.items.map(item => {
                    const searchItem = createElementWithText("li", item.full_name);
                    searchItem.addEventListener('click', () => {
                    createResultItem(item);
                    clearResults();
                    inputBox.value = '';
                });
                    searchItem.classList.add('search-list__item');
                    return searchItem;
                });
                searchList.replaceChildren(...searchItems)  
            })
            .catch(error => console.log('Ошибка:', error));
    } else {
        clearResults();
    }
}), 1000);
