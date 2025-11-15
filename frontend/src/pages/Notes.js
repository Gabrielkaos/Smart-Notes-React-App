import api from "../api/Axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";


const Notes = () => {
    const [notes, setNotes] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [editingID, setEditingID] = useState(null)
    const {user, logout} = useContext(AuthContext)


    const fetchNotes = async () =>{
        try{
            const res = await api.get("/notes")
            setNotes(res.data.notes)
        }catch(err){
            console.error(err)
        }
    }

    useEffect(()=>{
        fetchNotes()
    }, [])

    const handleCreateNotes =  async (e) =>{
        e.preventDefault()
        try{
            await api.post("/notes",{title, description})
            setTitle("")
            setDescription("")
            fetchNotes()
        }catch(err){
            console.error(err)
        }
    }

    const updateNote = async (id)=>{
        try{
            await api.put(`/notes/${id}`,{title, description})
            setEditingID(null)
            setTitle("")
            setDescription("")
            fetchNotes()
        }catch(err){
            console.error(err)
        }
    }

    const deleteNote = async (id)=>{
        if(window.confirm("Are you sure you want to delete?")){
            try{
                await api.delete(`/notes/${id}`)
                fetchNotes()
            }catch(err){
                console.error(err)
            }
        }
    }

    const startEdit = (task)=>{
        setEditingID(task.id)
        setTitle(task.title)
        setDescription(task.description)
    }

    return (
        <div>
            <header>
                <h1>My Notes</h1>
                <div>
                    <span>Welcome {user?.username}!</span>
                    <button onClick={logout}>Logout</button>
                </div>
            </header>

            <div>
                <form onSubmit={editingID ? (e)=>{e.preventDefault();updateNote(editingID)}:(e)=>handleCreateNotes(e)}>
                    <input type="text" required value={title} onChange={(e)=>{setTitle(e.target.value)}} placeholder="Notes Title"/>
                    <textarea required value={description} onChange={(e)=>{setDescription(e.target.value)} } rows="3" placeholder="Notes Description"/>
                    <div>
                        <button type="submit">{editingID ? "Update":"Add"}</button>
                        {editingID &&
                         <button type="button" onClick={()=>{setEditingID(null);setTitle("");setDescription("")}}>Cancel</button>}
                    </div>
                    
                </form>
            </div>

            <div>
                {notes.length === 0 ? <p>
                    No notes, create notes above.
                </p> : 
                notes.map((note)=>(
                    <div key={note.id}>
                        <div>
                            <h3>{note.title}</h3>
                            {note.description && <p>{note.description}</p>}
                        </div>
                        <div>
                            <button onClick={()=>{
                                startEdit(note)
                            }}>Edit</button>
                            <button onClick={()=>{
                                deleteNote(note.id)
                            }}>Delete</button>
                        </div>
                    </div>
                )) }
            </div>
        </div>
    )
}

export default Notes