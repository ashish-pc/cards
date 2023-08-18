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

app.post("/medlogs", async (req, res) => {
    const { _id, logs } = req.body;
    const newMedData = new Medication({ _id, logs });
    const savedMedData = await newMedData.save();
    res.status(201).json({
        Inserted: "OK",
        InsertedDocId: savedMedData._id
    });
})
app.get("/medlogs/:document_id", async (req, res) => {
    try {
        const { document_id: userId } = req.params;
        const _mongoDoc = await Medication.findById(userId)
        res.status(200).send(_mongoDoc);
    } catch (error) {
        res.status(500).json({ error });
    }
})
app.put("/medlogs/:document_id", async (req, res) => {
    try {
        const { document_id: userId } = req.params;
        const _mongoDoc = await Medication.findById(userId);
        const { ObjectId, frequencyIndex } = req.body;
        const medIndex = _mongoDoc.logs.findIndex((m) => m.med_id === ObjectId);
        const frequencyToUpdate = _mongoDoc.logs[medIndex].frequency.find(d => d.id === frequencyIndex);

        if (frequencyToUpdate) {
            frequencyToUpdate.state = frequencyToUpdate.state === "active" ? "inactive" : "active";
            _mongoDoc.markModified('logs');
            await _mongoDoc.save();
            res.status(200).send({ "Updated": "OK" });
        } else {
            res.status(404).json({ "error": "Frequency not found" });
        }
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// app.put('/medlogs/update/:document_id', async(req, res) => {
//     try{
//         console.log(req.body)
//     }catch(err){
//         console.log(err)
//     }
// })


const start = async () => {
    mongoConnect()
        .then(() => {
            app.listen(process.env.PORT, () => {
                console.log(`http://localhost:${process.env.PORT}`);
            });
        })
};

start();