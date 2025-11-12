import React, {useEffect, useState} from 'react'
import { useDebounce } from 'react-use';
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.trakt.tv'
const CLIENT_ID = import.meta.env.VITE_TRAKT_CLIENT_ID;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': CLIENT_ID 
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the search term input to limit API calls
  // By waiting for the user to stop typing for 500ms
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    1000,
    [searchTerm]
  );

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endPoint = query? 
        `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&extended=images`:
        `${API_BASE_URL}/movies/trending?extended=images`;
      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('Fetched movies:', data[0].movie);

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'No movies found.');
        setMovieList([]);
        return;
      }

      setMovieList(data || []);

      if (query && data.length > 0) {
        await updateSearchCount(query, data[0].movie);
      }
      
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className='pattern'/>

      <div className='wrapper'>
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>

          <Search seaerchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className='all-movies'>
          <h2 className="mt-[40px]">All Movies</h2>

          {isLoading ? (
            <div className='flex justify-center mt-10'>
              <Spinner />
            </div>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.movie.ids.trakt} movie={movie.movie} API_BASE_URL={API_BASE_URL} API_OPTIONS={API_OPTIONS} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
