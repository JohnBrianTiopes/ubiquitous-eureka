import { useState } from 'react';
import MemoryGame from './Memorygame';

function StartMemoryGame(){
  const [showComponent, setShowComponent] = useState(null);

  return (
    <div>
        <h2>Super Cutesy Memory game</h2>
        <p>to test your Super Cutesy Memory!</p>
        <button onClick={() => setShowComponent('memory')}>Start Super Cutesy game</button>

        <div>
            {showComponent === 'memory' && <MemoryGame />}
        </div>
    </div>
  )
}

export default StartMemoryGame;