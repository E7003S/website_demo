function listen(e) {
    const bookCard = e.target.parentElement;
    const bookDescription = bookCard.children[2].innerText;
    const bookName = bookCard.children[0].innerText;
    const authorName = bookCard.children[1].innerText;
  
    const message = `The name of the book is ${bookName}  . It is written ${authorName} .  ${bookDescription}`;
  
    console.log(bookDescription);
    let synth = speechSynthesis;
    synth.cancel();
  
    setTimeout(() => {
      const speech = new SpeechSynthesisUtterance(message);
      speech.lang = "en-US";
      synth.speak(speech);
    }, 1000);
  }
  
// main.js (Corrected and enhanced with genre search functionality)

function search(e) {
  e.preventDefault();
  const search = document.getElementById("input").value.trim();
  if (search === "") return;

  document.activeElement.blur();
  console.log("Searching for:", search);

  const isGenre = [
    "fiction", "romance", "mystery", "thriller", "fantasy",
    "biography", "history", "science", "horror", "poetry"
  ].includes(search.toLowerCase());

  let query = isGenre ? `subject:${search}` : `"${search}"`;

  $.ajax({
    url: `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`,
    type: "GET",
    dataType: "json",
    beforeSend: function () {
      $(".whirly-loader").show();
    },
    complete: function () {
      $(".whirly-loader").hide();
    },
    success: function (res) {
      const resultsContainer = document.getElementById("results");
      resultsContainer.innerHTML = "";

      if (res.totalItems === 0) {
        let notfound = document.createElement("DIV");
        notfound.innerHTML = `
        <div class="d-flex flex-column flex-sm-row align-items-center justify-content-center text-center text-sm-left error-page">
            <img src="./img/file-not-found.gif" alt="404 error" width="100" height="100" class="m-2">
            <div>
              <p class="fs-3"> <span class="text-danger">Oops!</span> Book not found.</p>
              <p class="lead">The book you’re looking for doesn’t exist.</p>
            </div>
        </div>`;
        resultsContainer.appendChild(notfound);
        return;
      }

      for (let i = 0; i < res.items.length; i++) {
        const bookCard = document.createElement("div");
        bookCard.classList.add("result", "row");
        bookCard.setAttribute("data-aos", "fade-up");

        // Image
        let bookImageContainer = document.createElement("div");
        bookImageContainer.classList.add("col-md-2", "offset-md-2");

        if (res.items[i].volumeInfo.imageLinks) {
          const bookImage = document.createElement("img");
          bookImage.src = res.items[i].volumeInfo.imageLinks.smallThumbnail;
          bookImage.classList.add("w-100");
          bookImageContainer.appendChild(bookImage);
        }

        // Info
        const bookInfo = document.createElement("div");
        bookInfo.classList.add("col-md-8");

        const bookTitle = document.createElement("h1");
        bookTitle.textContent = res.items[i].volumeInfo.title;

        const bookAuthor = document.createElement("h6");
        if (res.items[i].volumeInfo.authors) {
          bookAuthor.textContent = `by ${res.items[i].volumeInfo.authors[0] || "No title"}`;
        }

        const bookDescription = document.createElement("p");
        bookDescription.classList.add("description");

        const desc = res.items[i].volumeInfo.description || "No description";

        const shortPar = document.createElement("span");
        shortPar.classList.add("short-description");
        shortPar.textContent = desc.substring(0, 100);

        const remainingPar = document.createElement("span");
        remainingPar.classList.add("remaining-description");
        remainingPar.textContent = desc.substring(100);

        const readMoreBtn = document.createElement("span");
        readMoreBtn.classList.add("read-more-btn");
        readMoreBtn.textContent = " ...Read More";
        readMoreBtn.addEventListener("click", () => {
          const title = res.items[i].volumeInfo.title;
          const author = res.items[i].volumeInfo.authors ? res.items[i].volumeInfo.authors[0] : "Unknown";
          const description = desc;

          const url = `book.html?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&description=${encodeURIComponent(description)}`;
          window.location.href = url;
        });

        bookDescription.append(shortPar, remainingPar);
        if (desc !== "No description") {
          bookDescription.appendChild(readMoreBtn);
        }

        const bookPreviewLink = document.createElement("a");
        bookPreviewLink.innerHTML = "READ";
        bookPreviewLink.href = res.items[i].volumeInfo.previewLink;
        bookPreviewLink.target = "_blank";
        bookPreviewLink.classList.add("btn", "btn-outline-secondary");

        const speechButton = document.createElement("button");
        speechButton.classList.add("listen", "btn", "btn-outline-secondary");
        speechButton.textContent = "LISTEN";

        bookInfo.append(bookTitle, bookAuthor, bookDescription);
        bookCard.append(bookInfo, bookImageContainer);
        resultsContainer.appendChild(bookCard);
        resultsContainer.scrollIntoView();
      }

      const speechButtons = document.querySelectorAll(".listen");
      for (const btn of speechButtons) {
        btn.addEventListener("click", (e) => {
          console.log("clicked");
          listen(e); // ensure 'listen' function is defined elsewhere
        });
      }
    }
  });
}
  
  document.querySelector(".search-form").addEventListener("submit", search);
  
  const scroll = document.getElementById("return-to-top");
  window.onscroll = () => scrollFunction();
  function scrollFunction() {
    if (document.body.scrollTop || document.documentElement.scrollTop > 20) {
      scroll.classList.remove("special1");
    } else {
      scroll.classList.add("special1");
    }
  }
  var icon = document.getElementById("icon");
  icon.onclick = function () {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
      icon.src = "img/sun.png";
      localStorage.setItem("theme", "dark");
    } else {
      icon.src = "img/moon.png";
      localStorage.setItem("theme", "light");
    }
  };
  
  const initIcon = () => {
    if (document.body.classList.contains("dark-theme")) {
      icon.src = "img/sun.png";
    } else {
      icon.src = "img/moon.png";
    }
  };
  window.onload = initIcon();
