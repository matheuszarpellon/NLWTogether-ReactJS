import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ThemeContextProvider } from './contexts/ThemeContext'
import { AuthContextProvider } from './contexts/AuthContext'
import { AdminRoom } from './pages/AdminRoom'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

import { Home } from './pages/Home'
import { Room } from './pages/Room'

function App() {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
        <AuthContextProvider>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/rooms/:id" component={Room} />

            <Route path="/admin/rooms/:id" component={AdminRoom} />
          </Switch>
        </AuthContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  )
}

export default App

serviceWorkerRegistration.register()
