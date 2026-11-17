import {useEffect, useState} from 'react'
import {apiFetch} from '../lib/api'

//Loads GET (path) from the backend and reloads when the path changes
export function useApi(path){
    const [result, setResult] = useState({path: null, data: null, error:null})

    useEffect(() => {
        let active = true
        apiFetch(path).then((data) => active && setResult({path, data, error: null}))
            .catch((error) => active && setResult({path, data: null, error}))
        
        return () => {
            active = false
        }
    }, [path])

    //Still loading until we have result for exact path
    const ready = result.path === path
    return {
        data: ready? result.data : null,
        error: ready?  result.error: null,
        loading: !ready
    }


}