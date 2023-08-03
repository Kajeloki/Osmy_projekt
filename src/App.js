import React, {useState, useEffect, useCallback} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setMovies]=useState([]);
  const [isLoading, setIsLoadnig]=useState(false);
  const [error, setError]=useState(null);



  const fetchMoviesHandler =useCallback(async ()=>{
    setIsLoadnig(true);
    setError(null);
    try{
      const response = await fetch('https://react-http-8a1b2-default-rtdb.europe-west1.firebasedatabase.app/movies.json')
      if(!response.ok)
      {
        throw new Error("Błąd 404 - nie znaleziono strony o podanym adresie");
      }
      const data= await response.json();
      const loadedMovies =[];
      for( const key in data)
      {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }

        // const transformedMovies = data.map(movieData =>{
        //   return {
        //     id: movieData.episode_id,
        //     title: movieData.title,
        //     releaseDate: movieData.release_date,
        //     openingText: movieData.opening_crawl
        //   };
        // });
        setMovies(loadedMovies);
        setIsLoadnig(false);
    } catch(error)
    {
      setError(error.message)
      
    }
    setIsLoadnig(false);
  },[]);

  useEffect(()=>{
    fetchMoviesHandler();
  }, []);
  const addMovieHandler = async (movie)=>{
   const response = await  fetch('https://react-http-8a1b2-default-rtdb.europe-west1.firebasedatabase.app/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'ContentoType' : 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }
  let content = <p>Brak treści do wyświetlenia</p>;

  if(!isLoading && error)
  {
    content=error;
  }
  
  

  if(isLoading)
  {
    content = <p>Wczytywanie treści</p>;
  }
  

  if( !isLoading && movies.length>0 && !error)
  content= <MoviesList movies={movies} />;
  return (
    <React.Fragment>
       <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Pobierz filmy </button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
