import Header from '../components/Header'

export default function CustomerDashoboard({profile}){
    return(
        <div>
            <Header profile={profile}/>
            <h1>Customer dashboard</h1>
            <p>Vendors will appear here</p>
        </div>
    )
}