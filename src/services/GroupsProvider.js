import { useState, useContext, useMemo, createContext } from 'react';
import useFirestore from '../hooks/useFirestore';
import { AuthContext } from './AuthProvider';

export const GroupsContext = createContext();

function GroupsProvider({ children }) {
    const [chooseGroup, setChooseGroup] = useState('')
    const [inviteMember, setInviteMember] = useState(false)
    const data = useContext(AuthContext)

    // Lang nghe su thay doi cua collection groups
    const groupsCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: `${data.uid}`,
        }
    }, [data.uid])
    const groups = useFirestore('groups', groupsCondition)

    const groupChoosed = useMemo(() => {
        return groups.find(group => group.id === chooseGroup) || {}
    }, [groups, chooseGroup])

    // Lang nghe su thay doi cua collection members
    const membersCondition = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: groupChoosed.members,
        }
    }, [groupChoosed.members])
    const members = useFirestore('users', membersCondition)

    return ( 
        <GroupsContext.Provider value={
        {groups,
         members,
         chooseGroup,
         setChooseGroup,
         groupChoosed,
         inviteMember, 
         setInviteMember
        }}>
            {children}
        </GroupsContext.Provider>
     );
}

export default GroupsProvider;