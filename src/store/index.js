import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../modules'
import createSagaMiddleware from 'redux-saga'
//import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {}
const enhancers = []
// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
const middleware = [
    sagaMiddleware
]

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__
    
    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension())
    }
}

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
)

const store = createStore(
    rootReducer,
    initialState,
    composedEnhancers
)

// then run the saga
//sagaMiddleware.run(mySaga)

export default store
