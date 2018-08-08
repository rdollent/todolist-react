const React = require("react");
const User = require("User");
const Nav = require("Nav");



class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            User: {}
        };
        
    }
    
    async printUser() {
        const x = await User();
        this.setState({
            User: x
        });
    }
    componentDidMount() {
        this.printUser();
    }
    
    render() {
        return (
            <div className="main">
                <Nav user={this.state.User}/>
                <h1>Main</h1>

            </div>
            
            );
    }
}


module.exports = Main;