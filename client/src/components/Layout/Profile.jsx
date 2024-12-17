import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import { TiTick } from "react-icons/ti";

const Profile = () => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [editMode, setEditMode] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/user/profile', {
                    headers: { token: `${token}` }
                });
                const user = response.data.user;
                setName(user.username);
                setContact(user.phoneNo);
                setEmail(user.email);
                setAddress(user.addresses?.address || '');
                setCity(user.addresses?.city || '');
                setState(user.addresses?.state || '');
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    console.error('Access forbidden: Please login to access this resource');
                    window.location.href = '/login';
                } else {
                    console.error('Error fetching profile:', error);
                }
            }
        };
        fetchProfile();
    }, [token]);

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const saveProfile = async () => {
        try {
            const updateData = {
                username: name,
                phoneNo: contact,
                addresses: { address, city, state }
            };
            await axios.put('http://localhost:4000/api/user/updateProfile', updateData, {
                headers: { token: `${token}` }
            });
            setEditMode(false);
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="p-5">
            <div className="rounded-md flex-col mx-3 md:mx-24 mt-5">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold mb-5">User Profile</h1>
                    <button onClick={toggleEditMode} className="bg-[#fc802e] text-white py-2 px-4 rounded mt-4 flex items-center gap-2">
                        {editMode ? <TiTick /> : <MdEdit />} {editMode ? "Save" : "Edit"}
                    </button>
                </div>
                
                <div className="mb-4">
                    <p>Email</p>
                    <input
                        className="profileInput"
                        type="email"
                        value={email}
                        readOnly
                    />
                </div>

                <div className="md:flex md:gap-3 mb-4">
                    <div className="flex-1">
                        <p>Username</p>
                        <input
                            className="profileInput"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            readOnly={!editMode}
                        />
                    </div>

                    <div className="flex-1">
                        <p>Contact</p>
                        <input
                            className="profileInput"
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            readOnly={!editMode}
                        />
                    </div>
                </div>

                <p>Address</p>
                <div className="md:flex md:gap-3 mb-4">
                    <div className="flex-1">
                        <input
                            className="profileInput"
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            readOnly={!editMode}
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            className="profileInput"
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            readOnly={!editMode}
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            className="profileInput"
                            type="text"
                            placeholder="State"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            readOnly={!editMode}
                        />
                    </div>
                </div>

                {editMode && (
                    <button onClick={saveProfile} className="bg-[#fc802e] text-white py-2 px-4 rounded mt-4">
                        Save Changes
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;
