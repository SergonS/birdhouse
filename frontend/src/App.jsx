// React
import { Navigate, Route, Routes } from 'react-router-dom';
// Pages
import HomePage from './pages/home/HomePage.jsx'
import LoginPage from './pages/auth/login/LoginPage.jsx';
import SignUpPage from './pages/auth/signup/SignUpPage';
import NotificationPage from './pages/notification/NotificationPage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
// Components
import Sidebar from './components/common/Sidebar.jsx';
import RightPanel from './components/common/RightPanel.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
// Tanstack
import { useQuery } from '@tanstack/react-query';
// Toast
import { Toaster } from 'react-hot-toast';

function App() 
{
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async() => {
      try
      {
        // Get
        const res = await fetch("/api/auth/me");

        // Receiving response
        const data = await res.json();

        // Verify if user is unauthorized
        if (data.error)
        { 
          return null;
        }

        // Check for errors
        if (!res.ok)
        {
          throw new Error(data.error || "Something went wrong");
        }

        console.log("authUser is here: ", data);
        return data;
      }
      catch (error)
      {
        throw new Error(error);
      }
    },
    retry : false,
  });

  if (isLoading)
  {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  return (
    <div className='flex max-w-6xl mx-auto'>
      {/* Common component*/}
      {authUser && <Sidebar />}
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
};

export default App;
