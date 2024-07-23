import React from "react"
import { MenuContext } from "./Menu"

export default function MenuDropdown({ children }) {
    const { open } = React.useContext(MenuContext)

    return (
        <>
            {open ? (
                <div className="menu-dropdown">
                    {children}
                </div>
            ) : null
            }
        </>
    )
}