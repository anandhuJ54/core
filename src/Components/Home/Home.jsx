import React from 'react';
import './Home.scss';
import { useLocation} from 'react-router-dom';
import Header from '../Header/Header'
import Dashboard from '../Dashboard/Dashboard';
import Footer from '../Footer/Footer';
import Sidenav from '../Sidenav/Sidenav';
import Masters from '../Masters/Masters';
import HierarchyRight from '../Hierarchy/Hierarchy';

function Home() {
    const location = useLocation();

    let rightPanelComponent;

    if (location.pathname === '/masters') {
        rightPanelComponent = <Masters/>;
    } else if (location.pathname === '/license-type') {
        rightPanelComponent = <Dashboard/>
    } 
    else if (location.pathname === '/hierarchy') {
        rightPanelComponent = <HierarchyRight/>
    }else {
        rightPanelComponent = <HierarchyRight/>;
    }
    return (
        <>
            <Header/>
            <div className="home-panel">
                <div className="left">
                  <Sidenav/>
                </div>
                <div className="right">
                    {rightPanelComponent}
                </div>
            </div>
            <Footer/>
        </>
    )
}
export default Home;