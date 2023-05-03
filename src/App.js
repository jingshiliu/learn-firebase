import Auth from "./components/Auth";
import {db, auth, storage} from "./config/firebase"
import {getDocs, collection, addDoc, deleteDoc, doc, updateDoc} from "firebase/firestore"
import {ref, uploadBytes} from "firebase/storage"
import styled from "styled-components";
import {useEffect, useState} from "react";
import MovieCard from "./components/MovieCard";
import FileUploader from "./components/FileUploader";

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
        if (! auth.currentUser){
            console.log('Need to log in to perform this action')
            return
        }

        try{
            console.log('submitting movie')
            await addDoc(movieCollectionRef,
                {
                    releaseDate: newMovieDate,
                    title: newMovieTitle,
                    receivedAnOscar: false,
                    createdBy: auth?.currentUser?.uid
                }
            )
            getMovieList()
            console.log('submitted movie')
        }catch (err){
            console.error(err)
        }
    }

    async function updateMovieTitle(title, movieId){
        try{
            console.log('updating title', title)
            await updateDoc(doc(db, 'movie', movieId), {title: title})
            console.log('updated title')
            getMovieList()
        }catch (err){
            console.error(err)
        }

    }

    async function uploadFile(file){
        if(! file){
            console.log('Hmm no file')
            return
        }

        const filesFolderRef = ref(storage, `projectFolder/${file.name}`)

        try{
            console.log("File uploading")
            await uploadBytes(filesFolderRef, file)
            console.log("File uploaded")
        }catch (e) {
            console.error(e)
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
                <MovieCard deleteMovie={deleteMovie}
                           movie={movie}
                           updateMovieTitle={updateMovieTitle}
                           key={movie.id}
                />
            ))}

            <FileUploader uploadFile={uploadFile}
            />
        </StyledApp>
    );
}

export default App;
