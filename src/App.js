import "./App.css";
import Shelves from "./Shelves";
import { useState, useEffect } from "react";
import * as BooksAPI from "./BooksAPI";
import Book from "./Book";

// TODO: define the App function which is the root of the whole app and create the required props and states.

function App() {
  const [showSearchPage, setShowSearchpage] = useState(false);
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [searchBooks, setSearchBooks] = useState([]);
  const [joinBooks, setJoinBooks] = useState([]);
  const [mapBooks, setMapBooks] = useState(new Map());

  // TODO: access data from the BooksAPI that Udacity provided. This is necessary for the book searches.

  useEffect(() => {
    BooksAPI.getAll().then((data) => {
      setBooks(data);
      setMapBooks(createMapBooks(data));
    });
  }, []);

  // TODO: Map over all the books provided in the API to select the correct ones according to the search

  useEffect(() => {
    const combined = searchBooks.map((book) => {
      if (mapBooks.has(book.id)) {
        return mapBooks.get(book.id);
      } else {
        return book;
      }
    });
    setJoinBooks(combined);
  }, [searchBooks]);

  // TODO: Makes the search page blank if there are no successful search matches and restores it
  // to blank when the search is complete.

  useEffect(() => {
    let isActive = true;
    if (query) {
      BooksAPI.search(query).then((data) => {
        if (data.error) {
          setSearchBooks([]);
        } else {
          if (isActive) {
            setSearchBooks(data);
          }
        }
      });
    }

    return () => {
      isActive = false;
      setSearchBooks([]);
    };
  }, [query]);

  const createMapBooks = (books) => {
    const map = new Map();
    books.map((book) => map.set(book.id, book));
    return map;
  };

  // TODO: Updates which shelf the book is on and keeps the state when browser is refreshed.

  const updateBookShelf = (book, whereTo) => {
    BooksAPI.update(book, whereTo).then(() => {
      book.shelf = whereTo;
      setBooks(books.filter(b => b.id !== book.id).concat(book));
    })
  };

  return (
    <div className="app">
      {showSearchPage ? (
        <div className="search-books">
          <div className="search-books-bar">
            <a
              className="close-search"
              onClick={() => setShowSearchpage(!showSearchPage)}
            >
              Close
            </a>
            <div className="search-books-input-wrapper">
              <input
                type="text"
                placeholder="Search by title or author"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="search-books-results">
            <ol className="books-grid">
              {joinBooks.map((b) => (
                <li key={b.id}>
                  <Book book={b} changeBookShelf={updateBookShelf} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
            <div>
              <Shelves books={books} updateBookShelf={updateBookShelf} />
            </div>
          </div>
          <div className="open-search">
            <a onClick={() => setShowSearchpage(!showSearchPage)}>Add a book</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
