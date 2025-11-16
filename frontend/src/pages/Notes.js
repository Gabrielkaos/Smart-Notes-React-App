import api from "../api/Axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Notes.css"
import "./Login.css"


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
        <div className="notes-container">
            <header className="notes-header">
                <h1>My Notes</h1>
                <div className="user-info">
                    <span>Welcome {user?.username}!</span>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
            </header>

            <div className="notes-form-container">
                <form onSubmit={editingID ? (e)=>{e.preventDefault();updateNote(editingID)}:(e)=>handleCreateNotes(e)}>
                    <input type="text" required value={title} onChange={(e)=>{setTitle(e.target.value)}} placeholder="Title"/>
                    <textarea required value={description} onChange={(e)=>{setDescription(e.target.value)} } rows="3" placeholder="Description"/>
                    <div className="form-buttons">
                        <button className="btn-primary" type="submit">{editingID ? "Update":"Add"}</button>
                        {editingID &&
                         <button className="btn-secondary" type="button" onClick={()=>{setEditingID(null);setTitle("");setDescription("")}}>Cancel</button>}
                    </div>
                    
                </form>
            </div>

            <div className="notes-list">
                {notes.length === 0 ? <p>
                    No notes, create notes above.
                </p> : 
                notes.map((note)=>(
                    <div key={note.id} className="notes-card">
                        <div className="note-content">
                            <h3>{note.title}</h3>
                            {note.description && <p>{note.description}</p>}
                        </div>
                        <div className="note-actions">
                            <button className="btn-edit" onClick={()=>{
                                startEdit(note)
                            }}>Edit</button>
                            <button className="btn-delete" onClick={()=>{
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