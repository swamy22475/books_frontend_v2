import React, { useRef, useState, useEffect } from 'react';
import './RichTextEditor.css';
import {
    Bold, Italic, Underline, List, ListOrdered, Link, Image,
    AlignLeft, AlignCenter, AlignRight, AlignJustify, Type
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);
    const [editorValue, setEditorValue] = useState(value || "");

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || "";
        }
    }, [value]);

    const handleInput = () => {
        const html = editorRef.current.innerHTML;
        setEditorValue(html);
        if (onChange) {
            onChange(html);
        }
    };

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus(); // Keep focus
            handleInput(); // Update state
        }
    };

    const ToolbarButton = ({ command, icon: Icon, active, disabled, title }) => (
        <button
            type="button"
            className={`rte-btn ${active ? 'active' : ''}`}
            onMouseDown={(e) => {
                e.preventDefault(); // Prevent losing focus
                execCommand(command);
            }}
            disabled={disabled}
            title={title}
        >
            <Icon size={16} />
        </button>
    );

    return (
        <div className="rte-container">
            <div className="rte-toolbar">
                <ToolbarButton command="bold" icon={Bold} title="Bold" />
                <ToolbarButton command="italic" icon={Italic} title="Italic" />
                <ToolbarButton command="underline" icon={Underline} title="Underline" />

                <div className="rte-separator" />

                <ToolbarButton command="justifyLeft" icon={AlignLeft} title="Align Left" />
                <ToolbarButton command="justifyCenter" icon={AlignCenter} title="Align Center" />
                <ToolbarButton command="justifyRight" icon={AlignRight} title="Align Right" />

                <div className="rte-separator" />

                <ToolbarButton command="insertUnorderedList" icon={List} title="Bullet List" />
                <ToolbarButton command="insertOrderedList" icon={ListOrdered} title="Ordered List" />

                <div className="rte-separator" />

                <button
                    type="button"
                    className="rte-btn"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        const url = prompt("Enter Image URL:");
                        if (url) execCommand("insertImage", url);
                    }}
                    title="Insert Image"
                >
                    <Image size={16} />
                </button>
                <button
                    type="button"
                    className="rte-btn"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        const url = prompt("Enter Link URL:");
                        if (url) execCommand("createLink", url);
                    }}
                    title="Insert Link"
                >
                    <Link size={16} />
                </button>
            </div>

            <div
                ref={editorRef}
                className="rte-content"
                contentEditable
                onInput={handleInput}
                placeholder={placeholder}
                spellCheck={false}
            />
        </div>
    );
};

export default RichTextEditor;
