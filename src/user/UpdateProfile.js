import "@material/web/textfield/filled-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/button/text-button.js";
import "@material/web/switch/switch.js";
import { useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useClient } from "../client/ClientProvider";

const UpdateProfile = () => {

  const { profile, isLoading, loadProfile, clientFetchPost, logout } = useClient();

  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState();
  const [affiliation, setAffiliation] = useState();
  const [orcid, setOrcid] = useState();
  const [preferenceEmails, setPreferenceEmails] = useState();
  const [error, setError] = useState(null);

  async function updateUser(update) {
    const response = await clientFetchPost("user/profile/update", update);

    return response.json();
  }

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!profile) {
      logout("expired");;
      return;
    }

    setDisplayName(profile.display_name);
    setAffiliation(profile.affiliation);
    setOrcid(profile.orcid);
    setPreferenceEmails(profile.preference_emails);
  }, [profile, isLoading, navigate]);

  const handleSubmitUpdateProfile = async (e) => {
    e.preventDefault();
    let data_json = {};
    let details_json = {};
    details_json["display_name"] = displayName;
    details_json["affiliation"] = affiliation;
    details_json["orcid"] = orcid;
    details_json["preference_emails"] = preferenceEmails;
    data_json["data"] = details_json;
    //console.log(data_json)

    const ret = await updateUser(data_json);
    // console.log(ret)
    if (ret.status === 200) {
      setError(null);

      //   await getData();
      const updatedProfile = await loadProfile();

      if (updatedProfile) {
        setDisplayName(updatedProfile.display_name);
        setAffiliation(updatedProfile.affiliation);
        setOrcid(updatedProfile.orcid);
        setPreferenceEmails(updatedProfile.preference_emails);
      }

      navigate("/profile?msg=" + ret.message);
    } else {
      setError(ret.message);
    }
  };

  const updateSwitch = (e) => {
    //console.log(e)
    if (e.target.selected === true) {
      setPreferenceEmails(null);
    } else {
      setPreferenceEmails(true);
    }
  };

  const initialSwitch = () => {
    if (preferenceEmails) {
      return true;
    } else {
      return null;
    }
  };

  //console.log(preferenceEmails)

  return (
    <>
      <div>
        {profile && (
          <form onSubmit={handleSubmitUpdateProfile}>
            <div className="divTable">
              <h3>Update Profile</h3>

              <div className="profile">
                <md-filled-text-field
                  //   value={profile.display_name}
                  value={displayName || ""}
                  label="Display Name"
                  type="text"
                  onBlur={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>

              <div className="profile">
                <md-filled-text-field
                  //   value={profile.affiliation}
                  value={affiliation || ""}
                  label="Affiliation"
                  type="text"
                  onBlur={(e) => setAffiliation(e.target.value)}
                />
              </div>

              <div className="profile">
                <md-filled-text-field
                  //   value={profile.orcid}
                  value={orcid || ""}
                  label="ORCID"
                  type="text"
                  onBlur={(e) => setOrcid(e.target.value)}
                />
              </div>

              <div className="profile">
                <md-switch
                  selected={initialSwitch()}
                  onClick={(e) => updateSwitch(e)}
                />
                &nbsp;Send me notification emails
              </div>

              {error && <div className="profile error">{error}</div>}
            </div>

            <div style={{ marginBottom: 20 }}>
              <md-filled-button style={{ marginRight: "10px" }} type="submit">
                Update
              </md-filled-button>
            </div>
          </form>
        )}

        {/* Debug Data
                
                 
                <div className="divTable">
                    <DetailHeader
                        t="Raw Data"
                        m={JSON.stringify(profile, null, 4)}
                        p="true"
                    />
                </div>

                 
                <div className="divTable">
                    <DetailHeader
                        t="Login Data"
                        m={JSON.stringify(loggedIn, null, 4)}
                        p="true"
                    />
                </div>
                */}
      </div>
    </>
  );
};

export default UpdateProfile;
