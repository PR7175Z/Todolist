import React, {useEffect, useState} from 'react'

export default function List() {

    const [apimessage, setmessage] = useState([]);

    //fetching api response
    const apiresponse = async () =>{
        const apiurl = 'http://localhost:3001/api';
        let response = await fetch(apiurl, {method: 'GET', });
        
        const data = await response.json();
        return data;
    }

    useEffect(() => {
        const fetchData = async () => {
            const message = await apiresponse();
            setmessage(message);
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

    let c = {};
    let obj_array = [];

    Array.from(apimessage).forEach((e) => {
        // obj_array.append(e);
        c[e.date] = e;
        console.log(typeof(obj_array));
    })

    return (
        <div>
            {getdate()}
            {apimessage.map((e, index) => {
                return (
                    <li key={index}>{e.title} {e.date} </li>
                )
            })}
        </div>
    )
}
