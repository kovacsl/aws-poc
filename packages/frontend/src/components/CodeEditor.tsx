import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-lua";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";


export default function CodeEditor({
    code = "print(\"Hello World!\")",
    ...props
}) {
    return (
        <>
        <AceEditor
            height="20rem"
            width="100%"
            value={code}
            mode="lua"
            theme="github"
            fontSize="16px"
            highlightActiveLine={true}
            setOptions={{
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 2,
                useWorker: false,
                maxLines: Infinity,
            }}
            {...props}
        />
        </>
    );
}