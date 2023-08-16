import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { MedContext, getMedData } from '../context/MedicineProvider'
import { Center, Paper, Table, createStyles } from '@mantine/core';
import axios from 'axios';


const useStyle = createStyles((theme) => ({
}))


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

const updateMedLogs = async (payload) => {
    await axios.put(`http://localhost:4000/medlogs/${USER_ID}`, payload).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}
const getMedLogs = async (payload) => {
    await axios.put(`http://localhost:4000/medlogs/${USER_ID}`, payload).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}



const MedCard = ({ payload, refetch }) => {

    const [medLogs, setMedLogs] = useState(payload);
    const [loading, setLoading] = useState(true);

    const intialLogData = payload.map(data => {
        const frequency = data.dosageInstructions.frequency;
        const inActiveStateWithId = (count) => Array.from({ length: count }, (_, id) => ({ id, state: "inactive" }))
        const { id: med_id } = data
        const fNewArray = inActiveStateWithId(frequency)
        return {
            med_id,
            frequency: fNewArray,
            date: new Date()
        }
    })


    const postLogs = useCallback(
        async (logs) => {
            await axios.get(`http://localhost:4000/medlogs/${USER_ID}`).then(async function (res) {
                if (res.data._id !== USER_ID) {
                    await axios.post(`http://localhost:4000/medlogs`, {
                        _id: USER_ID,
                        logs: logs
                    });
                }
            })
        }, []
    )

    useEffect(() => {
        postLogs(intialLogData)
    }, [])

    useEffect(() => {
        const fetchLogs = async () => {
            await axios.get(`http://localhost:4000/medlogs/${USER_ID}`).then(res => {
                setMedLogs((data) => {
                    data.map((d, i) => {
                        d["frequency"] = res.data.logs[i].frequency
                        return d
                    })
                    return [...data]
                })
            })
        }
        fetchLogs()
        setLoading(false)
    }, [postLogs])



    if (loading) {
        return <>Loding...</>
    }

    const ths = (
        <tr>
            <th>Medicine Name</th>
            <th>Slots</th>
        </tr>
    );


    const rows = medLogs.map((data) => {
        const frequency = data.frequency

        return (
            <tr key={data.id}>
                <td>{data.med}</td>
                <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        {frequency !== undefined ?
                            frequency.map(d => {
                                return <div onClick={async () => {
                                    await updateMedLogs(
                                        {
                                            ObjectId: data.id,
                                            frequencyIndex: d.id
                                        }
                                    )
                                    await axios.get(`http://localhost:4000/medlogs/${USER_ID}`).then(res => {
                                        setMedLogs((data) => {
                                            data.map((d, i) => {
                                                d["frequency"] = res.data.logs[i].frequency
                                                return d
                                            })
                                            return [...data]
                                        })
                                    })
                                }
                                } style={{ width: "20px", height: "20px", backgroundColor: d.state === "active" ? "red" : "gray" }} key={d.id}></div>
                            }) : <>Loading...</>}
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