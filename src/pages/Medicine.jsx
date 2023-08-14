import React, { useContext, useEffect, useReducer } from 'react'
import { MedContext } from '../context/MedicineProvider'
import { Center, Paper, Table, createStyles } from '@mantine/core';
import axios from 'axios';


const useStyle = createStyles((theme) => ({
}))


const USER_ID = "ashish"


const Medicine = () => {
    const [{ status, payload }, dispatch] = useContext(MedContext)
    return (
        <>
            {status === "loading" && <>Loding...</>}
            {status === "error" && <>Error...</>}
            {status === "ready" && <MedCard payload={payload} />}
        </>
    )
}



const reducer = async (state, { type, payload }) => {
    switch (type) {
        case "inactive":
            return { ...state, status: "inactive" }
        case "pending":
            return { ...state, status: "pending" }
        case "activateSlot":
            const { objectIndex, frequencyIndex } = payload
            const updatedFArray = state.fArray.map(data => {
                if (data.id === objectIndex) {
                    const updatedFrequency = data.frequency.map(item => {
                        if (item.id === frequencyIndex) {
                            return { ...item, state: item.state === "inactive" ? "active" : "inactive" };
                        }
                        return item;
                    });
                    return { ...data, frequency: updatedFrequency };
                }
                return data;
            });
            const newState = { ...state, fArray: updatedFArray }
            try{
                await axios.post(`http://localhost:4000/medication/${USER_ID}/${objectIndex}`, newState.fArray)
            }catch (e){
                console.log(e)
            }

            console.log({ ...state, fArray: updatedFArray })
            return newState;
        default:
            throw new Error("Unknown state!")
    }

}



const MedCard = ({ payload }) => {

    const frequencyArray = payload.map(data => {
        const frequency = data.dosageInstructions.frequency;
        const inActiveStateWithId = (count) => Array.from({ length: count }, (_, id) => ({ id, state: "inactive" }))
        data["frequency"] = inActiveStateWithId(frequency);
        return data
    })

    const [slotState, slotDispatcher] = useReducer(reducer, {
        status: "ready",
        fArray: frequencyArray
    })


    useEffect(() => {
        console.log("called me ")

        axios.get(`http://localhost:4000/medication/${USER_ID}`).then(res => {

            if (res.data._id !== USER_ID) {
                axios.post('http://localhost:4000/medication', {
                    _id: "ashish",
                    medData: slotState.fArray
                })
                    .then(response => {
                        console.log(response.data)
                    })
                    .catch(error => {
                        console.log(error)
                    });
            }
        })
    }, []);


    const ths = (
        <tr>
            <th>Medicine Name</th>
            <th>Slots</th>
        </tr>
    );
    console.log(slotState)

    const rows = slotState.fArray.map((data) => {
        const frequency = data.frequency

        return (
            <tr key={data.id}>
                <td>{data.med}</td>
                <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        {frequency.map(d => {
                            return <div onClick={() => {
                                slotDispatcher({
                                    type: "activateSlot", payload: {
                                        objectIndex: data.id,
                                        frequencyIndex: d.id
                                    }
                                })
                            }} style={{ width: "20px", height: "20px", backgroundColor: d.state === "active" ? "red" : "gray" }} key={d.id}></div>
                        })}
                    </div>
                </td>
            </tr>
        )
    });
    return (
        <Paper>
            <Center>
                <Table captionSide="bottom" horizontalSpacing="sm" verticalSpacing="lg" maw={800} >
                    <caption>MEDICINES</caption>
                    <thead>{ths}</thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Center>
        </Paper>
    )
}

export default Medicine