const API_URL = "https://gutendex.com/books";
let currentPage = 1;
const genres = [
  "Fiction", "Non-fiction", "Fantasy", "Science Fiction", "Mystery", "Thriller",
  "Historical", "Romance", "Horror", "Biography", "Adventure", "Classics",
  "Children", "Drama", "Poetry", "Self-help", "Young Adult", "Dystopian", "Memoir"
];


const storeBookToLocalDB = (data) => {
  localStorage.setItem("bookList", JSON.stringify(data));
};

const getBookFromLocalDB = () => {
  const bookList = localStorage.getItem("bookList")
    ? JSON.parse(localStorage.getItem("bookList"))
    : "";
  return bookList;
};

// Show loader during fetch
function showLoader() {
  const bookList = document.getElementById("book-card-row");
  bookList.innerHTML =
    '<div class="loader-wrapper"><span class="loader"></span></div>';
}

// Hide loader after fetching
function hideLoader() {
  const loader = document.querySelector(".loader");
  if (loader) loader.remove();
}


// Get All Books Data
const fetchBooks = async (page = 1) => {
  try {
    showLoader();
    const response = await fetch(`${API_URL}?page=${page}`);
    const data = await response.json();
    hideLoader();
    // storeBookToLocalDB(data);
    displayBooks(data.results);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

// Fetch Books By Search
const fetchBooksBySearch = async (query) => {
  try {
    showLoader(); // Show loader while fetching
    const response = await fetch(
      `${API_URL}?search=${encodeURIComponent(query)}`
    );
    const books = await response.json();
    hideLoader(); // Hide loader once the request completes
    displayBooks(books?.results); // Display search results
  } catch (error) {
    console.error(`Error fetching books with search query "${query}":`, error);
    hideLoader();
  }
};


const searchInput = document.getElementById("search-bar");
searchInput.addEventListener("keyup", async (event) => {
  const query = event.target.value.trim(); 
  if (query.length > 0) {
    await fetchBooksBySearch(query);
  } else {
    fetchBooks();
  }
});


const displayBooks = (books) => {
  try {
    const bookList = document.getElementById("book-card-row");
    bookList.innerHTML = "";

    books?.forEach((item) => {
      console.log("item: ", item?.formats);

      const { id, title, authors, formats } = item;

      const bookDiv = document.createElement("div");
      bookDiv.classList.add("col-lg-3", "col-md-4", "col-sm-6", "col-12");

      bookDiv.innerHTML = `
        <div class="card book-card shadow h-100 ">
              <div class="card-body text-center">
                <div class="card-img mb-3">
                  <img
                    src="${formats["image/jpeg"] || "placeholder.jpg"}"
                    class="card-img-top img-fluid"
                    alt="..."/>
                </div>
                <h5 class="card-title">${title}</h5>
                <p class="card-text">Author: ${
                  authors[0]?.name || "Unknown"
                }</p>
                <button class="btn wishlist-icon" onclick="toggleWishlist(${id})">
                ${
                  isInWishlist(id)
                    ? "<i class='fa-solid fa-heart'></i>"
                    : "<i class='fa-regular fa-heart'></i>"
                }
                </button>
              </div>
              <div class="card-footer text-center border-0">
                <a
                  href="book.html?id=${id}"
                  class="btn commont-btn d-inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >View Details</a>
              </div>
        </div>
      `;

      bookList.appendChild(bookDiv);
    });
  } catch (error) {
    console.error("Error displaying books:", error);
  }
};

// Pagination logic
const changePage = (offset) => {
  const nextPage = currentPage + offset;
  if (nextPage < 1) return;

  currentPage = nextPage;
  document.getElementById("current-page").innerText = currentPage;
  fetchBooks(currentPage);
}

const genreSelect = document.getElementById("genre-select");

// Populate genre dropdown
const populateGenreDropdown = () => {
  genres.map((genre) => {
    const option = document.createElement("option");
    option.value = genre.toLowerCase();
    option.textContent = genre;
    genreSelect.appendChild(option);
  });
};

// Call the function to populate genres
populateGenreDropdown();

// Fetch Book By genres
const fetchBooksByGenre = async (genre) => {
  try {
    showLoader();
    const response = await fetch(`${API_URL}?topic=${genre}`); // Use the selected genre in the query
    const data = await response.json();
    hideLoader();

    displayBooks(data.results); // Display the fetched books
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

// Genre Filter event change
genreSelect.addEventListener('change', (e) => {
  const selectedGenre = e.target.value;
  fetchBooksByGenre(selectedGenre); // Fetch books with the selected genre
});

// Toggle Wishlist
const toggleWishlist = (bookId) => {
  try {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.includes(bookId)) {
      wishlist = wishlist.filter((id) => id !== bookId);
    } else {
      wishlist.push(bookId);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    fetchBooks(currentPage); // Re-render the books with updated wishlist status
  } catch (error) {
    console.error("Error toggling wishlist:", error);
  }
};

// Check if it is in wishlist or not
const isInWishlist = (bookId) => {
  try {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.includes(bookId);
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }
};

// Initial fetch
fetchBooks(currentPage);
