import React from "react"
import Product from "./Product"
import productsData from "./data"

export default function ProductsList() {
    return productsData.map(product => (
        <Product key={product.id} product={product} />
    ))
}