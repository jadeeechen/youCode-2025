import {useNavigate} from 'react-router-dom'

function SignIn() {

    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate('/map')
    }
    return(
        <div className="sign-in-container">
            <div className="site-name">
                <h1 className="site-title">QuickFork</h1>
                <h4 className="site-tagline">Small Detours, Food Restores</h4>
            </div>
            <div className="sign-in-info-container">
                <h4 className="sign-in-text">Email</h4>
                <input type='text' className="sign-in-input" placeholder="Enter email"></input>
                <h4 className="sign-in-text">Password</h4>
                <input type='password' className="sign-in-input" placeholder="Enter password"></input>
                <button className='sign-in-button' onClick={handleSignIn}>Sign In</button>
            </div>
        </div>
    )
}

export default SignIn