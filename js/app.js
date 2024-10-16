const API_URL = "https://gutendex.com/books";
let bookCache = {}; // Cache for storing books by page
let currentPage = 1;

let storeBookToLocalDB = (data) => {
    localStorage.setItem('bookList', JSON.stringify(data));
}

let getBookFromLocalDB = () => {
    const bookList = localStorage.getItem('bookList') ? JSON.parse(localStorage.getItem('bookList')) : '';
    return bookList;
}
 
// Fetch books from the API with pagination
function fetchBooks(page = 1) {
  fetch(`${API_URL}?page=${page}`)
    .then((response) => response.json())
    .then((data) => {
        storeBookToLocalDB(data)
    //   bookCache[page] = data.results; // Cache the result
    //   displayBooks(data.results)
      
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
}



// Display the books in the DOM
function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    // books.forEach(element => {
    //     console.log(element);
    // });

    books?.map((item)=>{
        console.log(item)
    })
}

// Initial fetch
fetchBooks(currentPage);



