import { combineReducers } from 'redux';
import users from './users';
import stories from './stories';
import selectedUser from './selected-user';

export default combineReducers({ users, stories, selectedUser });
