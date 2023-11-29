import React, { useState } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import "../style/Login.css"
const ResetPassword = () => {
const [email, setEmail] = useState()



  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/forget-password', { email })
      toast.success("Mail sent")
    } catch (error) {
      toast.error(error?.response?.data?.msg)
    }
  }

  return (
    <section className="background-radial-gradient overflow-hidden">
      <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
        <div className="row gx-lg-5 align-items-center mb-5">
          <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
            <div className="card bg-glass">
              <div className="card-body px-4 py-5 px-md-5">
                <form onSubmit={handleSubmit}>
                  <div className="form-outline mb-4">
                    <input type="email" id="form3Example3" className="form-control"
                      placeholder='Enter email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block mb-4">
                    Send mail
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

export default ResetPassword
