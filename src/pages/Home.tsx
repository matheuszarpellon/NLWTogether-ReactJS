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

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()

    if (!user) {
      await signInWithGoogle()
    }

    if (newRoom.trim() === '') {
      return
    }

    const roomRef = database.ref('rooms')

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id
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
        <div className="status">
        {theme === 'light' ? (
          <Button id= "btn-theme" onClick={toggleTheme}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z"/></svg></Button>
          ) : (
            <Button id="btn-theme" onClick={toggleTheme}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" fill="#ffffff"/></svg></Button>
            )}
        </div>
      <main>
        <div className="main-content">
          {theme === 'light' ? (
            <img src={logoImg} alt="Letmeask" />
          ) : (
            <img src={logoWhiteImg} alt="Letmeask" />
          )}
          {!user ? (
            <button className="create-room" onClick={handleCreateRoom}>
              <img src={googleIconImg} alt="Logo do Google" />
              Crie sua sala com o Google
            </button>
          ) : (
            <>
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
                <Button type="submit">Criar sala</Button>
              </form>
            </>
          )}
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
