import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { removeAvatar } from "../redux/actions";
import { toast } from "react-toastify";

export default function AuthUser() {
    const navigate = useNavigate();

    const getToken = () => {
        const tokenString = sessionStorage.getItem('access_token');
        const userToken = JSON.parse(tokenString);
        return userToken;
    }

    const getUser = () => {
        const userString = sessionStorage.getItem('user');
        const userDetail = JSON.parse(userString);
        return userDetail;
    }

    const getRole = () => {
        const roleString = sessionStorage.getItem('role');
        const userRole = JSON.parse(roleString);
        return userRole;
    }

    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());
    const [role, setRole] = useState(getRole());
    const dispatch = useDispatch();

    const saveToken = (user, token, role) => {
        sessionStorage.setItem('access_token', JSON.stringify(token));
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('role', JSON.stringify(role));

        setToken(token);
        setUser(user);
        setRole(role);

        console.log(role);
    }

    const logout = () => {
        sessionStorage.clear();
        localStorage.clear();
        dispatch(removeAvatar(''));
        navigate('/login')
        toast.success('Logout successful!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })
    }

    const http = axios.create({
        baseURL: "http://127.0.0.1:8000/",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })

    return {
        setToken:saveToken,
        token,
        user,
        role,
        getToken,
        logout,
        http,
    }
}