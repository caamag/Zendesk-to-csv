import './App.css';
import { useState } from 'react'

//components
import Macros from './components/macros';
import Forms from './components/forms';
import Articles from './components/articles';
import Groups from './components/groups';

function App() {

  const stages = [
    { name: 'initial' },
    { name: 'macro' },
    { name: 'form' },
    { name: 'articles' },
    { name: 'groups' }
  ]

  const [stage, setStages] = useState(stages[0].name)

  function backToInitial() {
    setStages(stages[0].name)
  }

  function dateFormat(data) {
    const date = new Date(data)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear())
    return `${day}/${month}/${year}`
  }

  return (
    <div className="App">

      <section className='container'>
        {stage === 'initial' && <>

          <button className='btn' onClick={() => { setStages(stages[1].name) }}>Macros</button>
          <button className='btn' onClick={() => { setStages(stages[2].name) }}>Formulário</button>
          <button className='btn' onClick={() => { setStages(stages[3].name) }}>Artigos</button>
          <button className='btn' onClick={() => { setStages(stages[4].name) }}>Grupos</button>

        </>}
      </section>

      <section className='container'>

        {stage === 'macro' && <Macros backToInitial={backToInitial} dateFormat={dateFormat} />}
        {stage === 'form' && <Forms backToInitial={backToInitial} />}
        {stage === 'articles' && <Articles backToInitial={backToInitial} dateFormat={dateFormat} />}
        {stage === 'groups' && <Groups backToInitial={backToInitial} />}

      </section>

    </div>
  );
}

export default App;