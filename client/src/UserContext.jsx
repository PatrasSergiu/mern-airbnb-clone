import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});


export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const getUserProfileData = async () => {
            try {
                if(!user) {
                    const {data} = await axios.get('/api/users/profile')
                    setUser(data);
                    setReady(true);
                }
            }
            catch (error) {
                console.log(error.message);
            }
        }

        getUserProfileData();
    }, [])

    return (
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    );
}