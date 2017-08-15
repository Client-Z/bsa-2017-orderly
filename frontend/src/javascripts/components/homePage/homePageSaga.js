import { call, put, takeEvery} from 'redux-saga/effects';
import * as addBaseApi from './homePageApi';
import { browserHistory } from 'react-router';
import { addBase, getBases, updateBaseById } from './homePageApi';

function* getAllBases(action) {
    try {
        const bases= yield call(getBases);
        yield put({ type: 'GET_BASES_SUCCESS', bases: bases });
    } catch (err) {
        yield put({ type: 'GET_BASES_SUCCESS_FAILED', message: err.message});
    }
}


function* addingBase(action) {
    try {
        const payload = {};
        payload.base = yield call(addBase, action.name);
        yield put({ type: 'ADD_NEW_BASE_SUCCESS', payload });
    } catch (err) {
        yield put({ type: 'ADD_NEW_BASE_FAILED', message: err.message});
    }
}

function* updateBase(action) {
    const baseNeed =  yield call(updateBaseById, action._id, action.typeAction, action.value);
    
    try {  
       yield put({ type: 'CHANGE_BASE_PARAM_SUCCESS', base: baseNeed});
    } catch (err) {
        yield put({ type: 'CHANGE_BASE_PARAM_FAILED', message: err.message});
    }
}

function* addBaseSaga() {
    yield takeEvery('ADD_NEW_BASE', addingBase);
    yield takeEvery('GET_BASES', getAllBases);
    yield takeEvery('CHANGE_BASE_PARAM', updateBase);
}

export default addBaseSaga;