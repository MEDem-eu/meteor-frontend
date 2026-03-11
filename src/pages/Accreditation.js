import {useEffect} from "react";

import imgCyrusEngerer from "../assets/img/256px-Cyrus_Engerer_addressing_PL_AGM_2013.jpeg"
import imgEuropeanParliament from "../assets/img/256px-European-parliament-strasbourg-inside.jpeg";
import imgHouseOfCommons from "../assets/img/256px-House_of_Commons_2010.jpeg";
import imgProtestGreece from "../assets/img/256px-Working-class_protest_in_Greece.jpeg";
import imgIowaStateFair from "../assets/img/256px-Politics_at_the_2015_Iowa_State_Fair_20424491760_2.jpeg";



const Accreditation = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>

            <h2>Accreditation</h2>

            <h3>Images</h3>

            <p>The OPTED Meteor website uses the following images:</p>

            <p>
                <img src={ imgEuropeanParliament } />
            </p>

            <p>
                <strong>Inside the European Parliament in Strasbourg</strong><br />
                Author: Cédric Puisney<br />
                License: <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0 Deed</a><br />
                Source: <a target="_blank" href="https://commons.wikimedia.org/wiki/File:European-parliament-strasbourg-inside.jpg">Wikimedia Commons</a>
            </p>

            <p>
                <img src= { imgCyrusEngerer }/>
            </p>

            <p>
                <strong>Cyrus Engerer addressing Partit Laburista Annual General Conference</strong><br />
                Author: Irodutus<br />
                License: <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0 Deed</a><br />
                Source: <a target="_blank" href="https://commons.wikimedia.org/wiki/File:Cyrus_Engerer_addressing_PL_AGM_2013.JPG">Wikimedia Commons</a>
            </p>

            <p>
                <img src={ imgHouseOfCommons } />
            </p>

            <p>
                <strong>House of Commons, United Kingdom</strong><br />
                Author: UK government<br />
                License: <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Open Government License 3</a><br />
                Source: <a target="_blank" href="https://commons.wikimedia.org/wiki/File:House_of_Commons_2010.jpg">Wikimedia Commons</a>
            </p>

            <p>
                <img src={ imgProtestGreece } />
            </p>

            <p>
                <strong>Working-class political protest in the northern suburb of Halandri in Athens</strong><br />
                Author: Cogiati<br />
                License: <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0 Deed</a><br />
                Source: <a target="_blank" href="https://commons.wikimedia.org/wiki/File:Working-class_protest_in_Greece.JPG">Wikimedia Commons</a>
            </p>

            <p>
                <img src={ imgIowaStateFair } />
            </p>

            <p>
                <strong>Bernie Sanders speaks to thousands of people during his remarks at the Des Moines Register's political soapbox at the State Fair</strong><br />
                Author: Phil Roeder from Des Moines, IA, USA<br />
                License: <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0 Deed</a><br />
                Source: <a target="_blank" href="https://commons.wikimedia.org/wiki/File:Politics_at_the_2015_Iowa_State_Fair_(20424491760)_(2).jpg">Wikimedia Commons</a>
            </p>
        </>
    )
};

export default Accreditation;
