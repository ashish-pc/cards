import { ACTIVATE_SLOT, INACTIVE, PENDING, READY } from "../constants/medConstant"


const USER_ID = "ashish"


export const medReducer =  (state = {}, { type, payload }) => {
    switch (type) {
        case INACTIVE:
            return { ...state, status: "inactive" }
        case READY:
            return { ...state, status: "ready", fArray: payload.fArray }
        case PENDING:
            return { ...state, status: "pending" }
        case ACTIVATE_SLOT:
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
            // try{
            //     console.log("called reducer")
            //     await axios.post(`http://localhost:4000/medication/${USER_ID}/${objectIndex}`, newState.fArray)
            // }catch (e){
            //     console.log(e)
            // }

            console.log({ ...state, fArray: updatedFArray })
            return newState;
        default:
            return state
    }

}