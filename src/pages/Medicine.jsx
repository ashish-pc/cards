import React, { useCallback, useContext, useEffect, useReducer } from 'react'
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



const reducer = (state, { type, payload }) => {
    switch (type) {
        case "MONGO_FETCH_REQUEST":
            return { ...state, loading: true, error: null };
        case "MONGO_FETCH_SUCCESS":
            return { ...state, loading: false, fArray: payload };
        case "MONGO_FETCH_FAILURE":
            return { ...state, loading: false, error: payload };
        case "ACTIVATE_SLOT":
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
            return { ...state, fArray: updatedFArray };
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

    const updateMedDataFunc = async (objectIndex, newArray) => {
        try {
            await axios.post(`http://localhost:4000/medication/${USER_ID}/${objectIndex}`, newArray)
        } catch (e) {
            console.log(e)
        }
    }
    const [slotState, slotDispatcher] = useReducer((state, { type, payload }) => {
        switch (type) {
            case "MONGO_FETCH_REQUEST":
                return { ...state, loading: true, error: null };
            case "MONGO_FETCH_SUCCESS":
                return { ...state, loading: false, fArray: payload };
            case "MONGO_FETCH_FAILURE":
                return { ...state, loading: false, error: payload };
            case "ACTIVATE_SLOT":
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
                updateMedDataFunc(objectIndex, updatedFArray);
                return {...state, fArray: updatedFArray}
            // slotDispatcher({ type: "SLOT_UPDATED" })
            // return { ...state, fArray: updatedFArray };
            default:
                return state
        }

    }, {
        fArray: []
    })

    const postMedDataCallback = useCallback(async () => {
        // dumping data to mongodb from payload ( getting from react-query)
        // react-query is getting data from json data
        await axios.get(`http://localhost:4000/medication/${USER_ID}`).then(res => {

            if (res.data._id !== USER_ID) {
                axios.post('http://localhost:4000/medication', {
                    _id: "ashish",
                    medData: frequencyArray
                })
                    .then(response => {
                        console.log(response.data)
                    })
                    .catch(error => {
                        console.log(error)
                    });
            }
        })
    }, [])

    useEffect(() => {
        postMedDataCallback();
    }, []);


    useEffect(() => {
        // getting data from mongodb to store react state
        const fetchMedData = async () => {
            try {
                slotDispatcher({ type: "MONGO_FETCH_REQUEST" });
                const res = await axios.get(`http://localhost:4000/medication/${USER_ID}`)
                slotDispatcher({
                    type: "MONGO_FETCH_SUCCESS", payload: res.data.medData

                })
            } catch (err) {
                slotDispatcher({
                    type: "MONGO_FETCH_FAILURE", payload: err
                })
            }
        }
        fetchMedData()
    }, [postMedDataCallback])

    const { loading, error, fArray } = slotState

    if (loading && error !== null) {
        return <div>Loading...</div>;
    }
    console.log(fArray)

    const ths = (
        <tr>
            <th>Medicine Name</th>
            <th>Slots</th>
        </tr>
    );

    const rows = fArray.map((data) => {
        const frequency = data.frequency

        return (
            <tr key={data.id}>
                <td>{data.med}</td>
                <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        {frequency.map(d => {
                            return <div onClick={() => {
                                slotDispatcher({
                                    type: "ACTIVATE_SLOT", payload: {
                                        objectIndex: data.id,
                                        frequencyIndex: d.id
                                    }
                                })
                            }
                            } style={{ width: "20px", height: "20px", backgroundColor: d.state === "active" ? "red" : "gray" }} key={d.id}></div>
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