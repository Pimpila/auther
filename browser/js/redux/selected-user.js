import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

const SET_CURRENT_USER = 'SET_CURRENT_USER';
const REMOVE_CURRENT_USER = 'REMOVE_CURRENT_USER'

/* ------------   ACTION CREATORS     ------------------ */

const login = user => ({type: SET_CURRENT_USER, user })
const logout = () => ({type: REMOVE_CURRENT_USER})

/* ------------       REDUCER     ------------------ */

export default function reducer(selectedUser = {}, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      //  selectedUser = action.user
       return action.user;
    case REMOVE_CURRENT_USER:
      selectedUser = {};
      return selectedUser;
    default:
      return selectedUser;
  }
}

/* ------------       DISPATCHERS     ------------------ */


export const selectUser = (user) => dispatch => {
  axios.post('/login', user)
    .then(res => dispatch(login(res.data)))
}

export const deselectUser = () => dispatch => {
  axios.post('/logout')
    .then(res => dispatch(logout()))
}

