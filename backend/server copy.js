import express from "express"
import { mongoConnect } from "./dbConnect.js";
import dotenv from "dotenv"
import { Medication } from "./model/Medication.js";

dotenv.config()


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.post("/medication", async (req, res) => {
    try {
        const newMedication = new Medication(req.body);
        const savedMedication = await newMedication.save();
        res.status(201).json(savedMedication);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error saving medication' });
    }
})

app.put("/medication/:id", async (req, res) => {
    try {
        const medicationId = req.params.id;
        const existingMedication = await Medication.findOne({ id: medicationId });
        if (!existingMedication) {
            return res.status(404).json({ error: "Medication not found" });
        }
        existingMedication.frequency = req.body.frequency
        const updatedMedication = await existingMedication.save();
        res.status(200).json(updatedMedication);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error updating medication" });
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