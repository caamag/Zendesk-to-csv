import './App.css';
import { useState } from 'react'

//components
import Macros from './components/macros';
import Forms from './components/forms';
import Views from './components/views';
import Groups from './components/groups';

function App() {

  const stages = [
    {name: 'initial'},
    {name: 'macro'}, 
    {name: 'form'},
    {name: 'views'},
    {name: 'groups'}
  ]

  const [stage, setStages] = useState(stages[0].name)

  function backToInitial () {
    setStages(stages[0].name)
  }

  return (
    <div className="App">

      <section className='container'>
        {stage === 'initial' && <>
        
          <button className='btn' onClick={() => {setStages(stages[1].name)}}>Macros</button>
          <button className='btn' onClick={() => {setStages(stages[2].name)}}>Formulário</button>
          <button className='btn' onClick={() => {setStages(stages[3].name)}}>Visualizações</button>
          <button className='btn' onClick={() => {setStages(stages[4].name)}}>Grupos</button>
        
        </>}
      </section>

      <section className='container'>

        {stage === 'macro' && <Macros backToInitial={backToInitial}/>}
        {stage === 'form' && <Forms backToInitial={backToInitial}/>}
        {stage === 'views' && <Views backToInitial={backToInitial}/>}
        {stage === 'groups' && <Groups backToInitial={backToInitial}/>}

      </section>

    </div>
  );
}

export default App;