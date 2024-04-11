import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';

const UserVerification = () => {
  // Get the loginUser function from AuthContext
  const { Verification } = useContext<any>(AuthContext);
  const { username } = useParams();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form_data = new FormData(e.currentTarget);
    const verification_code: string = form_data.get("email") as string;

    // Call loginUser function with email and password
    Verification(username, verification_code);
  }

  return (
    <div>
      <>
        <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-xl-10">
                <div className="card" style={{ borderRadius: "1rem" }}>
                  <div className="row g-0">
                    <div className="col-md-2 col-lg-5 d-flex justify-content-center ">
                      <img
                        src="/logo-color.png"
                        alt="login form"
                        className="img-fluid ratio ratio-1x1"
                        style={{ borderRadius: "1rem 0 0 1rem" }}
                      />
                    </div>
                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                      <div className="card-body p-4 p-lg-5 text-black">
                        {/* Form for login */}
                        <form onSubmit={handleSubmit}>
                          <div className="d-flex align-items-center mb-3 pb-1">
                            <div className="d-flex align-items-center mb-3 pb-1">
                              <img style={{ width: "120px", padding: "6px" }} src="/logo.png" alt="" />
                              <span className="h2 fw-bold mb-0">Welcome back 👋</span>
                            </div>
                          </div>
                          <h5
                            className="fw-normal mb-3 pb-3"
                            style={{ letterSpacing: 1 }}
                          >
                            Please verify your account with the code sent to your email
                          </h5>
                          <div className="form-outline mb-4">
                            <input
                              type="number"
                              id="verification_code"
                              className="form-control form-control-lg"
                              name='verification_code'
                            />
                            <label className="form-label" htmlFor="verification_code">
                              Verification code
                            </label>
                          </div>
                          <div className="pt-1 mb-4">
                            <button
                              className="btn btn-dark btn-lg btn-block"
                              type="submit"
                            >
                              Verify
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="bg-light text-center text-lg-start">
          <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }} >
          </div>
        </footer>
      </>

    </div>
  )
}

export default UserVerification;
