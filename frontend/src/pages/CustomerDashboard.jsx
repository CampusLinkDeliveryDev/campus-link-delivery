import Header from '../components/Header'
import VendorList from '../components/VendorList'

export default function CustomerDashoboard({profile}){
    return(
        <div>
            <Header profile={profile}/>
            <h1>Customer dashboard</h1>
            <h2>Vendors</h2>
            <VendorList/>
        </div>
    )
}