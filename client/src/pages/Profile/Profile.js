import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import * as constants from "../../constants";
import { deleteUserAccount, getProfile } from "../../api/account";
import { getUserType, removeToken, removeUserType } from "../../utils/account";
import Users from "./Users";
import Admins from "./Admins";
import Password from "./Password";
import Buttons from "../../components/Buttons";
import { deleteButtonStyle } from "../PagesStyles";
import { showNotification } from "../../components/Notification";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/User";

const Profile = () => {
    let navigate = useNavigate();
    const [profile, setProfile] = useState({});
    const [updateProfile, setUpdateProfile] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(true);
    const removeUser = userStore((state) => state.removeUser);

    const [userType, setUserType] = useState(null);

    useEffect(() => {
        setUserType(getUserType());
        getProfile().then((res) => {
            if (res.user !== undefined) {
                // res.user is array
                setProfile(res.user[0]);
            }
        });
    }, [updateProfile]);

    const deleteAccount = () => {
        Modal.confirm({
            title: "Confirm Delete",
            content: `Are you sure you want to permanently delete your account?`,
            onOk: () => handleDelete(),
            okText: "Delete",
        });
    };

    const handleDelete = () => {
        deleteUserAccount()
            .then((res) => {
                showNotification(res.message);
                removeToken();
                removeUser();
                removeUserType();
                navigate(constants.HOME_URL);
            })
            .catch((err) => {
                console.error(err.message);
            });
    };

    const toggleForm = () => {
        setIsEditingProfile(!isEditingProfile);
    };

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
        </div>
    );
};

export default Profile;
