import React from "react"

export default function Product({ product }) {
    return (
        <div className="product-card">
            <p className="truncate">{product.name}</p>
        </div>
    )
}