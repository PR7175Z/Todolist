import React, {useState, useEffect} from 'react'

export default function Form() {
    const [items, setItems] = useState([]);
    const [postData, setPostData] = useState(null);
    const [responseMessage, setResponseMessage] = useState([]);

    const apiurl = 'http://localhost:3001/api';

    const getapicaller = async () => {
        try {
            const response = await fetch(apiurl, { method: 'GET' });

            if (response.ok) {
                const result = await response.json();
                setResponseMessage(result);
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
            }
        } catch (error) {
            console.error('Error posting to the API:', error);
        }
    };

    const updatelist = async (id)=>{
        const apiurl = `http://localhost:3001/api/${id}`;
        try{
            const response = await fetch(apiurl,{
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title : infotitle, status: status}),
            }) 
        } catch (error){
            console.error('Error updating item:', error);
        }
    }

    useEffect(() => {
        getapicaller();
    }, []);

    useEffect(() => {
        if (postData) {
            apicaller(postData, 'Not Done');
        }
    }, [postData]);


    // Function to make the POST request
    const apicaller = async (infotitle, status = 'Not done') => {
        try {
            let response = await fetch(apiurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title : infotitle, status: status}),
            });

            if (response.ok) {
                await getapicaller();
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
            }
        } catch (error) {
            console.error('Error posting to the API:', error);
        }
    };

    function handleSubmit(e){
        e.preventDefault();
        const title = e.target.querySelector('input[name="todotitle"]').value;
        setItems(prevItems => [...prevItems, title]);
        setPostData(title);
    }

    function todolistclick(e){
        const itemId = e.target.getAttribute('id');

        e.target.style.textDecoration = "line-through";

        console.log(e.target.getAttribute('id'))
    }

    return (
        <>
            <div className="form-wrapper">
                <form id="todoform" onSubmit={handleSubmit} method="post">
                    <input type="text" name="todotitle" placeholder="Type here..."/>
                    <button className="submitbtn" type="submit">Submit</button>
                </form>
            </div>
            <div className="todolist">
                <ul>
                    {responseMessage?.map(item => {
                        const date = new Date(item.date).toISOString().split('T')[0];
                        return(
                            <li id={item.id} key={item.id} data-date={date} onClick={todolistclick}>{item.title}</li>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}