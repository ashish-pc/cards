import React, { createContext, useCallback, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export const MedContext = createContext();

const initialState = {
    status: 'loading',
    payload: null,
    index: 0,
};

const getMedData = async () => {
    const res = await axios.get('http://localhost:5000/medData');
    return res.data;
};

const reducer = (state, { type, payload }) => {
    switch (type) {
        case "loading":
            return { ...state, status: "loading" }
        case "dataFailed":
            return { ...state, status: "error" }
        case 'dataReceived':
            return { ...state, payload: payload, status: 'ready' };
        // case 'nextDay':
        //     return { ...state, index: state.index + 1 };
        // case 'prevDay':
        //     return { ...state, index: state.index - 1 };
        default:
            throw new Error('Unknown Type!');
    }
};


const MedicineProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { data, error, isLoading } = useQuery({ queryKey: ['medData'], queryFn: getMedData, staleTime: Infinity });

    const memoizedDispatch = useCallback((data) => {
        dispatch({
            type: 'dataReceived',
            payload: data,
        });
    }, []);

    useEffect(() => {
        if (error) {
            dispatch({
                type: "dataFailed"
            })
        }
        if (isLoading) {
            dispatch({
                type: "loading"
            })
        }
        if (data) {
            memoizedDispatch(data);
        }
    }, [data, error, isLoading]);


    return (
        <MedContext.Provider value={[state, dispatch]}>
            {children}
        </MedContext.Provider>
    );
};

export default MedicineProvider;
