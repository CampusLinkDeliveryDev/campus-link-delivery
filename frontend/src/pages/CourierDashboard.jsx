import Header from '../components/Header'

export default function CourierDashboard({profile}){
    return(
    <div>
        <Header profile={profile}/>
        <h1>Courier dashboard</h1>
        <p>Available orders will appear here</p>
    </div>
    )
}