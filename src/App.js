import {Auth} from "./components/Auth";
import {db} from "./config/firebase"
import {getDocs, collection, addDoc, deleteDoc, doc} from "firebase/firestore"
import styled from "styled-components";
import {useEffect, useState} from "react";

const StyledApp = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

function App() {
    const [movieList, setMovieList] = useState([]);
    const [newMovieTitle, setNewMovieTitle] = useState('')
    const [newMovieDate, setNewMovieDate] = useState(0);

    const movieCollectionRef = collection(db, "movie")

    useEffect(() => {
        getMovieList()
    }, [])

    async function getMovieList() {
        try {
            const data = await getDocs(movieCollectionRef)
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))

            setMovieList(filteredData)
            console.log(filteredData)
        } catch (err) {
            console.error(err)
        }
    }

    async function deleteMovie(movieId){
        await deleteDoc(doc(db, 'movie', movieId))
        getMovieList()
    }

    async function onSubmitMovie() {
        try{
            console.log('submitting movie')
            await addDoc(movieCollectionRef,
                {
                    releaseDate: newMovieDate,
                    title: newMovieTitle,
                    receivedAnOscar: false}
            )
            getMovieList()
            console.log('submitted movie')
        }catch (err){
            console.error(err)
        }
    }

    return (
        <StyledApp className="App">
            <Auth/>
            <div>
                <input type="text"
                       placeholder={'New title...'}
                       value={newMovieTitle}
                       onChange={e => setNewMovieTitle(e.target.value)}
                />
                <input type="number"
                       placeholder={'New release date...'}
                       value={newMovieDate}
                       onChange={e => setNewMovieDate(Number(e.target.value))}
                />
                <button onClick={onSubmitMovie}>Create</button>
            </div>

            {movieList.map(movie => (
                <div>
                    <h3>{movie.title}</h3>
                    <h3>Released at {movie.releaseDate}</h3>
                    <button onClick={()=> deleteMovie(movie.id)}>Delete Movie</button>
                    <form>
                        <input type="text"
                               placeholder={'New title...'}
                        />
                        <button>Update</button>
                    </form>
                </div>
            ))}
        </StyledApp>
    );
}

export default App;
