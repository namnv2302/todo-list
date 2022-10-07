import { useState, useContext } from 'react';
import { v4 } from 'uuid';
import classNames from 'classnames/bind';
import SignOutIcon from '@atlaskit/icon/glyph/sign-out';
import AddIcon from '@atlaskit/icon/glyph/add';
import PeopleGroupIcon from '@atlaskit/icon/glyph/people-group';
import HomeIcon from '@atlaskit/icon/glyph/home';
import { logout } from '../../authen/functions';
import styles from './Sidebar.module.scss';
import { AuthContext } from '../../services/AuthProvider';
import { GroupsContext } from '../../services/GroupsProvider';
import addDocument from '../../services/addDocument';

const cx = classNames.bind(styles);

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [nameGroup, setNameGroup] = useState('')
    const data = useContext(AuthContext);
    const { groups, setChooseGroup } = useContext(GroupsContext)

    const handleCreateGroup = () => {
        if(nameGroup.trim()) {
            const valueGroup = {
                id: v4(),
                title: nameGroup,
                members: [`${data.uid}`],   
                isGroupBoss: `${data.uid}`
            }
            addDocument('groups', valueGroup)
        }
        setNameGroup('')
        setIsOpen(false)
    }

    return ( 
        <div className={cx('sidebar')}>
            <div className={cx('profile')}>
                <div className={cx('image')}>
                    <img src={data.photoURL || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwoHCAoJBwkGCAoHCAoICAcIDRIICQcKFREWFhURExMYHCggGCYxGxMTITEhMSkrLi4uFx8zODMsNygtLisBCgoKCw0NDw0NFS0dHxkrKysrKysrLSsrKysrLTcrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAN8A2QMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAQIFBgQDB//EADYQAQACAgEBBQUFBwUBAAAAAAABAgMRBAUSISIxUjJBUXKSExVCYmMzNFNhcYKiIyRzgZEU/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEB/9oADAMBAAIRAxEAPwD9EAaQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADv8AKO+WhxelXyx2s9vs49NfaBn7g3DocXTsOOPY7XzPrHHw/wAKn0lHM7PN0l+FhtGpxU/6ePkdIraJnDOvyyUY4vkxWwTNMlOzKgAAAAAAAAAAAAAAAAAAAPRwMP8A9GaKx3xXxWBodK4PZiMuaN3nyaceZEajUR3R3JZVIACJSA83K4teTSa2jv8Aw2c9mx2w3mlvc6lldZwbrGWI12PaUZAfzFQAAAAAAAAAAAAAAAAavQsf7TJP4vZZTc6LH+2j49pBogIoAAACJfHmY4yYL1n0vuraNxMT74BykfD0i2SIjJeI/DZVpAAAAAAAAAAAAAAAABudE/d/7mG1eh5Y1fHv2fEitgRuEoAAAACLd0TMpefm5Ix4L2mdeHsg5y87yZJ9VrKnf5yNIAAAAAAAAAAAAAAAAT5Ptw808fNS8eXs2fEB1dbRaItHvWY3SebFI+xzW+SzY3DKpERO0gAjcAT5MfrXI76YqTv1PdzeVXj1nxeO3s1c9e9sl5vbzsuYI7/eAqAAAAAAAAAAAAAAAAAAHm0OF1S2KOxyPFWPZyM81sHTYeRjyxE0vSX23Hm5OImPJb7S8RqMmX6kiuotetY3a2ng5PVaUia4fFdi2ta0atO/62RqI8u4gtlyXzW7eSe9UGsQAQAAAAAAAAAAAAAADcL4sVs89jFG5a3F6VSmr5/9S/p/CDKxYb5v2dLz/g9ePpOW/fbsVbdaxXurGo/kmPNKrIjo1vfl1/RP3P8Ar3+lsBRj/c/69/pPuf8AXv8AS2Aox/uf9e/0n3P+vf6WwFGPPR592b/F87dIyxG65KS3ET3lHNZuFmxe1TcflfCe7unudXO3m5PBxciPFXU+qCjnR6eZwr8ad9ndPU8yoAAAAAAAAAAPtx+PbkXilPrfGImZ7NfOzouBxY42OI7Pjn2rGi/F4teNTsUj5p9T7wlG4ZVIjcG4BIhIAhIAIBII3AJRPkbg3AK3rFomt43EsPqHAnBPbxd+P0+lvT/6rakWia2jcSDlfdsenncaeNkmPwX9l5mkAAAAAAAJ8gaHSMEZcn2lo7qVbW+95emYoxcakfHxPQmqts3CogtuDcKgLbNqgLbNqgLbNqgLbNwqAtuDcKgLbN/FUB5+p4Iz4ZmPOrA13fK6ie+NfHwua5FPssuSn5lxHzAUAAAADW5iPzCY84+aoOjw+HHSvpqvtSs+GPlSC2zapALbNo3BuATs2jcEgnZtUgFtm0SgFtm1QFtm1QFtm1UAvtidVr2eRM/GvabLI6v+8R/xA8IAAAAAB74+aoA6OvsRP5Tb4cHLOTDG/OKvuBs2AGzYAbNgBs2AGzYAbNgBs2AGzYAbZPVpic8a/hNWZ1G/SwuXknLmvf8AtB8gAAAf/9k='} alt="" />
                </div>
                <p className={cx('name')}>{data.displayName || 'No name'}</p>
            </div>
            <div className={cx('menu')}>
                <div className={cx('home')} onClick={() => setChooseGroup('')}>
                    <HomeIcon />
                    <span>Home</span>
                </div>
                <div className={cx('group')}>
                    <PeopleGroupIcon />
                    <span>Group</span>
                </div>
                <div className={cx('group-list')}>
                    {groups.map((group, index) => (
                        <div key={index} className={cx('group-item')} onClick={() => setChooseGroup(group.id)}>
                            <p>{group.title}</p>
                        </div>
                    ))}
                    <div className={cx('create-group')} onClick={() => setIsOpen(true)}>
                        <AddIcon />
                        <span>Create</span>
                    </div>
                </div>
                <div className={cx('logout')} onClick={logout}>
                    <SignOutIcon />
                    <span>Logout</span>
                </div>
            </div>
            {isOpen && <div className={cx('create-modal')}>
                <div className={cx('create-body')}>
                    <h3>Create group</h3>
                    <div className={cx('input')}>
                        <input 
                            type='text'
                            placeholder='Enter name group...'
                            value={nameGroup}
                            onChange={(e) => setNameGroup(e.target.value)}
                        />
                    </div>
                    <div className={cx('button')}>
                        <button onClick={handleCreateGroup}>Create</button>
                        <button onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </div>
            </div>}
        </div>
     );
}

export default Sidebar;