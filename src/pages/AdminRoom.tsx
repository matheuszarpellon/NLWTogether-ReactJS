import { useHistory, useParams, Link } from 'react-router-dom'

import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import logoImg from '../assets/images/logo.svg'
import logoWhiteImg from '../assets/images/logoWhite.svg'
import deleteImg from '../assets/images/delete.svg'

import { Question } from '../components/Question'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
// import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'

import '../styles/room.scss'
import { database } from '../services/firebase'
import { useTheme } from '../hooks/useTheme'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  // const { user } = useAuth()
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id
  const {theme, toggleTheme} = useTheme()

  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    })
  }

  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          {theme === 'light' ? (
            <Link to={'/'}><img src={logoImg} alt="Letmeask" /></Link>
          ) : (
            <Link to={'/'}><img src={logoWhiteImg} alt="Letmeask" /></Link>
          )}
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
            { theme === 'light' 
            ? <Button onClick={toggleTheme}>Dark</Button>
            : <Button onClick={toggleTheme}>Light</Button>}
            
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="remover pergunta" />
                </button>
              </Question>
            )
          })}
          <div id="footer" className={theme}>
            <Link to={`/rooms/${roomId}`}>
              <button id="admin">Voltar à sala</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
