import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';

const Loginpage = () => {
  // Get the loginUser function from AuthContext
  const { loginUser } = useContext<any>(AuthContext);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form_data = new FormData(e.currentTarget);
    const email: string = form_data.get("email") as string;
    const password: string = form_data.get("password") as string;

    // Call loginUser function with email and password
    email.length > 0 && loginUser(email, password);

    console.log(email);
    console.log(password);
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
                            Sign into your account
                          </h5>
                          <div className="form-outline mb-4">
                            <input
                              type="email"
                              id="form2Example17"
                              className="form-control form-control-lg"
                              name='email'
                            />
                            <label className="form-label" htmlFor="form2Example17">
                              Email address
                            </label>
                          </div>
                          <div className="form-outline mb-4">
                            <input
                              type="password"
                              id="form2Example27"
                              className="form-control form-control-lg"
                              name='password'
                            />
                            <label className="form-label" htmlFor="form2Example27">
                              Password
                            </label>
                          </div>
                          <div className="pt-1 mb-4">
                            <button
                              className="btn btn-dark btn-lg btn-block"
                              type="submit"
                            >
                              Login
                            </button>
                          </div>
                          <a className="small text-muted" href="#!">
                            Forgot password?
                          </a>
                          <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                            Don't have an account?{" "}
                            <Link to="/register" style={{ color: "#393f81" }}>
                              Register Now
                            </Link>
                          </p>
                          <a href="#!" className="small text-muted">
                            Terms of use.
                          </a>
                          <a href="#!" className="small text-muted">
                            Privacy policy
                          </a>
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
          <div
            className="text-center p-3"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          >
            © 2019 - till date Copyright:
            <a className="text-dark" href="https://mdbootstrap.com/">
              desphixs.com
            </a>
          </div>
        </footer>
      </>

    </div>
  )
}

export default Loginpage;
