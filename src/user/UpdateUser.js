import React, { useState } from 'react';
import '@material/web/textfield/filled-text-field.js'
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/switch/switch.js';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SearchSelectBox from "../forms/SearchSelectBox";
import { useClient } from "../client/ClientProvider";

const UpdateUser = () => {

    const navigate = useNavigate();
    const { profile, isLoggedIn, clientFetchGet } = useClient();
    const [role, setRole] = useState();
    const [error, setError] = useState(null);
    const { uid } = useParams();
    const location = useLocation();
    const editedUser = location.state;

    async function updateUser() {
        const response = await clientFetchGet('admin/users/' + uid + '?role=' + role);

        return response.json();
    }


    const handleSubmitUpdateUser = async e => {
        e.preventDefault();

        if (!role) {
            setError("Please select a role")
            return;
        }

        const ret = await updateUser();
        //console.log(ret)
        if (ret.status === 200) {
            setError(null)
            navigate(
                '/admin/users?msg=' + ret.message
            )
        } else {
            setError(ret.message)
        }

    }

    let options = [
        {value: "10", label: "Admin"},
        {value: "0", label: "Anon"},
        {value: "1", label: "Contributor"},
        {value: "2", label: "Reviewer"}
        ]


    const handleChangeOption = (selectedOption) => {
        //console.log('Option')
        //console.log(selectedOption)
        setRole(selectedOption.value)
    };

    return (
        <>
            <div>
                {isLoggedIn && profile &&
                    <form onSubmit={handleSubmitUpdateUser}>
                        <div className="divTable">
                            <h3>Update User {uid}</h3>
                            {editedUser && (
                                <div className="profile">
                                    <p><strong>Display Name:</strong> {editedUser.display_name}</p>
                                    <p><strong>Email:</strong> {editedUser.email}</p>
                                </div>
                            )}

                            <div className='profile'>
                                <h4>Role</h4>
                                <SearchSelectBox
                                    handleChangeEntity={handleChangeOption}
                                    searchOptions={options}
                                    multi={false}
                                    req={true}
                                />
                            </div>

                            {error &&
                                <div className="profile error">{error}</div>
                            }

                        </div>

                        <div style={{"marginBottom":20}}>
                            <md-filled-button style={{marginRight:"10px"}} type="submit">Update Role</md-filled-button>
                        </div>
                    </form>
                }

            </div>
        </>
    )

};

export default UpdateUser;
