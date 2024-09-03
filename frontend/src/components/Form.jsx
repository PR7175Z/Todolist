import React, {useState} from 'react'

export default function Form() {
    const [postData, setPostData] = useState();

    const [responseMessage, setResponseMessage] = useState('');

    // Function to make the POST request
    const apicaller = async (postData) => {
        const apiurl = 'http://localhost:3001/api';
        try {
            let response = await fetch(apiurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title : postData}),
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

        apicaller(postData);
    }

    return (
        <>
            <div className="form-wrapper">
                <form id="todoform" onSubmit={handleSubmit} method="post">
                    <input type="text" name="todotitle" placeholder="Type here..."/>
                    <button className="submitbtn" type="submit">Submit</button>
                </form>
            </div>
            <p>API Response: {responseMessage}</p>
        </>
    )
}
