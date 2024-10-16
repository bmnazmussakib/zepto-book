const API_URL = "https://gutendex.com/books";
const bookId = new URLSearchParams(window.location.search).get("id");

// console.log(bookId)

let getBookFromLocalDB = () => {
  const bookList = localStorage.getItem("bookList")
    ? JSON.parse(localStorage.getItem("bookList"))
    : "";
  return bookList;
};

function fetchBookDetails() {
  // fetch(`${API_URL}/${bookId}`)
  //     .then(response => response.json())
  //     .then(book => displayBookDetails(book))
  //     .catch(error => {
  //         console.error('Error fetching book details:', error);
  //     });

  const getAllBook = getBookFromLocalDB();
  const getBookDetails = getAllBook?.results?.filter(
    (item) => item?.id == bookId
  );
  displayBookDeatails(getBookDetails[0]);
  console.log(getBookDetails);
}

const displayBookDeatails = (item) => {
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

  const bookDetails = document.getElementById("book-details");
  bookDetails.innerHTML = `
    <div class="row g-4">
            <div class="col-lg-4">
              <div class="book-img mb-3">
                <img
                  src="${formats["image/jpeg"]}"
                  class="card-img-top img-fluid"
                  alt="..."
                />
              </div>
            </div>
            <div class="col-lg-8">
              <div class="book-information">
                <h4 class="book-title">${title}</h4>

                <ul class="nav flex-column ps-0 info-list">
                  <li class="nav-item">
                    <a class="nav-link" href="#">
                      authors: <span>${authors[0]?.name}</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#"> Media Type: <span>${media_type}</span> </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#"> translators: <span>${
                      translators?.length > 0 ? translators[0]?.name : "N/A"
                    }</span> </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#"> bookshelves: <span>${
                      bookshelves[0]
                    }</span> </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#"> copyright: <span>${
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
                  <button class="btn commont-btn">
                    <i class="fa-regular fa-heart"></i> Add To Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
    `;
};

fetchBookDetails();
