import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import DetailField from "../components/DetailField";
import DetailHeader from "../components/DetailHeader";
import { useClient } from "../client/ClientProvider";

const Rejected = () => {

    let { uid } = useParams();
    const [item, setItem] = useState()
    const { isLoggedIn, isLoading, clientFetch } = useClient();


    const fetchItemData = async () => {
        try {
            const response = await clientFetch("view/rejected/" + uid, {
                method: 'GET',
            });

            const data = await response.json();

            setItem(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (isLoading || !isLoggedIn || !uid) {
            return;
        }

        fetchItemData()
    }, [isLoading, isLoggedIn, uid])

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

    return (
        <>
            <h1>{item?.name}</h1>

            <div className="divTable">
                <h3>General Information</h3>
                <DetailField
                    d={item?.uid}
                    s="UID"
                />
                <DetailField
                    d={retDate(item?._date_created)}
                    s="Creation Date"
                />
                <DetailField
                    d={item?._added_by?.display_name}
                    s="Creation By"
                />
                <DetailField
                    d={item?.entry_review_status}
                    s="Status"
                />
                <DetailField
                    d={item?._reviewed_by?.display_name}
                    s="Reviewed By"
                />
            </div>


            {/* Debug Data
            {process.env.NODE_ENV === "development" && item &&
                <div className="divTable">
                    <DetailHeader
                        t="Raw Data"
                        m={JSON.stringify(item, null, 4)}
                        p="true"
                    />
                </div>
            }

            */}
        </>
    )

};

export default Rejected;
