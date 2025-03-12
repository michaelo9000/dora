import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db, WordTypes, getWordTypeName } from "../infra/data";

export default function WordList(props){
    const initialSelectedType = 0;
    const [input, setInput] = useState();
    const [selectedType, setType] = useState(initialSelectedType);
    const knownWords = useLiveQuery(() => db.words.toArray()) ?? [];

    function submitWord(e){
        e.preventDefault();
        if (!input){
            props.reportError("Enter a word dingus!");
            return;
        }
        // TODO check if word exists
        db.words.add({value: input, type: selectedType});
    }

    function deleteWord(e, id){
        e.preventDefault();
        db.words.delete(id);
    }
    
    if (!props.isActive) 
        return <></>

    return <div className="word-list-body">
        <form className="content-row" onSubmit={(e) => submitWord(e)}>
            <input value={input || ''} onChange={e => setInput(e.target.value)} placeholder="New word"/>
            <select onChange={(e) => setType(e.target.value)} defaultValue={initialSelectedType}>
                {Object.entries(WordTypes).map((i, idx) =>
                    <option key={idx} value={i[1]}>
                        {i[0]}
                    </option>
                )}
            </select>
            <button>ADD</button>
        </form>
        {knownWords.map((i, idx) => 
            <form key={idx} className="content-row" onSubmit={(e) => deleteWord(e, i.id)}>
                <p className="word-list-word">{i.value}</p>
                <p className="word-list-type">{getWordTypeName(i.type)}</p>
                <button>REMOVE</button>
            </form>
        )}
    </div>
}