import express from "express"
import { mongoConnect } from "./dbConnect.js";
import dotenv from "dotenv"
import { Medication } from "./model/Medication.js";
import cors from "cors";

dotenv.config()


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}));


app.post("/medication", async (req, res) => {
    try {
        const { _id, medData } = req.body;
        console.log(medData)
        const newMedData = new Medication({ _id, medData });
        const savedMedData = await newMedData.save();

        res.status(201).json({
            Inserted: "OK",
            InsertedDocId: savedMedData._id
        });

    } catch (error) {
        res.status(500).json({ error });
    }
})

// here id refers to the mongo's document id
app.get("/medication/:document_id", async (req, res) => {
    try {
        const { document_id } = req.params;
        const _mongoDoc = await Medication.findById(document_id)
        res.status(200).send(_mongoDoc);
    } catch (error) {
        res.status(500).json({ error });
    }
})

// document_id => mongo document oid which is generted by mongo when we post object to /medication
// id => which object id's frequency that need to be updated


app.post("/medication/:document_id/:id", async (req, res) => {
    const { document_id, id } = req.params
    // console.log(document_id, id)
    const medData = req.body
    const _mongoDoc = await Medication.findById(document_id)

    const medIndex = _mongoDoc.medData.findIndex((m) => m.id === id)
    // console.log(medData[medIndex].frequency)
    if (medData[medIndex].frequency) {
        // here we are grabbing the document's frequency based on index 
        // and updating the frequency based on req.body in body response 
        _mongoDoc.medData[medIndex].frequency = medData[medIndex].frequency.map(d => d)
        await _mongoDoc.save();
        res.status(200).json({ message: "Updated successful" });
    } else {
        res.status(400).json({ error: "Not updated" });
    }
});



const start = async () => {
    mongoConnect()
        .then(() => {
            app.listen(process.env.PORT, () => {
                console.log(`http://localhost:${process.env.PORT}`);
            });
        })
};

start();