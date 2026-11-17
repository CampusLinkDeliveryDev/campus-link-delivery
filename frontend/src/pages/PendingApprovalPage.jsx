import Header from '../components/Header'


//Couriers sign up as pending approcval until an admin approves
export default function PendingApprovalPage({profile}){
    return (
        <div>
            <Header profile={profile}/>
            <h1>Waiting for approval</h1>
            <p>an admin needs to approve your courier account before you can start delivering</p>
        </div>
    )
}