import { useEffect, useContext, useState, useMemo } from 'react';
import { Form, Modal, Select, Avatar } from 'antd';
import { getDocs, collection, query, where, doc, updateDoc } from 'firebase/firestore';
import { GroupsContext } from './GroupsProvider';
import { AuthContext } from './AuthProvider';
import { debounce } from 'lodash';
import { db } from '../storage/firebase';

function DebounceSelect({
  fetchOptions,
  debounceTimeout = 1000,
  curMembers,
  ...props
}) {

  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, curMembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions, curMembers]);

    useEffect(() => {
    return () => {
      // clear when unmount
      setOptions([]);
    };
  }, []);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      {...props}
    >
      {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size='small' src={opt.photoURL}>
            {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
          </Avatar>
          {` ${opt.label}`}
        </Select.Option>
      ))}
    </Select>
  );
}

async function fetchUserList(search, curMembers) {
    const values = []
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('keywords', 'array-contains', search))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        values.push(doc.data())
    });
    
    return (values.map(value => ({
      label: value.displayName,
      value: value.uid,
      photoURL: value.photoURL,
    })).filter((opt) => !curMembers.includes(opt.value)))
}

export default function InviteMemberModal() {
  const {
    setInviteMember,
    inviteMember,
    groupChoosed,
  } = useContext(GroupsContext);
  const user = useContext(AuthContext)
  const [value, setValue] = useState([]);
  const [form] = Form.useForm();

  const handleOk = () => {
    // reset form value
    form.resetFields();
    setValue([]);

    // update members in current room
    if(user.uid === groupChoosed.isGroupBoss) {
      const groupRef = doc(db, 'groups', groupChoosed.id);
      updateDoc(groupRef, {
        members: [...groupChoosed.members, ...value.map((val) => val.value)],
      });
    } else {
      alert('No more allowed')
    }
    setInviteMember(false);
  };

  const handleCancel = () => {
    // reset form value
    form.resetFields();
    setValue([]);

    setInviteMember(false);
  };

  return (
    <div>
      <Modal
        title='Mời thêm thành viên'
        open={inviteMember}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form form={form} layout='vertical'>
          <DebounceSelect
            mode='multiple'
            name='search-user'
            label='Tên các thành viên'
            value={value}
            placeholder='Nhập tên thành viên'
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: '100%' }}
            curMembers={groupChoosed.members}
          />
        </Form>
      </Modal>
    </div>
  );
}