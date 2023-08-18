import React, { useContext, useEffect, useReducer } from 'react'
import { MedContext } from '../context/MedicineProvider'
import { Center, Paper, Table } from '@mantine/core';
import axios from 'axios';


const USER_ID = "ashish"

const Medicine = () => {
    const [{ status, payload }, dispatch, refetch] = useContext(MedContext)
    return (
        <>
            {status === "loading" && <>Loding...</>}
            {status === "error" && <>Error...</>}
            {status === "ready" && <MedCard payload={payload} refetch={refetch} />}
        </>
    )
}


const updateMedLogsData = async (payload) => {
    await axios.put(`http://localhost:4000/medlogs/${USER_ID}`, payload).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'fetch_init':
            return { ...state, isLoading: true }
        case 'fetch_success':
            return { ...state, isLoading: false, logs: action.payload }
        case 'error':
            return { ...state, isLoading: false, error: action.payload, upload: false }
        case 'post_init':
            return { ...state }
        case 'post_success':
            return { ...state, upload: action.payload }
        case 'mixing':
            const { medData, logs } = action.payload;
            const mixData = medData.map((data, index) => {
                data["frequency"] = logs[index].frequency;
                return data;
            });
            return { ...state, medData: mixData };
        default:
            return state
    }
}
const generateLogs = (payload) => {
    return payload.map(data => {
        const frequency = data.dosageInstructions.frequency;
        const fArray = Array.from({ length: frequency }, (_, id) => ({ id, state: 'inactive' }))
        const { id: med_id } = data
        return {
            med_id,
            frequency: fArray,
            date: new Date()
        }
    });
};

const fetchData = async (dispatch) => {
    dispatch({ type: 'fetch_init' })
    try {
        const response = await axios.get(`http://localhost:4000/medlogs/${USER_ID}`)
        dispatch({ type: 'fetch_success', payload: response.data })
    } catch (err) {
        dispatch({ type: 'error', payload: err.message })
    }
}

const postData = async (dispatch, payload) => {
    dispatch({ type: 'post_init' })
    const logsWithStateId = generateLogs(payload)
    try {
        await axios.post(`http://localhost:4000/medlogs`, {
            _id: USER_ID,
            logs: logsWithStateId
        })
        dispatch({ type: 'post_success', payload: true })
    } catch (err) {
        dispatch({ type: 'error', payload: err.message })
    }
}

const ths = (
    <tr>
        <th>Medicine Name</th>
        <th>Slots</th>
    </tr>
);


const MedCard = ({ payload, refetch }) => {

    const [state, dispatchEvents] = useReducer(reducer, {
        logs: null,
        isLoading: true,
        error: null,
        upload: false,
        medData: null,
        payload: null
    })


    useEffect(() => {
        const runLogic = async () => {
            await axios.get(`http://localhost:4000/medlogs/${USER_ID}`).then(res => {
                if (res.data._id !== USER_ID) {
                    postData(dispatchEvents, payload)
                }
                fetchData(dispatchEvents)
                dispatchEvents({ type: 'mixing', payload: { logs: res.data.logs, medData: payload } })
            })
        }
        runLogic()
    }, [fetchData])

    return (
        <div>
            {state.isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {state.logs && (
                        <div>
                            <Paper>
                                <Center>
                                    <Table captionSide="bottom" horizontalSpacing="sm" verticalSpacing="lg" maw={800}>
                                        <thead>{ths}</thead>
                                        <tbody>
                                            {
                                                state.medData.map(data => {
                                                    return (
                                                        <tr key={data.id}>
                                                            <td>{data.med} </td>
                                                            <td style={{ display: "flex", gap: "0.5rem" }} >
                                                                {data.frequency.map(d => {
                                                                    return <div

                                                                        style={{
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            backgroundColor: d.state === "active" ? "red" : "gray"
                                                                        }}
                                                                        onClick={async () => {
                                                                            await updateMedLogsData(
                                                                                {
                                                                                    ObjectId: data.id,
                                                                                    frequencyIndex: d.id
                                                                                }
                                                                            )
                                                                            await axios.get(`http://localhost:4000/medlogs/${USER_ID}`).then(res => {
                                                                                dispatchEvents({ type: 'mixing', payload: { logs: res.data.logs, medData: payload } })
                                                                            })
                                                                        }}
                                                                        key={d.id}></div>
                                                                })}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </Center>
                            </Paper>
                        </div>
                    )}
                    {state.error && <p>Error: {state.error}</p>}
                    {state.upload && <p>Medication data uploaded successfully!</p>}
                </div>
            )}
        </div>
    )
}

export default Medicine