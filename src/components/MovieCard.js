import React, {useState} from 'react';

function MovieCard({movie, deleteMovie, updateMovieTitle}) {
    const [title, setTitle] = useState(movie.title)
    console.log(title)
    return (
        <div>
            <h3>{movie.title}</h3>
            <h3>Released at {movie.releaseDate}</h3>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input type="text"
                   placeholder={'New title...'}
                   onChange={e => setTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(title, movie.id)}>Update</button>
        </div>
    );
}

export default MovieCard;