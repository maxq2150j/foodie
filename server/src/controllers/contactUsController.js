import { getConnectionObject } from "../configs/DbConfig.js";


export async function addQuery(request, response){
    try {
        const connection = getConnectionObject();
    const { name, email, phone, description } = request.body;
    // include email column and quote phone to avoid SQL errors when phone is a string
    const qry = `INSERT INTO contact_us(name, email, phone, description) VALUES('${name}','${email}','${phone}','${description}')`;
        const [resultSet] = await connection.query(qry);
        if(resultSet.affectedRows === 1){
            response.status(200).send({message:' Your message has been received! We will contact you soon.'});
        }
        else{
            response.status(500).send({message:'Unable to submit your message at this time. Please try again later.'});
        }
    } catch (error) {
        console.log(error);
        response.status(500).send({message:'Something went wrong'});
    }
}


export async function getAllQuery(request, response){
    try {
        const connection = getConnectionObject();
        const qry = `SELECT * FROM contact_us`;
        const [rows] = await connection.query(qry);
        response.status(200).send(rows);
    } catch (error) {
        console.log(error);
        response.status(500).send({message:'Something went wrong'});
    }
}



export async function deleteQueryById(request, response) {
    try {
        const connection = getConnectionObject();
        const { id } = request.params;

        const qry = `DELETE FROM contact_us WHERE id = ?`;
        const [result] = await connection.query(qry, [id]);

        if (result.affectedRows === 0) {
            return response.status(404).send({ message: "No record found with this ID" });
        }

        response.status(200).send({ message: "Query deleted successfully!" });
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: "Something went wrong while deleting" });
    }
}