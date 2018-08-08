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
    
    openMenu() {
        
        const menu = document.querySelector(".nav-menu");
        const menuClosed = menu.classList.contains("no-display");
        
        if(menuClosed) {
            menu.classList.remove("no-display");
        } else {
            menu.classList.add("no-display");
        }

        // make background blurry/bright/light and immune to pointer events
        // select body and all but not nav and all its children
        const allDiv = Array.from(document.querySelectorAll(".main > *:not(.nav)"));
        const selectNoneOff = allDiv.filter((elem) => elem.classList.contains("select-none")).length === 0;
        
        if(selectNoneOff) {
            allDiv.forEach((elem) => { elem.classList.add("select-none") });
        } else {
            allDiv.forEach((elem) => { elem.classList.remove("select-none") });
        }
        // you can use forEach on a Nodelist
    }

    render() {
        let userLoggedIn = this.userLoggedIn();
        return (
            <nav className="nav">
                <i id="periodSelect" className="material-icons">date_range</i>
                <a href="/" className="nav-title font-one">
                    <span><strong>To-Do List</strong></span>
                </a>
                <i className="material-icons nav-hamburger" onClick={this.openMenu}>menu</i>
                <div className="nav-menu"> {/* nav menu mobile */}
                    {userLoggedIn}
                </div>
            </nav>
            );
    }
}

module.exports = Nav;