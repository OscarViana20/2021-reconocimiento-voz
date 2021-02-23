import { useState , useEffect} from "react";
import micon from "./images/micon.webp";
import mutedmic from "./images/mutedmic.png"
import { IconButton,  Typography } from "@material-ui/core";
import {NeonButton} from "./components/StyledComponents"
import './App.css';
import DisplayNotes from "./components/DisplayNotes";

//inicialización del reconicimiento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition

//configuración
mic.continuous = true;
mic.interimResults = true;
mic.lang = "es-ES";



function App() {
  const [isListening, setIslistening] = useState(false);
  const [note, setNote] = useState(null)
  
  const [savedNotestodo, setSavedNotestodo] = useState([]);
  const [savedNotesinprocess, setSavedNotesinprocess] = useState([]);
  const [savedNotesdone, setSavedNotesdone] = useState([]);
  
  const savedNotes = [
    {
      group: "todo",
      name: savedNotestodo,
    }, {
      group: "inprocess",
      name: savedNotesinprocess,
    }, {
      group: "done",
      name: savedNotesdone,
    }
  ]

  useEffect(() => {
    handleListen();
  }, [isListening])
  
  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue ...");
        mic.start()
      }
    } else {
        mic.stop();
        mic.onend = () => {
          console.log("Stopped the microphone on Click")
        }
    }
    mic.onstart = () => {
      console.log("Mic is on");
    }
    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript).join("");
      console.log(transcript);
      setNote(transcript);
      mic.onerror = (event) =>console.log(event.error)
    }
    }
  
 

  return (
    <>
      <div className="notes">
        <h1>Voice Notes</h1>
        <div className="microphone">
          <IconButton onClick={()=> setIslistening((prevState => !prevState))}>
            <img className="mic-icon" src={isListening ? micon : mutedmic} alt="microfono"/>
         </IconButton>
        </div>
        <div className="buttons">
        <NeonButton status="todo" disabled={!note } onClick={() => {
          setSavedNotestodo([...savedNotestodo, note])
          setNote("")
          
        } }>
          To do
        </NeonButton>
        <NeonButton status="inprocess" disabled={!note } onClick={() => {
          setSavedNotesinprocess([...savedNotesinprocess, note])
          setNote("")
        } }>
          In process
        </NeonButton>
        <NeonButton status="done" disabled={!note }  onClick={() => {
          setSavedNotesdone([...savedNotesdone, note])
          setNote("")
        } }>
          Done
        </NeonButton>
        </div>
        
        <Typography variant="h4" component="h2" gutterBottom>
          {note}
        </Typography>
        <DisplayNotes data={savedNotes}/>
      </div>
     
    </>
  );
}

export default App;
