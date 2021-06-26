import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { database } from '../services/firebase'

import googleIconImg from '../assets/images/google-icon.svg'
import logoImg from '../assets/images/logo.svg'
import logoWhiteImg from '../assets/images/logoWhite.svg'
import illustrationImg from '../assets/images/illustration.svg'

import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

import '../styles/auth.scss'

export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [newRoom, setNewRoom] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const { theme, toggleTheme } = useTheme()

  async function handleCreateRoom(event:FormEvent) {
    
    event.preventDefault()

    if (!user) {
      await signInWithGoogle()
    }

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

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode === '') {
      return
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get()

    if (!roomRef.exists()) {
      alert('Room does not exists.')
      return
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed.')
      return
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          { theme === 'light' 
            ? <Button onClick={toggleTheme}>Dark</Button>
            : <Button onClick={toggleTheme}>Light</Button>}
          {theme === 'light' ? (
            <img src={logoImg} alt="Letmeask" />
          ) : (
            <img src={logoWhiteImg} alt="Letmeask" />
          )}
          { !user 
              ? <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
              : <>
              <div className="separator">Crie uma sala</div>
                 
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
              </>
              }
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
