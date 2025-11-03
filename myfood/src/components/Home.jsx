import { Alert, Col, Container, Row } from "react-bootstrap";
import { FoodCard } from "./FoodCard";
import { FoodCard1 } from "./FoodCard1";

export function Home() {
    return (
        <Container className="mt-5">
            <Col>
                <Row >
                    <Col>
                        <FoodCard />
                    </Col>
                    <Col>
                        <FoodCard />
                    </Col>
                    <Col>
                        <FoodCard />
                    </Col>
                    <Col>
                        <FoodCard />
                    </Col>
                    <Col>
                        <FoodCard />
                    </Col>
                    <Col>
                        <FoodCard />
                    </Col>
                </Row>

                <hr className="border-2 border-dark my-4" />
                <Row className="g-4 mb-6" style={{ paddingLeft: "100px", paddingRight: "30px" }}>
                    <Col lg={4} md={6} sm={12}>
                        <FoodCard1 />
                    </Col>
                    <Col lg={4} md={6} sm={12}>
                        <FoodCard1 />
                    </Col>
                    <Col lg={4} md={6} sm={12}>
                        <FoodCard1 />
                    </Col>
                </Row>



            </Col>
        </Container>
    )
}