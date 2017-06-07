import React from 'react';
import debug from 'debug';
import { asyncReactor } from 'async-reactor'
import {startAnonymousAuth, getAuthUser } from '../src/util/auth'
import {save} from '../src/firebase/'
const log = debug('login')

function saveSomeData() {
    const user = getAuthUser();
    
    const uid = (user && user.uid) ? user.uid : false
    if(!uid) {
        log('no user?', user)
        return;
    }

    log('authId', uid)
    save('2', {
        'key': '1',
        'userId': uid
    })
}


const LoginPage = () => (
    <div>
        <div><a onClick={startAnonymousAuth}>Login</a></div>
        <div><a onClick={saveSomeData}>save</a></div>
    </div>
)

export default LoginPage;   