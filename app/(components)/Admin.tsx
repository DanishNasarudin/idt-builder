"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const initialCategories = [
  {
    category: "Product 1",
    text: "test",
  },
  {
    category: "Product 2",
    text: "test2",
  },
];

type Props = {};

function Admin({}: Props) {
  const { data: session } = useSession();
  const [allow, setAllow] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [expandBar, setExpandBar] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  // const updateEditorContent = (newContent: any) => {
  //   setEditorContent(newContent);
  // };

  // const [categoryComponents, setCategoryComponents] = useState([
  //   <AdminCategory updateEditorContent={updateEditorContent} />,
  // ]);

  // Fetch categories from Firestore

  // Text Editor initialisation
  // const editor = useEditor({
  //   extensions: [StarterKit],
  //   content: "test",
  //   onUpdate: ({ editor }) => {
  //     setEditorContent(editor.getText());
  //   },
  //   onCreate: ({ editor }) => {
  //     setEditorContent(editor.getText());
  //   },
  // });

  // const addCategory = () => {
  //   setCategoryComponents([
  //     ...categoryComponents,
  //     <AdminCategory updateEditorContent={updateEditorContent} />,
  //   ]);
  // };

  // const moveUp = (index) => {
  //   if (index === 0) return; // Can't move up the first element
  //   const newCategoryComponents = [...categoryComponents];
  //   const temp = newCategoryComponents[index];
  //   newCategoryComponents[index] = newCategoryComponents[index - 1];
  //   newCategoryComponents[index - 1] = temp;
  //   setCategoryComponents(newCategoryComponents);
  // };

  // const moveDown = (index) => {
  //   if (index === categoryComponents.length - 1) return; // Can't move down the last element
  //   const newCategoryComponents = [...categoryComponents];
  //   const temp = newCategoryComponents[index];
  //   newCategoryComponents[index] = newCategoryComponents[index + 1];
  //   newCategoryComponents[index + 1] = temp;
  //   setCategoryComponents(newCategoryComponents);
  // };

  const [rows, setRows] = useState(
    initialCategories.map((category) => ({
      ...category,
      added: false,
      id: uuidv4(),
    }))
  );

  const addRow = (rowIndex: number) => {
    const newRow = { ...rows[rowIndex], added: true, id: uuidv4() };
    rows.splice(rowIndex + 1, 0, newRow);
    setRows([...rows]);
  };

  const removeRow = (rowIndex: number) => {
    if (rowIndex >= 0) {
      rows.splice(rowIndex, 1);
      setRows([...rows]);
    }
  };

  useEffect(() => {
    const securePage = async () => {
      if (session) {
        if (session?.user?.email === "danishaiman2000@gmail.com") {
          setAllow(1);
          setLoading(false);
        } else {
          setAllow(0);
          setLoading(false);
          signOut();
        }
      }
    };
    securePage();
  }, [session]);

  if (loading) {
    return (
      <h2 className="flex flex-col justify-center items-center h-[100vh] text-center">
        Loading...
      </h2>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] text-center w-4/5 mx-auto">
      {allow === 1 ? (
        <div className="w-full">
          <h1>Admin</h1>
          <button onClick={() => signOut()}>Logout</button>
          {/* <p>{editorContent}</p> */}

          {/* Render categories */}
          {/* <div className="w-full flex">
            <div className="bg-zinc-900 w-[88%] mx-auto px-4 py-2 text-start">
              <div
                className=" w-full py-4"
                onClick={() => setExpandBar(!expandBar)}
              >
                Product 1
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
            <div className="w-[10%] flex flex-col h-[72px]">
              <button className="bg-zinc-900 h-full border-b-[1px] border-white/10">
                Up
              </button>
              <button className="bg-zinc-900 h-full">Down</button>
            </div>
          </div> */}
          <div className="flex flex-col gap-4">
            <button
              className="bg-zinc-900 w-full mx-auto px-4 py-6 text-start"
              onClick={() => addRow(0)}
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1>Not Admin</h1>
          <button onClick={() => signOut()}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Admin;
