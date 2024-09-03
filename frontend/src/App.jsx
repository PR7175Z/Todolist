import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Form from './components/Form'
import Header from './components/Header'
import List from './components/List'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Form/>
      <List/>
    </>
  )
}

export default App
