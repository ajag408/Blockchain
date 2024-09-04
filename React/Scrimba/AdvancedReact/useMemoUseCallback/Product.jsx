import React from "react"
import { sleep } from "./utils"

function Product({ product, style, chooseProduct }) {
    sleep(1)
    return (
        <div 
            className="product-card"
            style={style}
            onClick={() => chooseProduct(product.id)}
        >
            <p className="truncate">{product.name}</p>
        </div>
    )
}

export default React.memo(Product)