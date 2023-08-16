import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Center, Divider, Flex, Group, Image, Paper, ScrollArea, Spoiler, Text, createStyles } from "@mantine/core"
import DoctorImg from "../assets/image/Doctor-logo.png"
import Pills1 from "../assets/image/pills1.png"
import Pills2 from "../assets/image/pills2.png"
import Pills3 from "../assets/image/pills3.png"
import Pills4 from "../assets/image/pills4.png"
import Pills5 from "../assets/image/pills5.png"
import { FaCircle } from "react-icons/fa"
import { BsPlusCircleFill, BsFillClockFill } from "react-icons/bs"
import { BiSolidMinusCircle } from "react-icons/bi"
import { MedContext } from '../context/MedicineProvider'

const useStyle = createStyles((theme) => ({

    box: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.white,
        textAlign: 'center',
        padding: theme.spacing.xl,
        borderRadius: "15px",
        cursor: 'pointer',
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
    }
}))

const ShowMore = ({ isActive }) => {
    return (
        <Flex justify={"center"} align={"center"} gap={"0.4rem"} >
            <Text fz={"sm"} c={"black"}>{isActive === true ? `Show more` : `Show less`} </Text>
            {isActive === true ? <BsPlusCircleFill color='orange' size={"17px"} /> : <BiSolidMinusCircle color='orange' size={"17px"} />}
        </Flex>
    )
}

function divideTimeRange(startTime, endTime, numIntervals) {
    const intervals = [];

    const totalHours = (endTime - startTime) / 3600000;

    for (let i = 0; i < numIntervals; i++) {
        intervals.push(formatTime(startTime + (i * (totalHours / numIntervals) * 3600000)));
        if (i === numIntervals - 1) intervals.push(formatTime(endTime));
    }

    return intervals;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${(date.getHours() > 9 ? '' : '0')}${date.getHours()}:${(date.getMinutes() > 9 ? '' : '0')}${date.getMinutes()}AM`;
}

const startTime = new Date('2023-08-15T08:00:00').getTime();
const endTime = new Date('2023-08-15T20:00:00').getTime();

function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
        return "th";
    }
    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

const MedHome = () => {
    const [{ status, payload }, dispatch] = useContext(MedContext)

    const [currentMonthDays, setCurrentMonthDays] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().getDate()); // Add this state

    useEffect(() => {
        const today = new Date();
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const daysArray = [...Array(lastDay.getDate()).keys()].map(i => i + 1);
        setCurrentMonthDays(daysArray);
    }, []);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const { classes } = useStyle();
    return (
        <>
            {status === "loading" && <>Loding...</>}
            {status === "error" && <>Error...</>}
            {status === "ready" &&

                <Paper align='left'>
                    <Box className={classes.box}>
                        <Flex justify={"center"} align={"center"}>
                            <ScrollArea >
                                <Flex direction={"row"}>
                                    {currentMonthDays.map((day, index) => {
                                        return (
                                            <Paper onClick={() => setSelectedDate(day)} key={day} bg={selectedDate === day ? "teal" : "white"} radius={"md"} m={"0.4rem"} mb={0} w={"3.2rem"}>
                                                <Box m={"sm"}>
                                                    <Text fw={"bold"} c={selectedDate === day ? "white" : "black"} >{dayNames[(index + new Date().getDay()) % 7]}</Text>
                                                    <Text>{day}</Text>
                                                </Box>
                                            </Paper>
                                        )
                                    })}
                                </Flex>
                            </ScrollArea>
                        </Flex>
                    </Box>
                    <Box className={classes.box} m={"0.8rem"}>
                        <Flex justify={"center"} align={"center"} gap={"1rem"}>
                            <Box>
                                <Text align='left'>As prescribed  you should be taking 5 medicines per day for the next 7 days.</Text>
                            </Box>
                            <Box>
                                <Image miw={"120px"} mx="auto" src={DoctorImg} alt="Random image" />
                            </Box>
                        </Flex>
                        <Box>
                            <Text align='left'>Never miss a dose, please take medicines as prescribed</Text>
                        </Box>

                    </Box>
                    <Box m={"0.8rem"}>
                        <Text fw={"normal"} fz="sm">
                            {selectedDate !== null ? `${dayNames[(selectedDate + new Date().getDay()) % 7]} ${selectedDate}${getOrdinalSuffix(selectedDate)}, ${new Date().getFullYear()}` : `Today, ${new Date().toLocaleDateString()}`}
                        </Text>
                        <Flex align={"center"} justify={"space-between"}>
                            <Text fw={"bold"} fz={"xl"}>Today’s Medicines</Text>
                            <Flex gap={"0.3rem"}>
                                <Flex justify={"center"} align={"center"} gap={"0.2rem"}>
                                    <FaCircle color='Green' />
                                    <Text fz={"xs"}>Taken</Text>
                                </Flex>
                                <Flex justify={"center"} align={"center"} gap={"0.2rem"}>
                                    <FaCircle color='red' />
                                    <Text fz={"xs"}>Not Taken</Text>
                                </Flex>
                                <Flex justify={"center"} align={"center"} gap={"0.2rem"}>
                                    <FaCircle color='gray' />
                                    <Text fz={"xs"}>Pending</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Box>
                    <MediBox payload={payload} />
                </Paper>}
        </>
    )
}

const pillImages = [Pills1, Pills2, Pills3, Pills4, Pills5];
const MediBox = ({ payload }) => {
    const { classes } = useStyle();

    return (
        <>
            {
                payload.map((data, index) => {
                    const frequency = data.dosageInstructions.frequency
                    const fArray = divideTimeRange(startTime, endTime, frequency - 1);
                    if (fArray.length === 0) {
                        fArray.push(formatTime(startTime)); // Insert [8:00AM] if fArray is empty
                    }
                    return (<Box key={data.id} className={classes.box} m={"0.8rem"}>
                        <Flex justify={"space-between"} align={"center"} gap={"1rem"}>
                            <Box w={"30%"}>
                                <Image maw={"4.4rem"} mx="auto" src={pillImages[index]} alt="Random image" />
                            </Box>
                            <Box w={"70%"}>
                                <Text fz={"16px"} fw={"500"} align='left'>{data.med}</Text>
                                <Text fz={"13px"} align='left'>{data.Provider}</Text>
                                <Spoiler maxHeight={20} align="right" showLabel={<ShowMore isActive={true} />} hideLabel={<ShowMore isActive={false} />} transitionDuration={400}>
                                    <Text fz={"13px"} align='left'>{data.dosageInstructions.text}</Text>
                                </Spoiler>
                            </Box>
                        </Flex>
                        <Divider my="sm" bg={"red"} />
                        <Box>
                            <Flex align={"center"} justify={"center"}>
                                {
                                    fArray.map((d, i) => {
                                        return (
                                            <Group key={i}>
                                                <Box m={"0.3rem"}>
                                                    <Flex justify={"center"} align={"center"} gap={"0.4rem"}>
                                                        <BsFillClockFill color='teal' />
                                                        <Text fz={"sm"}>{d}</Text>
                                                    </Flex>
                                                    <FaCircle color='Green' />
                                                </Box>
                                                {fArray.length === 1 ? <></> : <Divider size="sm" orientation="vertical" bg={"red"} />}
                                            </Group>
                                        )
                                    })}
                            </Flex>
                        </Box>
                    </Box>)
                })
            }
        </>
    )
}

export default MedHome