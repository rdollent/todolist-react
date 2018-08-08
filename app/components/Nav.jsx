const React = require("react");
// const {Link} = require("react-router");



class Nav extends React.Component {
    constructor(props) {
        super(props);
    }
    
    userLoggedIn() {
        let div;
        if(this.props.user) {
            div =
            <div>
                <a href="/todo" className="nav-viewAll nav-menu-a">Home</a>
                <a className="nav-signedIn nav-menu-a">Signed in as rod</a>
                <a href="/logout" className="nav-logout nav-menu-a">Logout</a>
            </div>;
        } else {
            div =
            <div>
                <a href="/register" className="nav-register nav-menu-a">Register</a>
                <a href="/login" className="nav-logIn nav-menu-a">Log In</a>
            </div>;
        }
        
        return div;
    }

    render() {
        let userLoggedIn = this.userLoggedIn();
        
        
        
        return (
            <div>

                <nav className="nav">
                    <i id="periodSelect" className="material-icons">date_range</i>
                    <a href="/" className="nav-title font-one">
                        <span><strong>To-Do List</strong></span>
                    </a>
                    <i className="material-icons nav-hamburger">menu</i>
                    <div className="nav-menu"> {/* nav menu mobile */}
                        {userLoggedIn}
                    </div>
                </nav>
                
            </div>
            );
    }
}

module.exports = Nav;