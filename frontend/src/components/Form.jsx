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
                const errorText = await response.text();
                console.error('Error response:', errorText);
            }
        } catch (error) {
            console.error('Error posting to the API:', error);
        }
    };

    const updatelist = async (infotitle, status, id)=>{
        const apiurl = `http://localhost:3001/api/${id}`;
        try{
            const response = await fetch(apiurl,{
                method : 'PUT',
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

        grouper();
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
        const title = e.target.innerHTML;
        const status = 'Completed';

        e.target.style.textDecoration = "line-through";

        updatelist(title,status,itemId);
    }
    const grouper = () => {

        document.querySelectorAll('.groupContainer div').forEach((item)=>{
            let type = item.getAttribute('data-date');

            if(!groupData[type]){
                const containerDiv = document.createElement('div');
                containerDiv.className = 'groupContainer list card';
                const headerDiv = document.createElement('h3');
                headerDiv.className = 'heading';
                headerDiv.innerHTML = type;

                containerDiv.appendChild(headerDiv)

                groupData[type] = [containerDiv];
            }
            groupData[type].push(item);
        });

        console.log(groupData)
        for (var key in groupData) {
            groupData[key].forEach(item => { 
                document.querySelector(".todolist").append(item);
            });
        }
    }

    const interval = setInterval(() => {
        const element = document.querySelectorAll('.groupContainer div');
        if(element.length > 0){
            clearInterval(interval);
            grouper();
        }
    })

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