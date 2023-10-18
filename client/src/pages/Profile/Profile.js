import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { getProfile } from "../../api/account";
import { getUserType } from "../../utils/account";
import Users from "./Users";
import Admins from "./Admins";
import Password from "./Password";
import Buttons from "../../components/Buttons";
import { deleteButtonStyle } from "../PagesStyles";

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [updateProfile, setUpdateProfile] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(true);

    const [userType, setUserType] = useState(null);

    useEffect(() => {
        setUserType(getUserType());
        getProfile().then((res) => {
            if (res.user !== undefined) {
                console.log(res.user);
                // res.user is array
                setProfile(res.user[0]);
            }
        });
    }, [updateProfile]);

    const toggleForm = () => {
        setIsEditingProfile(!isEditingProfile);
    };

    const deleteAccount = () => {
        Modal.confirm({
            title: "Confirm Delete",
            content: `Are you sure you want to permanently delete your account?`,
            onOk: () => handleDelete(),
            okText: "Delete",
        });
    };
    const handleDelete = () => {};

    return (
        <div style={{ margin: "10px 60px" }}>
            {isEditingProfile ? (
                userType === "customer" ? (
                    <Users
                        profile={profile}
                        setProfile={setProfile}
                        updateProfile={updateProfile}
                        setUpdateProfile={setUpdateProfile}
                    />
                ) : (
                    <Admins
                        profile={profile}
                        setProfile={setProfile}
                        updateProfile={updateProfile}
                        setUpdateProfile={setUpdateProfile}
                    />
                )
            ) : (
                <Password />
            )}
            <div style={{ margin: "10px" }}>
                <Buttons
                    text={isEditingProfile ? "Change Password" : "Edit Profile"}
                    onClick={toggleForm}
                />
            </div>
            {userType !== "superadmin" && (
                <div style={{ margin: "10px" }}>
                    <Button style={deleteButtonStyle} onClick={deleteAccount}>
                        Delete Account
                    </Button>
                </div>
            )}
            ;
        </div>
    );
};

export default Profile;
