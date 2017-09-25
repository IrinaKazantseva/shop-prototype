/**
 * Created by Irina Kazantseva on 21.09.2017.
 */
const initialState = {
    products: [],
    newProduct:{
        model: '',
        description: '',
        price: '',
        productTypeId: 0
    }
};

export default function  productReducer(state = initialState, action) {
    switch(action.type){
        case 'FETCH_PRODUCTS':
            return { ...state, products: action.payload};
        case 'EDIT_NEW_PRODUCT':
            return { ...state, newProduct: action.payload};
        default:
            return state;
    }

}