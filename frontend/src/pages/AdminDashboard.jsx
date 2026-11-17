import Header from '../components/Header'

export default function AdminDashboard({profile}){
    return(
        <div>
            <Header profile={profile}/>
            <h1>Admin dashboard</h1>
            <p>Courier approvals and users will appear here</p>
        </div>
    )
}