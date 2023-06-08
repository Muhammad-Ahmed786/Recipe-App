const searchButton = document.querySelector('.searchBtn')
const searchBox = document.getElementById('searchBox');
const recipeContainer = document.querySelector('.recipe-container')
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-closeBtn');
// Array of example suggestions
const suggestions = ['Apam Balik', 'Adobo', 'Biryani', 'Burger', 'Cake', 'Custard', 'Dal Fry', 'Pasta', 'Sandwich'];

// Get the search box element

// Event listener for input changes
searchBox.addEventListener('input', function () {
    const inputText = searchBox.value.toLowerCase();
    const filteredSuggestions = suggestions.filter(function (suggestion) {
        return suggestion.toLowerCase().startsWith(inputText);
    });

    // Clear the previous suggestions
    document.getElementById('suggestions').innerHTML = '';

    // Add the filtered suggestions to the datalist
    filteredSuggestions.forEach(function (suggestion) {
        const option = document.createElement('option');
        option.value = suggestion;
        document.getElementById('suggestions').appendChild(option);
    });
});

const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>"
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        recipeContainer.innerHTML = ""
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p><span>${meal.strCategory}</span> Category</p>
            `
            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            button.addEventListener('click', () => {
                openRecipePopup(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        })
    }
    catch (error) {
        recipeContainer.innerHTML = "<h2>This recipe is not in our list.</h2>"
    }
}

const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`]
        if (ingredient) {
            const measure = meal[`strMeasure${1}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`
        }
        else {
            break;
        }
    }
    return ingredientsList;
}
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientsList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstruction">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `

    recipeDetailsContent.parentElement.style.display = "block";
}

recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Type the meal in search box.</h2>`;
        return
    }
    fetchRecipes(searchInput);
})