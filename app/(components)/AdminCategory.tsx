"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

type Props = {
  rowIndex: number;
  removeRow: (rowIndex: number) => void;
  textEditor: string;
  category: string;
  added: boolean;
};

function AdminCategory({ rowIndex, removeRow, textEditor, category }: Props) {
  const [expandBar, setExpandBar] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  // Text Editor initialisation
  //   const editor = useEditor({
  //     extensions: [StarterKit],
  //     content: "test",
  //     onUpdate: ({ editor }) => {
  //       setEditorContent(editor.getText());
  //     },
  //     onCreate: ({ editor }) => {
  //       setEditorContent(editor.getText());
  //     },
  //   });

  const editor = useEditor({
    extensions: [StarterKit],
    content: textEditor,
    onUpdate: ({ editor }) => {
      const newContent = editor.getText();
      setEditorContent(newContent);
    },
    onCreate: ({ editor }) => {
      const newContent = editor.getText();
      setEditorContent(newContent);
    },
  });

  const handleRemoveRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (rowIndex >= 0) {
      removeRow(rowIndex);
    }
  };

  return (
    <div className="w-full flex">
      <div className="bg-zinc-900 w-full mx-auto px-4 py-2 text-start">
        <div className=" w-full py-4" onClick={() => setExpandBar(!expandBar)}>
          {category}
        </div>
        <div
          className={`grid overflow-hidden transition-all
      ${expandBar ? "my-4 grid-rows-[1fr]" : "my-0 grid-rows-[0fr]"}`}
        >
          <div
            className={`min-h-[0] bg-white text-black
      ${expandBar ? "px-2 py-2" : ""}`}
          >
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
      <div className="w-[72px] flex flex-col h-[72px] ml-4">
        <button className="bg-zinc-900 h-full border-b-[1px] border-white/10">
          Up
        </button>
        <button className="bg-zinc-900 h-full">Down</button>
      </div>
    </div>
  );
}

export default AdminCategory;
