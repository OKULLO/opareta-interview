import  axios  from 'axios';


export const Register = async user=>{
    try {
        const res = await axios
        .post('auth/register', {
            Uname: user.uname,
            email: user.email,
            pass: user.password
        });
        
    console.log('User registerd');
        
    } catch (error) {
        console.log(error)
    }
   
}

export const Login = async user=>{
    try {
        const res = await axios
            .post('auth/login', {
                email: user.email,
                pass: user.pass
            });
        localStorage.setItem('usertoken', res.data);
        return res.data;
    }
    catch (err) {
        console.log(err);
    }
}