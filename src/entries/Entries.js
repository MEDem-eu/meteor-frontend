import { useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {Tabs} from "@material/web/tabs/tabs";
import {PrimaryTab} from "@material/web/tabs/primary-tab";
import { useClient } from "../client/ClientProvider";

const Entries = () => {

    const navigate = useNavigate();
    const PAGE_SIZE = 100;

    const [showTab, setShowTab] = useState('pending');

    const [entriesByStatus, setEntriesByStatus] = useState({
        pending: [],
        accepted: [],
        rejected: [],
    });

    const [pagesByStatus, setPagesByStatus] = useState({
        pending: -1,
        accepted: -1,
        rejected: -1,
    });

    const [hasMoreByStatus, setHasMoreByStatus] = useState({
        pending: true,
        accepted: true,
        rejected: true,
    });

    const [loadedByStatus, setLoadedByStatus] = useState({
        pending: false,
        accepted: false,
        rejected: false,
    });

    const [loadingByStatus, setLoadingByStatus] = useState({
        pending: false,
        accepted: false,
        rejected: false,
    });

    const { profile, isLoggedIn, isLoading, clientFetchGet } = useClient();


    const fetchEntriesForStatus = async (status, page = 0) => {
        if (loadingByStatus[status]) {
            return;
        }

        setLoadingByStatus(prev => ({
            ...prev,
            [status]: true,
        }));

        try {
            const response = await clientFetchGet(
                "user/" + profile.uid + "/entries?entry_review_status=" + status + "&page=" + page
            );

            const data = await response.json();

            setEntriesByStatus(prev => ({
                ...prev,
                [status]: page === 0 ? data : prev[status].concat(data),
            }));

            setPagesByStatus(prev => ({
                ...prev,
                [status]: page,
            }));

            setHasMoreByStatus(prev => ({
                ...prev,
                [status]: data.length === PAGE_SIZE,
            }));

            setLoadedByStatus(prev => ({
                ...prev,
                [status]: true,
            }));
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingByStatus(prev => ({
                ...prev,
                [status]: false,
            }));
        }
    };

    useEffect(() => {
        if (
            isLoading ||
            !isLoggedIn ||
            !profile?.uid ||
            loadedByStatus[showTab] ||
            loadingByStatus[showTab]
        ) {
            return;
        }

        fetchEntriesForStatus(showTab, 0);
    }, [isLoading, isLoggedIn, profile?.uid, showTab, loadedByStatus, loadingByStatus]);

    const getQuery = (un) => {
        return '/detail/' + un
    }

    const retDate = (d) => {
        if (d){
            let dt = new Date(d)
            return dt.getFullYear() + "-" + (dt.getMonth() + 1).toString().padStart(2, '0') + "-" + (dt.getDate()).toString().padStart(2, '0')
        }
        return ''
    }

    const getDgraph = (d) => {
        let dg = d["dgraph.type"]
        if (dg) {
            let ret = ''
            for (var t of dg) {
                if (t !== 'Entry') {
                    ret += t
                }
            }
            return ret;
        }
        return null;
    }

    let goTabs = (t) => {
        setShowTab(t)
    }


    const renderEntry = (item, isRejected = false) => (
        <div className="infobox" key={item.uid}>
            <div style={{float: 'right'}}>
                <md-filled-button
                    type="button"
                    onClick={() => navigate(isRejected ? '/rejected/' + item.uid : '/detail/' + item._unique_name)}
                >
                    View
                </md-filled-button>

                {!isRejected && (
                    <>
                        &nbsp;&nbsp;
                        <md-filled-button
                            type="button"
                            onClick={() => navigate('/edit/' + item.uid)}
                        >
                            Edit
                        </md-filled-button>
                    </>
                )}
            </div>

            <h4><Link to={getQuery(item._unique_name)}>{item.name}</Link></h4>
            <p><strong>{getDgraph(item)}</strong></p>
            <p>
                {item.entry_review_status}<br/>
                {retDate(item._date_created)}
            </p>
        </div>
    );

    const renderLoadMore = (status) => (
        hasMoreByStatus[status] && (
            <p align="center">
                <md-filled-button
                    type="button"
                    onClick={() => fetchEntriesForStatus(status, pagesByStatus[status] + 1)}
                >
                    {loadingByStatus[status] ? "Loading..." : "Load more"}
                </md-filled-button>
            </p>
        )
    );    


    return (
        <>
            <h1>My Entries</h1>

            <p align="center">
                <strong>{entriesByStatus[showTab].length}</strong> loaded record{entriesByStatus[showTab].length === 1 ? "" : "s"}
            </p>

            <md-tabs>
                <md-primary-tab
                    onClick={() => goTabs('pending')}>
                    Pending
                </md-primary-tab>
                <md-primary-tab
                    onClick={() => goTabs('accepted')}>
                    Accepted
                </md-primary-tab>
                <md-primary-tab
                    onClick={() => goTabs('rejected')}>
                    Rejected
                </md-primary-tab>
            </md-tabs>

            {isLoggedIn && (
                <>
                    {showTab === 'pending' && (
                        <div role="tabpanel" id="panel-one" aria-labelledby="tab-one" className='tab_panel'>

                            {entriesByStatus.pending?.map(item => renderEntry(item))}
                            {renderLoadMore('pending')}

                        </div>
                    )}
                    {showTab === 'accepted' && (
                        <div role="tabpanel" id="panel-two" aria-labelledby="tab-two" className='tab_panel'>

                            {entriesByStatus.accepted?.map(item => renderEntry(item))}
                            {renderLoadMore('accepted')}

                        </div>
                    )}
                    {showTab === 'rejected' && (
                        <div role="tabpanel" id="panel-three" aria-labelledby="tab-three" className='tab_panel'>

                            {entriesByStatus.rejected?.map(item => renderEntry(item, true))}
                            {renderLoadMore('rejected')}

                        </div>
                    )}

                </>
            )}
        </>
    )

};

export default Entries;
