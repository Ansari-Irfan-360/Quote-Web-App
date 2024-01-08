const quoteElement2 = document.getElementById("quote2");
const authorElement2 = document.getElementById("author2");

document.addEventListener("DOMContentLoaded", function () {
  const quoteElement = document.getElementById("quote");
  const authorElement = document.getElementById("author");

  function getTodayString() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  let prevDate = localStorage.getItem("prevDate") || "none";
  let prevQuoteID = localStorage.getItem("prevQuoteID") || "none";
  const needNewQuote = prevDate !== getTodayString();

  function fetchQuote(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        quoteElement.textContent = data.content;
        authorElement.textContent = `- ${data.author}`;
        prevDate = getTodayString();
        prevQuoteID = data._id;
        localStorage.setItem("prevDate", prevDate);
        localStorage.setItem("prevQuoteID", prevQuoteID);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  if (needNewQuote) {
    fetchQuote("https://api.quotable.io/random");
  } else {
    fetchQuote(`https://api.quotable.io/quotes/${prevQuoteID}`);
  }
});

function getRandomQuote(){
  document.getElementById("title").innerHTML = "Random Quote: ";
  fetch("https://api.quotable.io/random")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        quoteElement2.textContent = data.content;
        authorElement2.textContent = `- ${data.author}`;
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
}

function toggleAuthors() {
    if(document.getElementById('quotes').innerHTML!=''){
        document.getElementById('quotes').innerHTML='';
    }
  const authorsDiv = document.querySelector(".authors");
  authorsDiv.classList.toggle("expanded");
  fetchAuthors();
}
function fetchAuthors() {
    fetch("https://api.quotable.io/authors")
        .then(response => response.json())
        .then(data => {
            const authorsList = document.getElementById('authors-list');
            data.results.forEach(author => {
                const listItem = document.createElement('li');
                listItem.textContent = author.name;
                listItem.onclick = () => fetchQuotesByAuthor(author.name);
                authorsList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching authors:', error));
}

function fetchQuotesByAuthor(authorName) {
    fetch(`https://api.quotable.io/quotes?author=${encodeURIComponent(authorName)}`)
        .then(response => response.json())
        .then(data => {
            const quotesDiv = document.getElementById('quotes');
            quotesDiv.innerHTML = `Quotes by ${authorName} :`;
            data.results.forEach(quote => {
                const quoteElement = document.createElement('p');
                quoteElement.textContent = `"${quote.content}"`;
                quotesDiv.appendChild(quoteElement);
            });
            quotesDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
        })
        .catch(error => console.error('Error fetching quotes:', error));
}
