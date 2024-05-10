import React from "react"

export default function Card(props) {
    
    return (
        <div>

            <img 
                src={props.imageUrl} 
            />
            <p>{props.location}</p>
            <a href = {props.googleMapsUrl}>View on Google Maps</a>
            <h1>{props.title}</h1>
            <h3>{props.startDate} - {props.endDate}</h3>
            <p>{props.description}</p>
        </div>
    )
}