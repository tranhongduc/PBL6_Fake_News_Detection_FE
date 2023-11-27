import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { removeAvatar } from "../redux/actions";
import { toast } from "react-toastify";

export default function AuthUser() {
    const navigate = useNavigate();

    const hasAccessToken = () => {
        const accessTokenString = localStorage.getItem('access_token');
        return !!accessTokenString
    }

    const hasRefreshToken = () => {
        const refreshTokenString = localStorage.getItem('refresh_token');
        return !!refreshTokenString
    }

    const hasUsername = () => {
        const usernameString = localStorage.getItem('username');
        return !!usernameString
    }

    const [accessToken, setAccessToken] = useState(() => {
        const accessTokenString = localStorage.getItem('access_token');
        const accessToken = JSON.parse(accessTokenString);
        return accessToken;
    });

    const [refreshToken, setRefreshToken] = useState(() => {
        const refreshTokenString = localStorage.getItem('refresh_token');
        const refreshToken = JSON.parse(refreshTokenString);
        return refreshToken;
    });

    const [role, setRole] = useState(() => {
        const roleString = localStorage.getItem('role');
        const role = JSON.parse(roleString);
        return role;
    });

    const [username, setUsername] = useState(() => {
        const usernameString = localStorage.getItem('username');
        const username = JSON.parse(usernameString);
        return username;
    });

    const [avatar, setAvatar] = useState(() => {
        const avatarString = localStorage.getItem('avatar');
        const avatar = JSON.parse(avatarString);
        return avatar;
    });

    const dispatch = useDispatch();

    const saveToken = (accessToken, refreshToken, user) => {
        localStorage.setItem('access_token', JSON.stringify(accessToken));
        localStorage.setItem('refresh_token', JSON.stringify(refreshToken));
        localStorage.setItem('role', JSON.stringify(user.role));
        localStorage.setItem('username', JSON.stringify(user.username));
        localStorage.setItem('avatar', JSON.stringify(user.avatar));

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setRole(user.role)
        setUsername(user.username)
        setAvatar(user.avatar)
    }

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('avatar');

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
        role,
        username,
        avatar,
        hasAccessToken,
        hasRefreshToken,
        hasUsername,
        setAuthorizationHeader,
        saveToken,
        logout,
    }
}