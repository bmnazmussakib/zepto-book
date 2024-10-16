const API_URL = "https://gutendex.com/books";
let bookCache = {}; // Cache for storing books by page
let currentPage = 1;

const storeBookToLocalDB = (data) => {
  localStorage.setItem("bookList", JSON.stringify(data));
};

const getBookFromLocalDB = () => {
  const bookList = localStorage.getItem("bookList")
    ? JSON.parse(localStorage.getItem("bookList"))
    : "";
  return bookList;
};

const fetchBooks = (page = 1) => {
  //   fetch(`${API_URL}?page=${page}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //         storeBookToLocalDB(data)
  //     //   bookCache[page] = data.results; // Cache the result
  //       displayBooks(data.results)

  //     })
  //     .catch((error) => {
  //       console.error("Error fetching books:", error);
  //     });

  const bookList = getBookFromLocalDB();
  displayBooks(bookList.results);
  //   console.log(bookList)
};

const displayBooks = (books) => {
  const bookList = document.getElementById("book-card-row");
  bookList.innerHTML = "";

  books?.map((item) => {
    console.log("item: ", item?.formats);
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
        <div class="card book-card shadow h-100">
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

const toggleWishlist = (bookId) => {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlist.includes(bookId)) {
    wishlist = wishlist.filter((id) => id !== bookId);
  } else {
    wishlist.push(bookId);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  fetchBooks(currentPage); // Re-render the books with updated wishlist status
};

const isInWishlist = (bookId) => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.includes(bookId);
};

// Initial fetch
fetchBooks(currentPage);
