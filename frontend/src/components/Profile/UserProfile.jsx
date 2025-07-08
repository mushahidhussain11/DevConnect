import React from 'react'
import { useState,useEffect } from 'react'
import UserInfo from './UserInfo'
import { useParams } from 'react-router-dom'
import { getProfileUser } from '../../features/user/userSlice'
import { useDispatch,useSelector } from 'react-redux'
import UserInfoLoadingSkeleton from '../UserInfoLoadingSkeleton'
import UserPosts from './UserPosts'
import UserSettings from './UserSettings'

const UserProfile = () => {


    console.log("running")
  const dispatch = useDispatch();
  const { id } = useParams();

  console.log(id)

  const { user } = useSelector((state) => state.auth);
  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postsChecked, setPostsChecked] = useState(true);
  const [projectsChecked, setProjectsChecked] = useState(false);
  const [settingsChecked, setSettingsChecked] = useState(false);


  useEffect(() => {
    const getCurrentProfile = async () => {
    setIsLoading(true);
      try {
       const res = await dispatch(getProfileUser({id}));
        setProfileUser(res?.payload?.user);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    getCurrentProfile();
  }, [dispatch,id]);

  return (
   <>
    <div>
        {isLoading ? (
          <UserInfoLoadingSkeleton />
        ) : (
          <UserInfo profileUser={profileUser} currentUser={user?.user} postsChecked={postsChecked} setPostsChecked={setPostsChecked} projectsChecked={projectsChecked} setProjectsChecked={setProjectsChecked} settingsChecked={settingsChecked} setSettingsChecked={setSettingsChecked} />
        )}
    </div>
    <div>
      {postsChecked && <UserPosts id={id} />}
    </div>
    <div>
      {settingsChecked && <UserSettings id={id} />}
    </div>
   </>
  )
}

export default UserProfile