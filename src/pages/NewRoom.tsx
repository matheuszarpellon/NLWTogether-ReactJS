import { FormEvent, useState } from "react"
import { Link, useHistory } from "react-router-dom"

import illustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"
import logoWhiteImg from "../assets/images/logoWhite.svg"

import { Button } from '../components/Button'
import { database } from "../services/firebase"
import { useAuth } from "../hooks/useAuth"
import { useTheme } from "../hooks/useTheme"

import '../styles/auth.scss'




export function NewRoom() {
  const { user } = useAuth()
  const [newRoom, setNewRoom] = useState('')
  const history = useHistory()
  const { theme, toggleTheme } = useTheme()

  async function handleCreateRoom(event:FormEvent) {
    event.preventDefault()

    if(newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms')

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    history.push(`/rooms/${firebaseRoom.key}`)
  }
  return (
    <div id='page-auth' className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
        <h1>{theme}</h1>
          <button onClick={toggleTheme}>Toggle</button>
          {theme === 'light' ? <img src={logoImg} alt="Letmeask" /> : <img src={logoWhiteImg} alt="Letmeask" />}
          
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
              name=""
              id=""
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}