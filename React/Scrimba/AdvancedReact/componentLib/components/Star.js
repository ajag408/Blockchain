import React from "react"
import { BsStar, BsStarFill } from "react-icons/bs"
import useToggle from "../../hooks/useToggle"

export default function Star({ onChange }) {
    const [on, toggle] = useToggle()
    return (
        <>
            {
                on ?
                    <BsStarFill onClick={toggle} className="star filled" /> :
                    <BsStar onClick={toggle} className="star" />
            }
        </>
    )
}