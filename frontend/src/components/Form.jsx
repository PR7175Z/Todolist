import React, {useState} from 'react'

export default function Form() {
    const [postData, setPostData] = useState();

    const [responseMessage, setResponseMessage] = useState('');

    function getdate(){
        const date= new Date();
        const month = date.getMonth()+1;
        const day = date.getDay()+1;
        const year = date.getFullYear();
        return `${month} ${day} ${year}`;
    }

    // Function to make the POST request
    const apicaller = async (infotitle, currentdate) => {
        const apiurl = 'http://localhost:3001/api';
        try {
            let response = await fetch(apiurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title : infotitle, date: currentdate}),
            });

            if (response.ok) {
                const result = await response.json();
                setResponseMessage(result.message);
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                setResponseMessage('Failed to post data');
            }
        } catch (error) {
            console.error('Error posting to the API:', error);
            setResponseMessage('Error posting data');
        }
    };

    function handleSubmit(e){
        e.preventDefault();
        const title = e.target.querySelector('input[name="todotitle"]').value;
        setPostData(title);
        apicaller(postData, getdate());
    }

    function handleOnChange(e){
        const title = e.target.value;
        setPostData(title);
    }

    return (
        <>
            <div className="form-wrapper">
                <form id="todoform" onSubmit={handleSubmit} method="post">
                    <input type="text" onChange={handleOnChange} name="todotitle" placeholder="Type here..."/>
                    <button className="submitbtn" type="submit">Submit</button>
                </form>
            </div>
            <p>API Response: {responseMessage}</p>
        </>
    )
}
