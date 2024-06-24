"use client";
import "@blocknote/core/fonts/inter.css";
import { SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { useTheme } from "next-themes";
import { BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems, getDefaultSlashMenuItems } from "@blocknote/core";

interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
};

const Editor = ({
    onChange,
    initialContent,
    editable
}: EditorProps) => {
    const { resolvedTheme } = useTheme();

    const editor: BlockNoteEditor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    });

    return (
        <BlockNoteView 
            editor={editor}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            editable={editable}
            onChange={() => {onChange(JSON.stringify(editor.document, null, 2))}}
        />
    );
}

export default Editor;