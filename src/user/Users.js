import React, { useEffect, useState } from 'react';
import '@material/web/textfield/filled-text-field.js'
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import {useNavigate, useSearchParams} from "react-router-dom";
import { useClient } from "../client/ClientProvider";

const Users = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { profile, isLoggedIn, isLoading, clientFetchGet } = useClient();
    let message = null
    const [userData, setUserData] = useState([]);


    for (let param of searchParams) {
        if (param[0] === 'msg') {
            message = param[1]
        }
    }

    const fetchItemData = async () => {
        try {
            const response = await clientFetchGet("admin/users");

            const data = await response.json();

            if (data.status) {
                navigate('/profile?msg=' + data.message)
            } else {
                setUserData(data);
            }
        } catch (err) {
            console.log(err);
        }
    }



    useEffect(() => {
        if (isLoading || !isLoggedIn) {
            return;
        }

        fetchItemData()
    }, [isLoading, isLoggedIn])

    const retDateTime = (d) => {
        let dt = new Date(d)
        dt = (dt.getDate()).toString().padStart(2, '0') + "-" + (dt.getMonth()+1).toString().padStart(2, '0') + "-" + dt.getFullYear() + " " + (dt.getHours()).toString().padStart(2, '0') + ":" + (dt.getMinutes()).toString().padStart(2, '0') + ":" + (dt.getSeconds()).toString().padStart(2, '0')
        return dt
    }


    return (
        <>
            <div>
                {isLoggedIn && profile &&
                    <>
                        <h3>Users</h3>

                        {message &&
                            <div className="message">{message}</div>
                        }

                        <div className="divTable">
                            <div className="divTableRow">
                                <div className="divTableHead">Joined Date</div>
                                <div className="divTableHead">Email</div>
                                <div className="divTableHead">UID</div>
                                <div className="divTableHead">Display Name</div>
                                <div className="divTableHead">User Level</div>
                                <div className="divTableHead"></div>
                            </div>

                            {userData?.map(item => (
                                <div className="divTableRow" key={item.uid}>
                                    <div className="divTableCell">{retDateTime(item._date_joined)}</div>
                                    <div className="divTableCell">{item.email}</div>
                                    <div className="divTableCell">{item.uid}</div>
                                    <div className="divTableCell">{item.display_name}</div>
                                    <div className="divTableCell">{item.role}</div>
                                    <div className="divTableCell"><md-filled-button type="button"
                                                                                    onClick={() =>
                                                                                        navigate('/admin/users/' + item.uid, {
                                                                                            state: {
                                                                                            email: item.email,
                                                                                            display_name: item.display_name,
                                                                                            },
                                                                                        })
                                                                                        }>
                                                                                        Change Role
                                    </md-filled-button></div>
                                </div>
                            ))}
                        </div>
                    </>
                }

            </div>
        </>
    )

};

export default Users;
