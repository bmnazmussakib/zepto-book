const API_URL = "https://gutendex.com/books";

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

const fetchWishlistBooks = () => {
  const wishlist = getWishlistFromLocalDB();
  const booklist = getBookFromLocalDB();

  //   const wishlistBooks = document.getElementById("wishlist-books");
  //   wishlistBooks.innerHTML = ""; // Clear previous list

  //   if (wishlist.length === 0) {
  //     wishlistBooks.innerHTML = "<p>No books in wishlist.</p>";
  //     return;
  //   }

  //   wishlist.forEach((bookId) => {
  //     fetch(`${API_URL}/${bookId}`)
  //       .then((response) => response.json())
  //       .then((book) => {
  //         displayWishlistBook(book);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching wishlist book:", error);
  //       });
  //   });

  const wishListBooks = booklist?.results?.filter((item) =>
    wishlist?.includes(item?.id)
  );
  console.log(wishListBooks);
  displayBooks(wishListBooks);
};

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
  fetchWishlistBooks(); // Re-render the books with updated wishlist status
};

const removeFromWishlist = (bookId) => {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter((id) => id !== bookId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  fetchWishlistBooks(); // Re-fetch wishlist after removal
};

const isInWishlist = (bookId) => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.includes(bookId);
};

fetchWishlistBooks();
