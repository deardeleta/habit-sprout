import Auth from './components/Auth';
import ListHeader from './components/ListHeader';
import ListItem from './components/ListItem';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import logo from './assets/logo.png'; // Ensure this file exists

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [habits, setHabits] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/habits/${userEmail}`);
      const json = await response.json();
      console.log(json);
      setHabits(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, []);

  const sortedHabits = habits?.sort((a, b) => new Date(a.date) - new Date(b.date));

  const signOut = () => {
    removeCookie('Email');
    removeCookie('AuthToken');
    window.location.reload();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand-container">
          <img src={logo} alt="HabitSprout logo" className="app-logo" />
          <div className="app-brand">
            <h1 className="app-title">HabitSprout</h1>
            <p className="tagline">Grow habits that stick.</p>
          </div>
        </div>
        {authToken && (
          <button className="signout" onClick={signOut}>
            Sign Out
          </button>
        )}
      </header>

      <div className="app">
        {!authToken && <Auth />}
        {authToken && (
          <>
            <ListHeader listName={'🌱 All Habits'} getData={getData} />
            <p className="user-email">Welcome back {userEmail}</p>
            {sortedHabits?.map((habit) => (
              <ListItem key={habit.id} habit={habit} getData={getData} />
            ))}
          </>
        )}
        <p className="copyright">© 2025 Deleta Akram</p>
      </div>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} HabitSprout. Built with consistency.</p>
      </footer>
    </div>
  );
};

export default App;
