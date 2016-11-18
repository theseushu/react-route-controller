import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import reducer from './src/ducks'

const store = createStore(combineReducers({
  a: ()=>{return "a"},
  b: combineReducers({
    b1: ()=>{return null}
  }),
  rrc: reducer
}))

console.log(store.getState())

let s = [];

async function test(...params){
  return s;
}
const aaa = null
console.log({
  ...aaa
})
