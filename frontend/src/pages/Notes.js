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
            setNotes(res.data.data.notes)
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
        }catch(error){
            console.error(error)
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

    const togglePin = async (note) =>{
        const newPin = note.is_pinned === 1 ? 0:1
        try{
            await api.put(`/notes/${note.id}`,{is_pinned:newPin,title:"no-title"})
            fetchNotes()
        }catch(err){
            console.error(err)
        }
    }

    const startEdit = (note)=>{
        setEditingID(note.id)
        setTitle(note.title)
        setDescription(note.description)
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
                    <input name="title" type="text" required value={title} onChange={(e)=>{setTitle(e.target.value)}} placeholder="Title"/>
                    <textarea name="description" value={description} onChange={(e)=>{setDescription(e.target.value)} } rows="7" placeholder="Description"/>
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
                            <h3>{
                            note.title.length > 20 ? 
                            note.title.slice(0,20)+"...":
                            note.title
                            }</h3>
                            {note.description && <p>{
                            note.description.length > 50 ? 
                            note.description.slice(0,50)+"...":
                            note.description
                            }</p>}
                        </div>
                        <div className="note-actions">
                            <button>v{note.version}</button>
                            <button className="btn-edit" onClick={()=>{
                                startEdit(note)
                            }}>Open</button>
                            
                            <button className="btn-edit" onClick={()=>{
                                togglePin(note)
                            }}>{
                                note.is_pinned === 0 ? <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z"/></svg>:
                                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M680-840v80h-40v327l-80-80v-247H400v87l-87-87-33-33v-47h400ZM480-40l-40-40v-240H240v-80l80-80v-46L56-792l56-56 736 736-58 56-264-264h-6v240l-40 40ZM354-400h92l-44-44-2-2-46 46Zm126-193Zm-78 149Z"/></svg>
                            }</button>
                            {/* <button className="btn-edit"><svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="m480-240 160-160-56-56-64 64v-168h-80v168l-64-64-56 56 160 160ZM200-640v440h560v-440H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm264 300Z"/></svg></button> */}
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