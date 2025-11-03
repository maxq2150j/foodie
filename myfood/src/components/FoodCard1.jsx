import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export function FoodCard1() {
    return (
        <div className="card border-1" style={{ width: "18rem" }}>
            <img
                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_366/RX_THUMBNAIL/IMAGES/VENDOR/2024/6/26/d112a6d7-d173-4ca7-a5ee-40f845719d18_841144.JPG"
                className="card-img-top"
                alt="Restaurant"
                style={{ height: "200px", objectFit: "cover" }}
            />

            <div className="card-body">
                <h5 className="card-title fw-bold mb-1">Margherita Pizza</h5>
                <p className="text-muted small mb-1">Classic cheese pizza</p>
                <p className="text-muted small mb-1">299</p>
                <button className="btn btn-sm btn-outline-danger rounded-pill px-3">
                    Add to Cart
                </button>


            </div>
        </div>
    );

};

