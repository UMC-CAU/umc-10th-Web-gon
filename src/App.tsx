
import './App.css'
import Todo from './components/Todo'
import { TodoProvider } from './contexts/TodoContext'

function App() {


  return (
    <TodoProvider>
      <Todo/>
    </TodoProvider>
  )
}

export default App
