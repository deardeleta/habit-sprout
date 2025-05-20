import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react';



const Modal = ({mode, setShowModal, getData, habit}) => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const editMode = mode === "edit" ? true : false

    const [data, setData] = useState({
      user_email: editMode ? habit.user_email : cookies.Email,
      title: editMode ? habit.title : null,
      progress: editMode ? habit.progress : 50,
      date: editMode ? habit.date : new Date()
    })

    const postData = async (e) => {
      e.preventDefault();
      console.log('Form Submitted!', data);
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/habits`, {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        })
        if(response.status===200){
          console.log('WORKED')
          setShowModal(false)
          getData()
        }

      } catch(err) {
        console.error(err)
      }
    }

    const editData = async(e) => {
      e.preventDefault()
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/habits/${habit.id}`, {
          method: 'PUT',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify(data)
        })
        if (response.status === 200) {
          setShowModal(false)
          getData()
        }
      } catch (err) {
        console.error(err)
      }
    }

   const handleChange = (e) => {
  
    const {name, value} = e.target

    setData(data => ({
      ...data, 
      [name] : value

    }))

    console.log(data)

   }

   const [quote, setQuote] = useState("");

useEffect(() => {
  fetch('http://localhost:5001/quote')
    .then(res => res.json())
    .then(data => setQuote(data.quote))
    .catch(err => console.error(err));
}, []);



  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your habit</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>

        <p className="quote-banner">{quote}</p>

        <form>
          <input
            required
            maxLength={30}
            placeholder="Your habit goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br/>
          <label for="range">Drag to select your current progress</label>
          <div className="range-label">{data.progress}%</div>
          <input 
            required
            type="range"
            id="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}
            style={{ '--progress': `${data.progress}%` }}
          />
          <input className={mode} type="submit" onClick={editMode ? editData: postData}/>
        </form>

      </div>
    </div>
  );
}

export default Modal;