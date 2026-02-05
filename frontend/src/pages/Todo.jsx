import React, { useEffect, useState } from 'react'
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



function Todo({ searchTerm ="" }) {
    const [todo, setTodo] = useState("");
    const [allTodo, setallTodo] = useState([]);
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL;
    const token =localStorage.getItem("token");

    useEffect(() => {
            
            if(!token){
                navigate('/login');
            }else{
                fetchTodos();
            }
    }, [navigate])

    const submitHandler = async () => {
        if (todo.trim() === "") {
            toast.warn("Empty Input")
            return
        }

        const date = new Date();
        const timeStamp = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

        const newTodo = { text: todo, time: timeStamp };

        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
             },
            body: JSON.stringify(newTodo)
        })

        const saveTodo = await response.json();

        setallTodo([...allTodo, saveTodo]);

        setTodo("");
        toast.success("Todo added successfully")
    }

    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            if (response.ok) {
                const updateTodos = allTodo.filter((item) => item.id !== id);
                setallTodo(updateTodos)
                toast.success("Deleted Successfuly")
            } else {
                console.log("Failed to delete from database");

            }
        } catch (err) {
            console.error("Network error:", err.message);

        }
    }

    const filteredTodos = Array.isArray(allTodo) ? allTodo.filter((item) =>
        item.text?.toLowerCase().includes(searchTerm.toLowerCase())
    ):[];

    const fetchTodos = async () => {
        try{
        const response = await fetch(`${API_URL}/todos`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json();
        if (response.ok){
            setallTodo(Array.isArray(data) ? data : []);
        }else{
            toast.error(data.message || "Failed to fetch todos")
            if (response.status === 403) navigate('/login')
        }
        }catch (err){
            setallTodo([])
            toast.error("Network error")
        }
    }

    return (
        <div>
            <div className='flex flex-col justify-center items-center py-7 border mt-2 mx-auto w-1/2'>
                <h1 className='mb-2 text-2xl '>Todo App</h1>
                <div className='flex gap-1 mb-2 items-center'>
                    <h1 className=''>Add Todo</h1>
                    <input type="text" placeholder='Write todo here' className='border p-2' value={todo} onChange={(e) => setTodo(e.target.value)} />
                    <button className='bg-amber-300 p-3 rounded-2xl cursor-pointer' onClick={submitHandler}>Add</button>
                </div>



            </div>
            <div className='flex flex-col w-full px-10 mt-5 justify-center items-center'>
                <h1 className='mb-2 text-2xl '>Todos</h1>
                <ul className='list-decimal'>
                    {filteredTodos.map((item) => (
                        <li key={item.id} className='bg-gray-100 p-2 mb-2 rounded-border flex items-center gap-2'>
                            <span className="text-lg font-medium text-gray-900">{item.text}</span>
                            <span className="text-xs text-gray-400 font-light">{item.time}</span>
                            <button className='cursor-pointer' onClick={() => deleteTodo(item.id)}><MdDelete size={20} /></button>

                        </li>
                    ))}

                    {searchTerm && filteredTodos.length === 0 && (
                        <p className="text-gray-400 mt-4">No results found for "{searchTerm}"</p>
                    )}

                </ul>

            </div>
        </div>

    )
}


export default Todo