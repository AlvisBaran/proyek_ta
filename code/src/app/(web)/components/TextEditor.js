'use client'

import { Button } from '@mui/material'
import StarterKit from '@tiptap/starter-kit'
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField
} from 'mui-tiptap'
import { useRef } from 'react'
// import TextEditorMenuControl from './TextEditorMenuControl'
import useExtensions from '@/hooks/useExtension'
import { useEditor } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'

function TextEditor({ text, setText }) {
  const rteRef = useRef(null)
  const extensions = useExtensions({
    placeholder: 'Add your caption here...'
  })
  const editor = useEditor({
    extensions: [Document, Text, Paragraph, StarterKit, extensions],
    content: text,
    onUpdate({ editor }) {
      setText(editor.getHTML())
    }
  })
  return (
    <RichTextEditorProvider editor={editor}>
      <RichTextField
        controls={
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
            {/* Add more controls of your choosing here */}
          </MenuControlsContainer>
        }
      />
    </RichTextEditorProvider>
  )
}

export default TextEditor
