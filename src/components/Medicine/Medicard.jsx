import { Box, createStyles } from '@mantine/core';
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom';
import { MedContext } from '../../context/MedicineProvider';


const useStyle = createStyles((theme) => ({
    box: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[3],
        textAlign: 'center',
        padding: theme.spacing.xl,
        borderRadius: 0,
        cursor: 'pointer',

        '&:hover': {
            backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
        }
    }
}))

const Medicard = () => {

    const { classes } = useStyle();
    const medData = useContext(MedContext)

    return (
        <>
            {
                medData.data.map(medRecords => {
                    return (
                        <></>
                        // <Paper>
                        //     <Box></Box>
                        //     <Box></Box>
                        //     <Box></Box>
                        // </Paper>
                        // <NavLink key={medRecords.id} to={`medicines/${medRecords.id}`}>
                        //     <Box className={classes.box}>
                        //         {medRecords.med}
                        //     </Box>
                        // </NavLink>
                    )
                })
            }
        </>
    )
}

export default Medicard