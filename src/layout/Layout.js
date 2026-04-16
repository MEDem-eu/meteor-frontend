import { Outlet, Link } from "react-router-dom";
import Nav from './Nav'
import QuickSearchForm from "../forms/QuickSearchForm";
import logo from '../assets/img/opted_logo_stylized.svg'
import medemMeteorLogo from '../assets/img/medem_meteor_logo.png'
import '../assets/css/pub.css'
import '../assets/css/m3.css'
import '../assets/css/sticky-footer-navbar.css'
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Version from "../components/Version";
import VersionFrontend from "../components/VersionFrontend";
import React from "react";

const Layout = () => {

    const apiURL = () => {
        return process.env.REACT_APP_API + '/swagger'
    }

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/"><img src={medemMeteorLogo} height="64" /></Link><Link className="navbar-brand" to="/">Home</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarCollapse">
                            {<Nav />}
                            {<QuickSearchForm />}
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-shrink-0">
                <div className="container">
                    <Outlet />
                </div>
            </main>

            <footer className="footer">
                <div className="container">
               
                    <div className="footer-row">
                        <div className="footer-col-left">
                            <Link to="about">About</Link> · <Link to="privacy">Privacy Policy & Disclaimer</Link> · <Link to="imprint">Imprint</Link> · <Link to="accreditation">Accreditation</Link>
                        </div>
                        <div className="footer-col-right">
                            <a href="https://www.medem.eu//" target="_blank" rel="noopener noreferrer">Main MEDem Website</a> &nbsp; · &nbsp;                           
                            <a href="https://bsky.app/profile/medem.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Bluesky icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" style={{verticalAlign: 'middle'}} fill="currentColor" className="bi bi-bluesky" viewBox="0 0 16 16">
                                <path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948"/>
                                </svg>
                            </a> &nbsp; · &nbsp;
                            <a href="https://github.com/MEDem-eu" target="_blank" rel="noopener noreferrer" aria-label="Github icon"><GitHubIcon/></a> &nbsp; · &nbsp;
                            <a href="https://linkedin.com/company/monitoringelectoraldemocracy" target="_blank" rel="noopener noreferrer" aria-label="Github icon"><LinkedInIcon/></a>
                        </div>
                    </div>

                    <div className="footer-text">
                        <p>MEDem METEOR is currently being further developed, updated, and maintained within the financial and organizational framework of Monitoring Electoral Democracy (MEDem). </p>
                        <p>The initial version of METEOR was developed as part of OPTED (Observatory for Political Texts in European Democracies). The OPTED project received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 951832.</p>
                        <p>The document reflects only the authors’ views. The European Union is not liable for any use that may be made of the information contained herein.</p>
                        <p>Meteor is published under the <Link to="imprint"> CC-BY-SA 4.0 license</Link>. See <Link to="about">about page</Link> for details. Data can also be accessed via the <a target="_blank" href={apiURL()}>API</a>.</p>
                        <p>Frontend Version: <VersionFrontend /></p>
                        <p>Meteor API Version: <Version /></p>
                    </div>
                
                </div>
            </footer>

        </>
    )
};

export default Layout;
