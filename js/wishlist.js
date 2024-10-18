const API_URL = "https://gutendex.com/books";

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

const getBookFromLocalDB = () => {
  const bookList = localStorage.getItem("bookList")
    ? JSON.parse(localStorage.getItem("bookList"))
    : [];
  return bookList;
};

const getWishlistFromLocalDB = () => {
  const bookList = localStorage.getItem("wishlist")
    ? JSON.parse(localStorage.getItem("wishlist"))
    : [];
  return bookList;
};

// Get Wishlist Data
const fetchWishlistBooks = async () => {
  
    const wishlistBooks = document.getElementById("book-card-row");
    wishlistBooks.innerHTML = ""; 

    const wishlist = await getWishlistFromLocalDB(); 
    
    if (wishlist.length === 0) {
      wishlistBooks.innerHTML = "<p>No books in wishlist.</p>";
      return;
    }
    
    
    const ids = wishlist.join(',');
    console.log(ids);

    const navbar = document.getElementById('navbar')
    try {
      showLoader();
      
      const response = await fetch(`${API_URL}?ids=${ids}`);
      const books = await response.json();
      hideLoader();
      if (books?.results?.length > 1) {
        navbar.classList.remove("d-none")
      } 
      
      displayBooks(books?.results); 
    } catch (error) {
      console.error(`Error fetching books with IDs :`, error);
      
    }
  
};

fetchWishlistBooks();

// Display books
const displayBooks = (books) => {
  const bookList = document.getElementById("book-card-row");
  bookList.innerHTML = "";

  books?.map((item) => {
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
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("col-lg-3", "col-md-4", "col-sm-6", "col-12");

    bookDiv.innerHTML = `
          <div class="card book-card shadow h-100 ">
                <div class="card-body text-center">
                  <div class="card-img mb-3">
                    <img
                      src="${formats["image/jpeg"]}"
                      class="card-img-top img-fluid"
                      alt="..."
                    />
                  </div>
                  <h5 class="card-title">${title}</h5>
                  <p class="card-text">Author: ${authors[0].name}</p>
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
                    >View Details</a
                  >
                </div>
              </div>
      `;
    bookList.appendChild(bookDiv);
  });
};

// Toggle Wishlist
const toggleWishlist = (bookId) => {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlist.includes(bookId)) {
    wishlist = wishlist.filter((id) => id !== bookId);
  } else {
    wishlist.push(bookId);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  fetchWishlistBooks(); 
};

const removeFromWishlist = (bookId) => {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter((id) => id !== bookId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  fetchWishlistBooks(); 
};

// Check if it is in wishlist or not
const isInWishlist = (bookId) => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.includes(bookId);
};


