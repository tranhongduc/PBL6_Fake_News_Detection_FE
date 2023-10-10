import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { removeAvatar } from "../redux/actions";
import { toast } from "react-toastify";

export default function AuthUser() {
    const navigate = useNavigate();

    const getAccessToken = () => {
        const accessTokenString = localStorage.getItem('access_token');
        const accessToken = JSON.parse(accessTokenString);
        return accessToken;
    }

    const getRefreshToken = () => {
        const refreshTokenString = localStorage.getItem('refresh_token');
        const refreshToken = JSON.parse(refreshTokenString);
        return refreshToken;
    }

    const hasAccessToken = () => {
        const accessTokenString = localStorage.getItem('access_token');
        return !!accessTokenString
    }

    const hasRefreshToken = () => {
        const refreshTokenString = localStorage.getItem('refresh_token');
        return !!refreshTokenString
    }

    const [accessToken, setAccessToken] = useState(getAccessToken());
    const [refreshToken, setRefreshToken] = useState(getRefreshToken());
    const dispatch = useDispatch();

    const saveToken = (accessToken, refreshToken) => {
        localStorage.setItem('access_token', JSON.stringify(accessToken));
        localStorage.setItem('refresh_token', JSON.stringify(refreshToken));

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    }

    const logout = () => {
        localStorage.removeItem('access_token');
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
            "Content-Type": 'multipart/form-data'
        }
    })

    const setAuthorizationHeader = (token) => {
        http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return {
        http,
        accessToken,
        refreshToken,
        getAccessToken,
        getRefreshToken,
        hasAccessToken,
        hasRefreshToken,
        setAuthorizationHeader,
        saveToken,
        logout,
    }
}