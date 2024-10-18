const API_URL = "https://gutendex.com/books";
const bookId = new URLSearchParams(window.location.search).get("id");

// Show loader during fetch
function showLoader() {
  const bookList = document.getElementById('book-details');
  bookList.innerHTML = '<div class="loader-wrapper"><span class="loader"></span></div>';
}

// Hide loader after fetching
function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) loader.remove();
}

const getBookFromLocalDB = () => {
  const bookList = localStorage.getItem("bookList")
    ? JSON.parse(localStorage.getItem("bookList"))
    : "";
  return bookList;
};

// Get Book Details Data
const fetchBookDetails = async () => {
  const navbar = document.getElementById('navbar')
  try {
    showLoader()
    const response = await fetch(`${API_URL}/${bookId}`);
    const book = await response.json();
    hideLoader()
    if (book) {
      navbar.classList.remove("d-none")
    } 
    displayBookDetails(book);
  } catch (error) {
    console.error('Error fetching book details from API:', error);
  }
};

// Display Books
const displayBookDetails = async (item) => {
  try {
    const {
      id,
      title,
      authors,
      translators,
      subjects,
      bookshelves,
      languages,
      copyright,
      media_type,
      formats,
      download_count,
    } = item;

    console.log(await isInWishlist(id)); 

    const bookDetails = document.getElementById("book-details");
    bookDetails.innerHTML = `
      <div class="row g-4">
              <div class="col-md-4 col-sm-5">
                <div class="book-img mb-3">
                  <img
                    src="${formats["image/jpeg"] || 'placeholder.jpg'}"
                    class="card-img-top img-fluid"
                    alt="..."/>
                </div>
              </div>
              <div class="col-md-8 col-sm-7">
                <div class="book-information">
                  <h4 class="book-title">${title}</h4>

                  <ul class="nav flex-column ps-0 info-list">
                    <li class="nav-item">
                      <a class="nav-link" href="#">
                        Authors: <span>${authors[0]?.name || 'Unknown'}</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#"> Media Type: <span>${media_type}</span> </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#"> Translators: <span>${
                        translators?.length > 0 ? translators[0]?.name : "N/A"
                      }</span> </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#"> Bookshelves: <span>${
                        bookshelves[0]
                      }</span> </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#"> Copyright: <span>${
                        copyright ? copyright : "N/A"
                      }</span> </a>
                    </li>
                  </ul>

                  <div class="description">
                    <p>
                      <span>Genres:</span> ${subjects}
                    </p>
                  </div>

                  <div class="btn-wrapper">
                    <button class="btn commont-btn" onclick="toggleWishlist(${id})">
                      ${
                        await isInWishlist(id)
                          ? '<i class="fa-solid fa-heart"></i> Remove from Wishlist'
                          : '<i class="fa-regular fa-heart"></i> Add To Wishlist'
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
      `;
  } catch (error) {
    console.error("Error displaying book details:", error);
  }
};

// Toggle Wishlist
const toggleWishlist = async (bookId) => {
  try {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (wishlist.includes(bookId)) {
      wishlist = wishlist.filter(id => id !== bookId);
    } else {
      wishlist.push(bookId);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));


    await fetchBookDetails();
  } catch (error) {
    console.error("Error toggling wishlist:", error);
  }
};

// Check if it is in wishlist or not
const isInWishlist = async (bookId) => {
  try {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.includes(bookId);
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }
};


fetchBookDetails();
