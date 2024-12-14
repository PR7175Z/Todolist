import React, {useState, useEffect} from 'react'

let groupData = {};

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
                console.error('Error response:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching from API:', error);
        }
    };

    const updatelist = async (infotitle, status, id) => {
        const apiurl = `http://localhost:3001/api/${id}`;
        try {
            await fetch(apiurl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: infotitle, status }),
            });
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const apicaller = async (infotitle, status = 'Not Done') => {
        try {
            const response = await fetch(apiurl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: infotitle, status }),
            });
            if (response.ok) {
                await getapicaller();
            } else {
                console.error('Error response:', await response.text());
            }
        } catch (error) {
            console.error('Error posting to the API:', error);
        }
    };

    const grouper = () => {
        groupData = {};

        document.querySelectorAll('.groupContainer div').forEach((item) => {
            let type = item.getAttribute('data-date');
            if (!groupData[type]) {
                const headerDiv = document.createElement('h3');
                headerDiv.className = 'heading';
                headerDiv.innerHTML = type;
                groupData[type] = [headerDiv];
            }
            groupData[type].push(item);
        });

        const sortedKeys = [...new Set(Object.keys(groupData))].sort((a, b) => new Date(b) - new Date(a));

        const todoList = document.querySelector(".todolist");
        todoList.innerHTML = '';

        sortedKeys.forEach(key => {
            const emptySubContainer = document.createElement('div');
            emptySubContainer.className = 'groupContainer list card';
            groupData[key].forEach(item => {
                emptySubContainer.append(item);
            });
            todoList.append(emptySubContainer);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const title = e.target.querySelector('input[name="todotitle"]').value;
        setItems((prevItems) => [...prevItems, title]);
        setPostData(title);
    };

    const todolistclick = (e) => {
        const itemId = e.target.getAttribute('id');
        const title = e.target.innerHTML;
        const status = 'Completed';
        e.target.style.textDecoration = "line-through";
        updatelist(title, status, itemId);
    };

    useEffect(() => {
        getapicaller();
    }, []);

    useEffect(() => {
        if (responseMessage.length > 0) {
            grouper();
        }
    }, [responseMessage]);

    return (
        <>
            <div className="form-wrapper">
                <form id="todoform" onSubmit={handleSubmit} method="post">
                    <input type="text" name="todotitle" placeholder="Type here..."/>
                    <button className="submitbtn" type="submit">Submit</button>
                </form>
            </div>
            <div className="todolist">
                <div className="groupContainer">
                    {responseMessage?.map(item => {
                        const date = new Date(item.date).toISOString().split('T')[0];
                        const status = item.status.toLowerCase().split(' ').join('-');
                        return(
                            <div id={item.id} className="targetpoint" data-status={status} key={item.id} data-date={date} onClick={todolistclick}>{item.title}</div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}