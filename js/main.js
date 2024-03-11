// ? html elements
// render books elements
let fragment = document.createDocumentFragment();
let elbooklistWrapper = document.querySelector(".js-books-list-wr");
let elBookCardTemplate = document.querySelector(
  ".js-book-card-template"
).content;
let elCounterSaved = document.querySelector(".js-saved-books-counter");

function checkBookmarkArrayCount() {
  if (savedBooks.length === 0) {
    elCounterSaved.classList.add("hidden");
  } else {
    elCounterSaved.classList.remove("hidden");
    elCounterSaved.textContent = savedBooks.length;
  }
}


// form elements
let elFormSearch = document.querySelector(".js-form-search");
let elInputSearch = document.querySelector(".js-search-input");
let elSelectLanguageCategories = document.querySelector(
  ".js-language-categories"
);
let elInputSearchByAuthor = document.querySelector(".js-search-by-author");
let elSearchinputByMinYear = document.querySelector(
  ".js-serach-input-min-year"
);
let elSearchInputByMaxYear = document.querySelector(
  ".js-serach-input-max-year"
);
let elSortField = document.querySelector(".js-sort-field");
// bookmark saved books
let elOpenModalBtn = document.querySelector(".js-open-saved-books-modal");
let modal = document.querySelector(".offcanvas");
let eltemplateSavedBooks = document.querySelector(
  ".js-saved-books-card"
).content;
let elSavedBooksWr = document.querySelector(".js-bookmarks-wr");

// ? unique variables
let languageCategories = [];
let savedBooks = JSON.parse(window.localStorage.getItem("savedbooks")) || [];

// ? functions
function getUniqueLanguages(arr) {
  arr.forEach((item) => {
    if (!languageCategories.includes(item.language)) {
      languageCategories.push(item.language);
    }
  });
}
getUniqueLanguages(books);

function renderLanguageCategories(arr) {
  arr.forEach((item) => {
    let option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    elSelectLanguageCategories.appendChild(option);
  });
}
renderLanguageCategories(languageCategories);

function processBookTitle(title, regex) {
  let processedTitle =
    title.length > 20 ? title.substring(0, 20) + "..." : title;
  if (regex && regex.source !== "(?:)") {
    processedTitle = processedTitle.replace(
      regex,
      (match) =>
        `<mark class="d-inline-block p-0 bg-warning text-light rounded-2">${match}</mark>`
    );
  }
  return processedTitle;
}

function sort(arr) {
  arr.sort((a, b) => {
    if (elSortField.value === "a-z") {
      if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
      if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
      return 0;
    }

    if (elSortField.value === "z-a") {
      if (a.title.toLowerCase() < b.title.toLowerCase()) return 1;
      if (a.title.toLowerCase() > b.title.toLowerCase()) return -1;
      return 0;
    }

    if (elSortField.value === "max-to-low-page") {
      return b.pages - a.pages;
    }

    if (elSortField.value === "low-to-max-page") {
      return a.pages - b.pages;
    }

    if (elSortField.value === "min-to-max-year") {
      return a.year - b.year;
    }

    if (elSortField.value === "max-to-min-year") {
      return b.year - a.year;
    }
    return 0;
  });
}

function renderBooks(arr, node, regexTitle = "", regexAuthor = "") {
  node.innerHTML = "";
  arr.forEach((book) => {
    let cloneNode = elBookCardTemplate.cloneNode(true);
    cloneNode.querySelector(".js-book-image").src = book.imageLink;
    let processedTitle = processBookTitle(book.title, regexTitle);
    cloneNode.querySelector(".js-book-title").innerHTML = processedTitle;
    cloneNode.querySelector(".js-book-author").textContent = book.author;
    let processedAuthor = processBookTitle(book.author, regexAuthor);
    cloneNode.querySelector(".js-book-author").innerHTML = processedAuthor;
    cloneNode.querySelector(".js-book-year-publish").textContent = book.year;
    cloneNode.querySelector(".js-book-pages").textContent = book.pages;
    cloneNode.querySelector(".js-book-language").textContent = book.language
      .split(" ")
      .slice(0, 1)
      .join("");
    cloneNode.querySelector(".js-book-link-wiki").href = book.link;
    cloneNode.querySelector(".js-save-book-to-bookmark").dataset.bookId =
      book.year;

    if (savedBooks.some((item) => item.title == book.title)) {
      cloneNode.querySelector(".js-save-book-to-bookmark").textContent =
        "bookmarked";
      cloneNode
        .querySelector(".js-save-book-to-bookmark")
        .classList.add("bookmarked");
    } else {
      cloneNode.querySelector(".js-save-book-to-bookmark").textContent =
        "save to list";
      cloneNode
        .querySelector(".js-save-book-to-bookmark")
        .classList.remove("bookmarked");
    }
    fragment.appendChild(cloneNode);
  });
  node.appendChild(fragment);
}
renderBooks(books, elbooklistWrapper);

function handleSubmit(event) {
  event.preventDefault();
  let inputSearchValue = elInputSearch.value.trim();
  let searchRegex = new RegExp(inputSearchValue, "gi");
  let authorInputvalue = elInputSearchByAuthor.value.trim();
  let authorRegex = new RegExp(authorInputvalue, "gi");
  let searchedValues = books.filter((item) => {
    return (
      item.title.match(searchRegex) &&
      (elSelectLanguageCategories.value === "all" ||
        item.language.includes(elSelectLanguageCategories.value)) &&
      (elInputSearchByAuthor.value === "" || item.author.match(authorRegex)) &&
      (elSearchinputByMinYear.value == "" ||
        item.year > elSearchinputByMinYear.value) &&
      (elSearchInputByMaxYear.value == "" ||
        item.year < elSearchInputByMaxYear.value)
    );
  });
  if (searchedValues.length > 0) {
    sort(searchedValues);
    renderBooks(searchedValues, elbooklistWrapper, searchRegex, authorRegex);
  } else {
    alert("No books found by search criteria.");
  }
}

function renderSavedBooks(arr, node) {
  node.innerHTML = "";
  arr.forEach((item) => {
    let cloneNode = eltemplateSavedBooks.cloneNode(true);
    cloneNode.querySelector(".js-book-image").src = item.imageLink;
    cloneNode.querySelector(".js-book-title").textContent = item.title;
    cloneNode.querySelector(".js-book-link-wiki").href = item.link;
    cloneNode.querySelector(".js-saved-book-delete").dataset.idYear = item.year;
    node.appendChild(cloneNode);
  });
}

//? event listeners
elOpenModalBtn.addEventListener("click", (evet) => {
  modal.classList.toggle("hidden");
});

closeButton.addEventListener("click", (evet) => {
  modal.classList.add("hidden");
});

elbooklistWrapper.addEventListener("click", (event) => {
  if (event.target.matches(".js-save-book-to-bookmark")) {
    event.target.classList.toggle("bookmarked");
    let id = event.target.dataset.bookId;
    let findObj = books.find((item) => item.year == id);

    if (event.target.classList.contains("bookmarked")) {
      if (findObj) {
        event.target.textContent = "Bookmarked";
        savedBooks.push(findObj);
        window.localStorage.setItem("savedbooks", JSON.stringify(savedBooks));
        renderSavedBooks(savedBooks, elSavedBooksWr);
        checkBookmarkArrayCount();
      }
    } else {
      event.target.textContent = "save book";
      event.target.classList.remove("bg-black-900");
      let indexToRemove = savedBooks.findIndex((item) => item.year == id);
      if (indexToRemove !== -1) {
        savedBooks.splice(indexToRemove, 1);
        window.localStorage.setItem("savedbooks", JSON.stringify(savedBooks));
        renderSavedBooks(savedBooks, elSavedBooksWr);
        checkBookmarkArrayCount();
      }
    }
  }
});

elSavedBooksWr.addEventListener("click", (event) => {
  if (event.target.matches(".js-saved-book-delete")) {
    let id = event.target.dataset.idYear;
    let indexRemove = savedBooks.findIndex((item) => {
      return item.year == id;
    });
    if (indexRemove !== -1) {
      savedBooks.splice(indexRemove, 1);
      window.localStorage.setItem("savedbooks", JSON.stringify(savedBooks));
      renderSavedBooks(savedBooks, elSavedBooksWr);
      renderBooks(books, elbooklistWrapper);
      checkBookmarkArrayCount();
    }
  }
});

elFormSearch.addEventListener("submit", handleSubmit);
renderSavedBooks(savedBooks, elSavedBooksWr);
renderBooks(books, elbooklistWrapper);
checkBookmarkArrayCount();
