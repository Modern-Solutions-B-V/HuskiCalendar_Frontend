import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"
import axios from "axios"
import "../style/Login.css"

const ResetPage = () => {
    const [password, setPassword] = useState('');
    const showPassword = useMemo(() => false, []);
    const [show, setShow] = useState(false)

    const { id, token } = useParams()
    const navigate = useNavigate()



    useEffect(() => {
        axios.get(`http://localhost:5000/reset-password/${id}/${token}`).then((res) => {
            setShow(true)
        }).catch(error => {
            setShow(false)
            toast.error(error?.response?.data?.msg);
        });
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`http://localhost:5000/reset-password/${id}/${token}`, { password })
            toast.success("Password changed successfully")
            navigate('/')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <section className="background-radial-gradient overflow-hidden">
            <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
                <div className="row gx-lg-5 align-items-center mb-5">
                    <div className="col-lg-6 mb-5 mb-lg-0" style={{
                        zIndex: 10
                    }}>
                        <h1
                            className="my-5 display-5 fw-bold ls-tight"
                            style={{
                                color: 'hsl(218, 81%, 95%)'
                            }}
                        >
                            The best offer <br />
                            <span
                                style={{
                                    color: 'hsl(218, 81%, 75%)'
                                }}
                            >
                                for your trip
                            </span>
                        </h1>
                        <p
                            className="mb-4 opacity-70"
                            style={{
                                color: 'hsl(218, 81%, 85%)'
                            }}
                        >
                            Plan your trip with efficiency
                        </p>
                    </div>

                    <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                        <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                        <div className="card bg-glass">
                            <div className="card-body px-4 py-5 px-md-5">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-outline mb-4">
                                        <input type={showPassword ? 'text' : 'password'} id="form3Example3" className="form-control"
                                            placeholder='Enter new  password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)} />

                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block mb-4" disabled={!show}>
                                        Change Password
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResetPage
