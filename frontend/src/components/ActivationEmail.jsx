import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const ActivationEmail = () => {
    const { activation_token } = useParams()
    const navigate = useNavigate();

    const [match, setMatch] = useState(false)


    useEffect(() => {
        if (activation_token && !match) {
            const activationEmail = async () => {
                try {
                    await axios.post(`http://localhost:5000/activationemail/${activation_token}`)
                    setMatch(true)
                    toast.success("Account activated successfully");
                    navigate('/');
                } catch (err) {
                    toast.error(err?.response?.data)
                }
            }
            activationEmail()
        }
    }, [activation_token])

    return (
        <div>

        </div>
    )

};

export default ActivationEmail;