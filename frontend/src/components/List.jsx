import React, {useEffect, useState} from 'react'

export default function List() {

    const [apimessage, setmessage] = useState('');

    const apiresponse = async () =>{
        const apiurl = 'http://localhost:3001/api';
        let response = await fetch(
            apiurl,
            {
                method: 'GET',
            }
        );
        
        const data = await response.json();
        console.log(data);
        return {data};
    }

    useEffect(() => {
        const fetchData = async () => {
            const message = await apiresponse();
            setmessage(message.title);
        };
        fetchData();
    }, []);


    function getdate(){
        const date= new Date();
        const month = date.getMonth()+1;
        const day = date.getDay()+1;
        const year = date.getFullYear();
        return `${month} ${day} ${year}`;
    }

    return (
        <div>
            {getdate()}
            {apimessage}
        </div>
    )
}
