const cookie = require("qs");
module.exports = getUser;


function getUser(req,res){
    const cookies = cookie.parse(req.headers.cookie || '');
    let session = cookies.user.session_name_file
    let user = fs.readFileSync('')
}