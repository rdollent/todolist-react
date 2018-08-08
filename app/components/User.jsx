// const React = require("react");
const axios = require("axios");


// class User extends React.Component {
//     getUser() {
//         return axios.get("/user")
//         .then(function(res) { return res })
//         .catch(function(err) { throw new Error(err) });
//     }
//     async componentDidMount() {
//         const x = await this.getUser();
//         return x
//     }
//     return
// }



function getUser() {
    const x = axios.get("/user")
        .then(function(res) { return res })
        .catch(function(err) { throw new Error(err) });
    
    return x;
}



module.exports = getUser;
    
    
