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
    const [activeTab, setActiveTab] = useState('notes')
    const [filteredNotes, setFilteredNotes] = useState([])
    const [archiveFormOpen, setArchiveFormOpen] = useState(false)
    const [favFormOpen, setFavFormOpen] = useState(false)
    const [aiSummary, setAiSummary] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [showAiPanel, setShowAiPanel] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState('');

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

    useEffect(()=>{
        if(!notes){
            setFilteredNotes([])
            return
        }

        let filtered = 0

        if(activeTab==='notes'){
            filtered = notes.filter(note => !note.isArchived)
        }else if(activeTab==='favorites'){
            filtered = notes.filter(note => note.isFavorite && !note.isArchived)
        }else{
            filtered = notes.filter(note => note.isArchived)
        }

        setFilteredNotes(filtered)
        setFavFormOpen(false)
        setArchiveFormOpen(false)
        setEditingID(null)
        setTitle("")
        setDescription("")
    },[notes, activeTab])

    useEffect(()=>{
        setDescription(aiSummary)
    },[aiSummary])

    const handleSummarize = async () => {
        try {
            setAiLoading(true)

            const response = await api.post("/ai/summarize", { title, description })

            if (response.data.status === "success") {
                console.log(response.data.data)
                setAiSummary(response.data.data.summary)
            } else {
                console.error("Bad AI response", response.data)
            }

        } catch (error) {
            console.error(error)
        } finally {
            setAiLoading(false)
        }
    };


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
            setFavFormOpen(false)
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
        const newPin = note.isPinned === true ? false:true
        try{
            await api.put(`/notes/${note.id}`,{is_pinned:newPin,title:"no-title"})
            fetchNotes()
        }catch(err){
            console.error(err)
        }
    }

    const toggleArchive = async (note) =>{
        console.log(note.isArchived)
        const newArchive = note.isArchived === true ? false:true
        try{
            await api.put(`/notes/${note.id}`,{is_archived:newArchive,title:"no-title"})
            fetchNotes()
        }catch(err){
            console.error(err)
        }
    }

    const toggleFavorite = async (note) =>{
        const newFavorite = note.isFavorite=== true ? false:true
        try{
            await api.put(`/notes/${note.id}`,{is_favorite:newFavorite,title:"no-title"})
            fetchNotes()
        }catch(err){
            console.error(err)
        }
    }

    const startEdit = (note)=>{
        if(activeTab==="archives"){
            setArchiveFormOpen(true)
        }
        if(activeTab==="favorites"){
            setFavFormOpen(true)
        }
        setEditingID(note.id)
        setTitle(note.title)
        setDescription(note.description)
    }

    const noteCount = notes.filter(note => !note.isArchived).length
    const favoriteCount = notes.filter(note=> note.isFavorite && !note.isArchived).length
    const archiveCount = notes.filter(note=>note.isArchived).length

    return (
        <div className="notes-container">
            <header className="notes-header">
                <h1>My Notes</h1>
                <div className="user-info">
                    <span>Welcome {user?.username}!</span>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
            </header>

            <div className="tabs-container">
                <button onClick={()=>setActiveTab('notes')} className={`tab ${activeTab==='notes' ? 'active':""}`}>
                    Notes
                    {noteCount > 0 && <span className="tab-count">{noteCount}</span>}
                </button>
                <button onClick={()=>setActiveTab('favorites')} className={`tab ${activeTab==='favorites' ? 'active':""}`}>
                    Favorites
                    {favoriteCount > 0 && <span className="tab-count">{favoriteCount}</span>}
                </button>
                <button onClick={()=>setActiveTab('archives')} className={`tab ${activeTab==='archives' ? 'active':""}`}>
                    Archives
                    {archiveCount > 0 && <span className="tab-count">{archiveCount}</span>}
                </button>
            </div>
            {/*archive tab*/}
            {   
                archiveFormOpen && 
                <div className="notes-form-container">
                        <input name="title" type="text" required value={title} onChange={(e)=>{setTitle(e.target.value)}} placeholder="Title"/>
                        <textarea name="description" value={description} onChange={(e)=>{setDescription(e.target.value)} } rows="7" placeholder="Description"/>
                        
                        <div className="form-buttons">
                            {editingID &&
                            <button className="btn-secondary" type="button" onClick={()=>{
                                setEditingID(null);setTitle("");setDescription("");setArchiveFormOpen(false)
                                }
                            }>Close</button>}
                        </div>
                        
                </div>
            }
            {/*fav tab*/}
            { favFormOpen && <div className="notes-form-container">
                <form onSubmit={editingID ? (e)=>{e.preventDefault();updateNote(editingID)}:(e)=>handleCreateNotes(e)}>
                    <input name="title" type="text" required value={title} onChange={(e)=>{setTitle(e.target.value)}} placeholder="Title"/>
                    <textarea name="description" value={description} onChange={(e)=>{setDescription(e.target.value)} } rows="7" placeholder="Description"/>
                    
                    <div className="form-buttons">
                        <button className="btn-primary" type="submit">{editingID ? "Update":"Add"}</button>
                        {editingID &&
                         <button className="btn-secondary" type="button" onClick={()=>{
                            setEditingID(null);setTitle("");setDescription("");setFavFormOpen(false)
                            }}>Close</button>}
                    </div>
                    
                </form>
            </div>
            }
            {/*note tab*/}
            { activeTab === "notes" && <div className="notes-form-container">
                <form onSubmit={editingID ? (e)=>{e.preventDefault();updateNote(editingID)}:(e)=>handleCreateNotes(e)}>
                    <input name="title" type="text" required value={title} onChange={(e)=>{setTitle(e.target.value)}} placeholder="Title"/>
                    <textarea name="description" value={description} onChange={(e)=>{setDescription(e.target.value)} } rows="7" placeholder="Description"/>
                    
                    <div className="form-buttons">
                        <button className="btn-primary" type="submit">{editingID ? "Update":"Add"}</button>
                        <button className="btn-primary" type="button" onClick={()=>handleSummarize()}>{aiLoading ? "Summarizing":"Summarize"}</button>
                        {editingID &&
                         <button className="btn-secondary" type="button" onClick={()=>{setEditingID(null);setTitle("");setDescription("")}}>Close</button>}
                    </div>
                    
                </form>
            </div>
            }

            

            <div className="notes-list">
                {filteredNotes.length === 0 ? <p>
                    {activeTab==='notes' && "No notes yet, create one above."}
                    {activeTab==='favorites' && "No favorites yet, pick from one of your notes."}
                    {activeTab==='archives' && "No archives yet."}
                </p> : 
                filteredNotes.map((note)=>(
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
                        <div className="note-actions-parent">
                            <div className="note-actions">
                                <button className="version-display">v{note.version}</button>
                                <button className="btn-edit" onClick={()=>{
                                    startEdit(note)
                                }}>Open</button>
                                
                                <button className="btn-edit" onClick={()=>{
                                    togglePin(note)
                                }}>{
                                    note.isPinned === false ? <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z"/></svg>:
                                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M680-840v80h-40v327l-80-80v-247H400v87l-87-87-33-33v-47h400ZM480-40l-40-40v-240H240v-80l80-80v-46L56-792l56-56 736 736-58 56-264-264h-6v240l-40 40ZM354-400h92l-44-44-2-2-46 46Zm126-193Zm-78 149Z"/></svg>
                                }</button>

                                {activeTab !== 'archives' &&<button className="btn-edit"
                                    onClick={()=>toggleFavorite(note)}>
                                    {note.isFavorite === false ? <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                                    :<svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M481-83Q347-218 267.5-301t-121-138q-41.5-55-54-94T80-620q0-92 64-156t156-64q45 0 87 16.5t75 47.5l-62 216h120l-34 335 114-375H480l71-212q25-14 52.5-21t56.5-7q92 0 156 64t64 156q0 48-13 88t-55 95.5q-42 55.5-121 138T481-83Zm-71-186 21-211H294l75-263q-16-8-33.5-12.5T300-760q-58 0-99 41t-41 99q0 31 11.5 62t40 70.5q28.5 39.5 77 92T410-269Zm188-48q111-113 156.5-180T800-620q0-58-41-99t-99-41q-11 0-22 1.5t-22 5.5l-24 73h116L598-317Zm110-363ZM294-480Z"/></svg>}
                                </button>}

                                <button className="btn-edit" onClick={()=>{
                                    toggleArchive(note)
                                }}>
                                    {note.isArchived=== false ? <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="m480-240 160-160-56-56-64 64v-168h-80v168l-64-64-56 56 160 160ZM200-640v440h560v-440H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm264 300Z"/></svg>
                                    :<svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M480-560 320-400l56 56 64-64v168h80v-168l64 64 56-56-160-160Zm-280-80v440h560v-440H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm264 300Z"/></svg>}
                                </button>
                                
                                <button className="btn-delete" onClick={()=>{
                                    deleteNote(note.id)
                                }}>Delete</button>
                            </div>
                            <div className="dates-div">
                                <div className="note-actions-date">
                                    <p className="date-item">
                                    Last Update: {new Date(note.updatedAt).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                                <p className="date-item">
                                    Created at: {new Date(note.createdAt).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                )) }
            </div>
        </div>
    )
}

export default Notes