import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export function FoodCard() {
    return (
        <div
            className="card border-0 text-center"
        >
            <img
                src="https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg"

                style={{
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "50%",
                }}
            />

        </div>
    );


};


