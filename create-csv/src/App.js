import './App.css';

import { useState } from 'react'

//components
import Macros from './components/macros';

function App() {

  const stages = [
    {name: 'initial'},
    {name: 'macro'}, 
    {name: 'form'}
  ]

  const [stage, setStages] = useState(stages[0].name)

  return (
    <div className="App">

      <section className='container'>
        {stage === 'initial' && <>
        
          <button className='btn' onClick={() => {setStages(stages[1].name)}}>Macros</button>
          <button className='btn' onClick={() => {setStages(stages[2].name)}}>Formulário</button>
        
        </>}
      </section>

      <section className='container'>

        {stage === 'macro' && <Macros />}

      </section>

    </div>
  );
}

export default App;